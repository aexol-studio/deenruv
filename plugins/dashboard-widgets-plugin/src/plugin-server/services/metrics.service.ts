import { Inject, Injectable } from '@nestjs/common';

import { Logger, Order, RequestContext, TransactionalConnection, TtlCache } from '@deenruv/core';
import { endOfDay } from 'date-fns';
import { ChartMetricType, GraphQLTypes, ResolverInputTypes } from '../zeus';
import { DashboardWidgetsPluginOptions, MetricResponse } from '../types';
import {
    CHART_DATA_AVERAGE_VALUE_QUERY_SELECT,
    CHART_ORDER_COUNT_QUERY_SELECT,
    CHART_ORDER_TOTAL_QUERY_SELECT,
    formatTotalProductsCountQuery,
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
    [ChartMetricType.OrderTotalProductsValue]: {
        title: 'order-products-value',
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
        { range, refresh }: ResolverInputTypes['OrderSummaryMetricInput'],
    ): Promise<GraphQLTypes['OrderSummaryMetrics']> {
        const endDate = range.end ? range.end : endOfDay(new Date());
        const cacheKey = JSON.stringify({
            metricType: 'OrderSummary',
            startDate: range.start,
            endDate,
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
            ...range,
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
        { range, types, refresh, productIDs }: ResolverInputTypes['ChartMetricInput'],
    ): Promise<GraphQLTypes['ChartMetrics']> {
        const endDate = range.end ? range.end : endOfDay(new Date());
        const cacheKey = JSON.stringify({
            metricType: 'Chart',
            startDate: range.start,
            endDate,
            types: types.sort(),
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
            `No cache hit, calculating [${range.start} ${range.end ? `- ${range.end}` : ''} ] metrics until ${endDate} for channel ${
                ctx.channel.token
            } for all orders`,
            'BetterMetricsService',
        );
        const data = await this.loadChartData(ctx, {
            ...range,
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
            data.response?.forEach((dataPerDay: any) => {
                entries.push({
                    __typename: 'ChartEntry',
                    ...dataPerDay,
                });
            });

            metrics.data.push({
                __typename: 'ChartDataType',
                title: entry.title,
                type,
                entries: entries,
            });
        }

        this.cache.set(cacheKey, metrics);

        return metrics;
    }

    async loadChartData(
        ctx: RequestContext,
        {
            start,
            end,
            metricType,
        }: ResolverInputTypes['BetterMetricRangeInput'] & {
            metricType: ChartMetricType;
        },
    ): Promise<{ response: any }> {
        const orderRepo = this.connection.getRepository(ctx, Order);
        let response: any;
        const startDate = start as string;
        const endDate = end as string | undefined;

        if (
            metricType === ChartMetricType.OrderTotalProductsCount ||
            metricType === ChartMetricType.OrderTotalProductsValue
        ) {
            // here we have raw query bcs i dont have time to figure out how to properly build it with queryBuilder using nested query (now i know but i dont have time )

            // !!!!!!!!!IMPORTANT for now we are assuming that listPrice from orderLine includes tax IMPORTANT!!!!!!!!!
            const query = formatTotalProductsCountQuery({
                discountByCustomField: this.options?.discountByCustomField,
                endDate,
            });
            // Parametry do zapytania
            const params = [startDate, ctx.channelId, ctx.languageCode, ...(endDate ? [endDate] : [])];
            const isTotalProductsCount = metricType === ChartMetricType.OrderTotalProductsCount;
            const result = await orderRepo.query(query, params);

            const reducedRes = (result as any[]).reduce((acc, curr) => {
                if (acc[curr.day]) {
                    acc[curr.day].value += isTotalProductsCount ? +curr.quantitySum : +curr.adjustedPriceSum;
                    acc[curr.day].additionaldata.push({
                        name: curr.name,
                        id: curr.productVariantId,
                        quantity: +curr.quantitySum,
                        priceWithTax: +curr.adjustedPriceSum,
                    });
                } else {
                    acc[curr.day] = {
                        value: isTotalProductsCount ? +curr.quantitySum : +curr.adjustedPriceSum,
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

            const mappedResponse = Object.entries(reducedRes)?.map(([key, r]: [key: string, r: any]) => ({
                day: key,
                value: +(+r.value.toFixed(2)),
                additionalData: r.additionaldata,
            }));

            response = mappedResponse;
        } else {
            const qb = orderRepo
                .createQueryBuilder('o')
                .innerJoin('order_channels_channel', 'occ', 'occ."orderId" = o.id')
                .select(MAPPINGS[metricType].query)
                .where('o."orderPlacedAt"::timestamptz >= :startDate::timestamptz', {
                    startDate,
                })
                .andWhere('occ.channelId = :channelId', { channelId: ctx.channel.id });
            if (endDate) {
                qb.andWhere('o."orderPlacedAt"::timestamptz <= :endDate::timestamptz', {
                    endDate: endDate,
                });
            }
            qb.groupBy('day').orderBy('day');
            const res = await qb.getRawMany();
            const mappedResponse = res.map((r: any) => ({
                day: r.day,
                value: +('ordercount' in r ? +r.value / +r.ordercount : +r.value).toFixed(2),
            }));
            response = mappedResponse;
        }
        return { response };
    }

    async loadSummaryOrdersData(
        ctx: RequestContext,
        { start, end }: ResolverInputTypes['BetterMetricRangeInput'],
    ): Promise<GraphQLTypes['OrderSummaryDataMetric']> {
        const orderRepo = this.connection.getRepository(ctx, Order);

        const startDate = start as string;
        const endDate = end as string | undefined;

        const qb = orderRepo
            .createQueryBuilder('o')
            .innerJoin('order_channels_channel', 'occ', 'occ."orderId" = o.id')
            .select(ORDERS_SUMMARY_QUERY_SELECT)
            .where('o."orderPlacedAt"::timestamptz >= :startDate::timestamptz', {
                startDate,
            })
            .andWhere('occ.channelId = :channelId', { channelId: ctx.channel.id });
        if (endDate) {
            qb.andWhere('o."orderPlacedAt"::timestamptz <= :endDate::timestamptz', {
                endDate,
            });
        }
        qb.groupBy('day');
        const res = await qb.getRawMany();
        const reducedResponse = res.reduce(
            (acc, curr) => {
                acc.orderCount += +curr.ordercount;
                acc.total += +curr.total;
                acc.totalWithTax += +curr.totalwithtax;
                return acc;
            },
            {
                orderCount: 0,
                total: 0,
                totalWithTax: 0,
            },
        );

        return {
            currencyCode: ctx.currencyCode,
            __typename: 'OrderSummaryDataMetric',
            averageOrderValue: +(reducedResponse?.total / reducedResponse.orderCount).toFixed(2),
            averageOrderValueWithTax: +(reducedResponse?.totalWithTax / reducedResponse.orderCount).toFixed(
                2,
            ),
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
