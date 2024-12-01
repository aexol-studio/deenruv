import { Inject, Injectable } from '@nestjs/common';
import { assertNever } from '@deenruv/common/lib/shared-utils';

import { Logger, Order, RequestContext, TransactionalConnection, TtlCache } from '@deenruv/core';
import {
    endOfDay,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfYear,
    endOfMonth,
    endOfWeek,
    addDays,
    eachDayOfInterval,
} from 'date-fns';
import { BetterMetricInterval, ChartMetricType, GraphQLTypes, ResolverInputTypes } from '../zeus';
import { DashboardWidgetsPluginOptions, MetricResponse } from '../types';
import {
    CHART_DATA_AVERAGE_VALUE_QUERY_SELECT,
    CHART_ORDER_COUNT_QUERY_SELECT,
    CHART_ORDER_TOTAL_QUERY_SELECT,
    ORDERS_SUMMARY_QUERY_SELECT,
} from '../raw-sql';
import { DEFAULT_CACHE_TIME, PLUGIN_INIT_OPTIONS } from '../constants';

export type MetricData = {
    date: Date;
    orders: MetricResponse[];
};

const MAPPINGS = {
    [ChartMetricType.OrderCount]: {
        title: 'order-count',
        query: CHART_ORDER_COUNT_QUERY_SELECT,
    },
    [ChartMetricType.OrderTotal]: {
        title: 'order-total',
        query: CHART_ORDER_TOTAL_QUERY_SELECT,
    },
    [ChartMetricType.AverageOrderValue]: {
        title: 'average-order-value',
        query: CHART_DATA_AVERAGE_VALUE_QUERY_SELECT,
    },
    [ChartMetricType.OrderTotalProductsCount]: {
        title: 'order-products-count',
    },
};
type ChartMetricCacheType = GraphQLTypes['ChartMetrics'] & {
    metricType?: string;
};
type OrderSummaryCacheType = GraphQLTypes['OrderSummaryMetrics'] & {
    metricType?: string;
};
type CacheType = ChartMetricCacheType | OrderSummaryCacheType;
@Injectable()
export class BetterMetricsService {
    private cache: TtlCache<string, CacheType>;
    constructor(
        private connection: TransactionalConnection,
        @Inject(PLUGIN_INIT_OPTIONS)
        private options?: DashboardWidgetsPluginOptions,
    ) {
        this.options = options;
        this.cache = new TtlCache<string, CacheType>({
            ttl: this.options?.cacheTime ?? DEFAULT_CACHE_TIME,
        });
    }

    async getOrderSummaryMetric(
        ctx: RequestContext,
        { interval, refresh }: ResolverInputTypes['OrderSummaryMetricInput'],
    ): Promise<GraphQLTypes['OrderSummaryMetrics']> {
        const endDate = interval.end ? interval.end : endOfDay(new Date());
        const cacheKey = JSON.stringify({
            metricType: 'OrderSummary',
            startDate: interval.start,
            endDate,
            interval: interval.type,
            channel: ctx.channel.token,
        });
        const cachedMetrics = this.cache.get(cacheKey);

        if (cachedMetrics && refresh !== true) {
            Logger.verbose(
                `Returning cached metrics for channel ${ctx.channel.token}`,
                'BetterMetricsService',
            );

            delete cachedMetrics.metricType;
            return cachedMetrics as GraphQLTypes['OrderSummaryMetrics'];
        }
        const data = await this.loadSummaryOrdersData(ctx, {
            ...interval,
        });
        this.cache.set(cacheKey, {
            __typename: 'OrderSummaryMetrics',
            data: data as GraphQLTypes['OrderSummaryDataMetric'],
            lastCacheRefreshTime: new Date().toISOString() as any,
        });
        return {
            __typename: 'OrderSummaryMetrics',
            data,
            lastCacheRefreshTime: new Date().toISOString() as any,
        };
    }

    async getChartMetrics(
        ctx: RequestContext,
        { interval, types, refresh, productIDs }: ResolverInputTypes['ChartMetricInput'],
    ): Promise<GraphQLTypes['ChartMetrics']> {
        const endDate = interval.end ? interval.end : endOfDay(new Date());
        const cacheKey = JSON.stringify({
            metricType: 'Chart',
            startDate: interval.start,
            endDate,
            types: types.sort(),
            interval: interval.type,
            channel: ctx.channel.token,
        });
        const cachedMetrics = this.cache.get(cacheKey);

        if (cachedMetrics && refresh !== true) {
            Logger.verbose(
                `Returning cached metrics for channel ${ctx.channel.token}`,
                'BetterMetricsService',
            );

            delete cachedMetrics.metricType;
            return cachedMetrics as GraphQLTypes['ChartMetrics'];
        }

        Logger.verbose(
            `No cache hit, calculating ${interval.type} metrics until ${endDate} for channel ${
                ctx.channel.token
            } for all orders`,
            'BetterMetricsService',
        );
        const data = await this.loadChartData(ctx, {
            ...interval,
            // for now bcs we are using only one type
            metricType: types[0],
        });
        const metrics: GraphQLTypes['ChartMetrics'] = {
            __typename: 'ChartMetrics',
            data: [],
            lastCacheRefreshTime: new Date().toISOString() as any,
        };
        for (const type of types) {
            const entry = MAPPINGS[type];

            const entries: GraphQLTypes['ChartEntry'][] = [];
            data.response.forEach((dataPerDay: any) => {
                entries.push({
                    __typename: 'ChartEntry',
                    label: dataPerDay.label,
                    value:
                        'orderCount' in dataPerDay
                            ? dataPerDay.value / dataPerDay.orderCount
                            : dataPerDay.value,
                    ...('additionalData' in dataPerDay ? { additionalData: dataPerDay.additionalData } : {}),
                });
            });

            metrics.data.push({
                __typename: 'ChartDataType',
                interval: interval.type,
                title: entry.title,
                type,
                entries: entries,
            });
        }
        if (interval.type !== BetterMetricInterval.Custom && !productIDs) {
            this.cache.set(cacheKey, metrics);
        }
        return metrics;
    }

    async loadChartData(
        ctx: RequestContext,
        {
            type: interval,
            start,
            end,
            metricType,
        }: ResolverInputTypes['BetterMetricIntervalInput'] & {
            metricType: ChartMetricType;
        },
    ): Promise<{ response: any }> {
        const orderRepo = this.connection.getRepository(ctx, Order);
        let response: any;

        const today = new Date();
        let startDate: Date;
        let endDate: Date | undefined;
        switch (interval) {
            case BetterMetricInterval.Weekly: {
                startDate = startOfWeek(today, { weekStartsOn: 1 });
                endDate = endOfWeek(today, { weekStartsOn: 1 });
                break;
            }
            case BetterMetricInterval.Monthly: {
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                break;
            }
            case BetterMetricInterval.Yearly: {
                startDate = startOfYear(today);
                endDate = endOfYear(today);
                break;
            }
            case BetterMetricInterval.Custom: {
                startDate = start ? new Date(start as string) : startOfDay(today);
                endDate = end as Date | undefined;
                break;
            }
            default:
                assertNever(interval as never);
        }

        if (metricType === ChartMetricType.OrderTotalProductsCount) {
            let daysMapping: any[] = [];
            // here we have raw query bcs i dont have time to figure out how to properly build it with queryBuilder using nested query (now i know but i dont have time )

            // !!!!!!!!!IMPORTANT for now we are assuming that listPrice from orderLine includes tax IMPORTANT!!!!!!!!!

            const query = `
          WITH base_data AS (
            SELECT 
              extract(epoch from o."orderPlacedAt" - $1)::integer / 86400 + 1 AS "day",
              ol."productVariantId" AS "productVariantId",
              pt."languageCode" AS "languageCode",
              pt."name" AS "name",
              SUM(ol."quantity") AS "quantitySum",
              SUM(
                  (ol."listPrice" * ol."quantity" - ol."quantity" * COALESCE(ol."customFieldsDiscountby", 0) ) - COALESCE(
                    (SELECT SUM((adj->>'amount')::numeric)
                    FROM jsonb_array_elements(ol."adjustments"::jsonb) adj),
                    0
                  )
                ) AS "adjustedPriceSum"
            FROM "public"."order" o
            INNER JOIN "public"."order_channels_channel" occ ON occ."orderId" = o."id"
            INNER JOIN "public"."order_line" ol ON ol."orderId" = o."id"
            INNER JOIN "public"."product_variant" pv ON pv.id = ol."productVariantId"
            INNER JOIN "public"."product_translation" pt ON pt."baseId" = pv."productId"
            WHERE o."orderPlacedAt"::timestamptz >= $1
            AND occ."channelId" = $2
            ${endDate ? 'AND o."orderPlacedAt"::timestamptz <= $4' : ''}
            GROUP BY "day", ol."productVariantId", pt."languageCode", pt."name"
          )
          SELECT DISTINCT ON (base_data."day", base_data."productVariantId")
            base_data."day",
            base_data."productVariantId",
            base_data."name",
            base_data."quantitySum",
            base_data."adjustedPriceSum"
            FROM base_data
          ORDER BY base_data."day" ASC, base_data."productVariantId" ASC, 
          CASE WHEN base_data."languageCode" = $3 THEN 1 ELSE 2 END ASC, 
          base_data."languageCode" ASC;
`;
            // Parametry do zapytania
            const params = [
                startDate.toISOString(),
                ctx.channelId,
                ctx.languageCode,
                ...(endDate ? [endDate.toISOString()] : []),
            ];
            const result = await orderRepo.query(query, params);

            const reducedRes = (result as any[]).reduce((acc, curr) => {
                if (acc[curr.day]) {
                    acc[curr.day].value += +curr.quantitySum;
                    acc[curr.day].additionaldata.push({
                        name: curr.name,
                        id: curr.productVariantId,
                        quantity: +curr.quantitySum,
                        priceWithTax: +curr.adjustedPriceSum,
                    });
                } else {
                    acc[curr.day] = {
                        value: +curr.quantitySum,
                        additionaldata: [
                            {
                                name: curr.name,
                                id: curr.productVariantId,
                                quantity: +curr.quantitySum,
                                priceWithTax: +curr.adjustedPriceSum,
                            },
                        ],
                    };
                }
                return acc;
            }, {});
            if (endDate) {
                daysMapping = eachDayOfInterval({ start: startDate, end: endDate });
            } else {
                daysMapping = eachDayOfInterval({
                    start: startDate,
                    end: addDays(startDate, Object.keys(reducedRes).length - 1),
                });
            }

            const mappedResponse = Object.values(reducedRes).map((r: any, i: number) => ({
                label: daysMapping[i].toISOString(),
                value: r.value,
                additionalData: r.additionaldata,
            }));
            response = mappedResponse;
        } else {
            let daysMapping: any[] = [];
            const qb = orderRepo
                .createQueryBuilder('o')
                .innerJoin('order_channels_channel', 'occ', 'occ."orderId" = o.id')
                .select(MAPPINGS[metricType].query)
                .where('o."orderPlacedAt"::timestamptz >= :startDate::timestamptz', {
                    startDate: startDate.toISOString(),
                })
                .andWhere('occ.channelId = :channelId', { channelId: ctx.channel.id });
            if (endDate) {
                qb.andWhere('o."orderPlacedAt"::timestamptz <= :endDate::timestamptz', {
                    endDate: endDate.toISOString(),
                });
            }
            qb.groupBy('day').orderBy('day');

            const res = await qb.getRawMany();

            if (endDate) {
                daysMapping = eachDayOfInterval({ start: startDate, end: endDate }, {});
            } else {
                daysMapping = eachDayOfInterval({
                    start: startDate,
                    end: addDays(startDate, res.length - 1),
                });
            }

            const mappedResponse = res.map((r: any, i: number) => ({
                label: daysMapping[i].toISOString(),
                value: +r.value,
                ...('ordercount' in r ? { orderCount: +r.ordercount } : {}),
            }));

            response = mappedResponse;
        }

        return { response };
    }

    async loadSummaryOrdersData(
        ctx: RequestContext,
        { type: interval, start, end }: ResolverInputTypes['BetterMetricIntervalInput'],
    ): Promise<GraphQLTypes['OrderSummaryDataMetric']> {
        const orderRepo = this.connection.getRepository(ctx, Order);
        let response: any;

        const today = new Date();
        let startDate: Date;
        let endDate: Date | undefined;
        switch (interval) {
            case BetterMetricInterval.Weekly: {
                startDate = startOfWeek(today);
                endDate = endOfWeek(today);
                break;
            }
            case BetterMetricInterval.Monthly: {
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                break;
            }
            case BetterMetricInterval.Yearly: {
                startDate = startOfYear(today);
                endDate = endOfYear(today);
                break;
            }
            case BetterMetricInterval.Custom: {
                startDate = start ? new Date(start as string) : startOfDay(today);
                endDate = end as Date | undefined;
                break;
            }
            default:
                assertNever(interval as never);
        }
        const qb = orderRepo
            .createQueryBuilder('o')
            .innerJoin('order_channels_channel', 'occ', 'occ."orderId" = o.id')
            .select(ORDERS_SUMMARY_QUERY_SELECT)
            .where('o."orderPlacedAt"::timestamptz >= :startDate::timestamptz', {
                startDate: startDate.toISOString(),
            })
            .andWhere('occ.channelId = :channelId', { channelId: ctx.channel.id });
        if (endDate) {
            qb.andWhere('o."orderPlacedAt"::timestamptz <= :endDate::timestamptz', {
                endDate: endDate.toISOString(),
            });
        }
        qb.groupBy('day');
        const res = await qb.getRawMany();

        const reducedResponse = res.reduce(
            (acc, curr) => {
                acc.averageOrderValue += +curr.averagetotal;
                acc.averageOrderValueWithTax += +curr.averagewithtax;
                acc.orderCount += +curr.ordercount;
                acc.total += +curr.total;
                acc.totalWithTax += +curr.totalwithtax;
                return acc;
            },
            {
                currencyCode: ctx.currencyCode,
                __typename: 'OrderSummaryDataMetric',
                averageOrderValue: 0,
                averageOrderValueWithTax: 0,
                orderCount: 0,
                total: 0,
                totalWithTax: 0,
            } as GraphQLTypes['OrderSummaryDataMetric'],
        );
        return {
            currencyCode: reducedResponse.currencyCode,
            __typename: reducedResponse.__typename,
            averageOrderValue: reducedResponse.averageOrderValue.toFixed(2),
            averageOrderValueWithTax: reducedResponse.averageOrderValueWithTax.toFixed(2),
            orderCount: reducedResponse.orderCount,
            total: reducedResponse?.total.toFixed(2),
            totalWithTax: reducedResponse?.totalWithTax.toFixed(2),
        };
    }
}

// ========================================================================================
// THIS IS WORKING RAW QUERY WITHOUT COUNTIG ADJUSTED ORDERLINE SUM

// WITH base_data AS (
//   SELECT
//     extract(epoch from o."orderPlacedAt" - $1)::integer / 86400 + 1 AS "day",
//     ol."productVariantId" AS "productVariantId",
//     pt."languageCode" AS "languageCode",
//     pt."name" AS "name",
//     SUM(ol."quantity") AS "quantitySum"
//   FROM "public"."order" o
//   INNER JOIN "public"."order_channels_channel" occ ON occ."orderId" = o."id"
//   INNER JOIN "public"."order_line" ol ON ol."orderId" = o."id"
//   INNER JOIN "public"."product_translation" pt ON pt."baseId" = ol."productVariantId"
//   WHERE o."orderPlacedAt"::timestamptz >= $1
//   AND occ."channelId" = $2
//   ${endDate ? 'AND o."orderPlacedAt"::timestamptz <= $4' : ''}
//   GROUP BY "day", ol."productVariantId", pt."languageCode", pt."name"
// )
// SELECT DISTINCT ON (base_data."day", base_data."productVariantId")
//   base_data."day",
//   base_data."productVariantId",
//   base_data."name",
//   base_data."quantitySum"
//   FROM base_data
// ORDER BY base_data."day" ASC, base_data."productVariantId" ASC,
// CASE WHEN base_data."languageCode" = $3 THEN 1 ELSE 2 END ASC,
// base_data."languageCode" ASC;

// ========================================================================================

// this is raw query for total products count which is agregating data,
// for now i cant build it with queryBuilder as it is nested query
// need to use leftJoin on subQuery
// const query = orderRepo.query(
//   `
//   SELECT
//     day,
//     SUM(quantitySum) AS value,
//     json_agg(
//       json_build_object(
//         'productVariantName', pt_name,
//         'productVariantId', "productVariantId",
//         'value', quantitySum
//       )
//     ) AS additionalData
//   FROM (
//     SELECT
//       extract(epoch from o."orderPlacedAt" - $1)::integer / 86400 + 1 AS day,
//       ol."productVariantId",
//       pt."name" AS pt_name,
//       SUM(ol."quantity") AS quantitySum
//     FROM "public"."order" o
//     INNER JOIN "public"."order_channels_channel" "occ"
//       ON occ."orderId" = o."id"
//     INNER JOIN "public"."order_line" ol
//       ON ol."orderId" = o."id"
//     INNER JOIN "public"."product_translation" pt
//       ON pt."baseId" = ol."productVariantId"
//     WHERE o."orderPlacedAt"::timestamptz >= $1::timestamptz
//       ${endDate ? 'AND o."orderPlacedAt"::timestamptz <= $4::timestamptz' : ''}
//       AND occ."channelId" = $2
//       AND pt."languageCode" = $3
//       GROUP BY day, ol."productVariantId", pt."name"
//   ) AS subquery
//   GROUP BY day
//   ORDER BY day ASC;
//   `,
//   [
//     startDate.toISOString(),
//     ctx.channel.id,
//     ctx.languageCode,
//     ...(endDate ? [endDate.toISOString()] : []),
//   ],
// );
