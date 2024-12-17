import { Inject, Injectable } from '@nestjs/common';

import { ProductVariantTranslation, RequestContext, TransactionalConnection } from '@deenruv/core';

import { ChartMetricType, GraphQLTypes, MetricIntervalType, ResolverInputTypes } from '../zeus';
import { DashboardWidgetsPluginOptions, MetricResponse } from '../types';
import {
    ORDER_AVERAGE_DAILY_SELECT,
    ORDER_AVERAGE_HOURLY_SELECT,
    ORDER_COUNT_DAILY_SELECT,
    ORDER_COUNT_HOURLY_SELECT,
    ORDER_TOTAL_DAILY_SELECT,
    ORDER_TOTAL_HOURLY_SELECT,
    RANKED_TRANSLATIONS_SELECT,
    TOTAL_PRODUCT_VIEW_SELECT,
} from '../raw-sql';
import { PLUGIN_INIT_OPTIONS } from '../constants';

import { TotalProductsViewEntity } from '../materialisedViewEntities/total_products';
import { OrderSummaryViewEntity } from '../materialisedViewEntities/order_summary';
import { areArraysIdentical } from '../utils';
import { TotalProductsWithStateViewEntity } from '../materialisedViewEntities/total_products_with_state';
import { OrderSummaryWithStateViewEntity } from '../materialisedViewEntities/orders_summary_with_state';
import { In } from 'typeorm';
export type MetricData = {
    date: Date;
    orders: MetricResponse[];
};

const DEFAULT_ORDER_STATES_ARRAY = [
    'PaymentSettled',
    'PartiallyShipped',
    'Shipped',
    'PartiallyDelivered',
    'Delivered',
];

const MAPPINGS = {
    [ChartMetricType.OrderCount]: {
        title: 'order-count',
        dailyQuery: ORDER_COUNT_DAILY_SELECT,
        hourlyQuery: ORDER_COUNT_HOURLY_SELECT,
    },
    [ChartMetricType.OrderTotal]: {
        title: 'order-total',
        dailyQuery: ORDER_TOTAL_DAILY_SELECT,
        hourlyQuery: ORDER_TOTAL_HOURLY_SELECT,
    },
    [ChartMetricType.AverageOrderValue]: {
        title: 'average-order-value',
        dailyQuery: ORDER_AVERAGE_DAILY_SELECT,
        hourlyQuery: ORDER_AVERAGE_HOURLY_SELECT,
    },
    [ChartMetricType.OrderTotalProductsCount]: {
        title: 'order-products-count',
    },
};

@Injectable()
export class BetterMetricsService {
    constructor(
        private connection: TransactionalConnection,
        @Inject(PLUGIN_INIT_OPTIONS)
        private options?: DashboardWidgetsPluginOptions,
    ) {
        this.options = options;
    }
    async refreshViews(ctx: RequestContext) {
        await this.connection
            .getRepository(ctx, OrderSummaryViewEntity)
            .query(`REFRESH MATERIALIZED VIEW CONCURRENTLY order_summary_view_entity`);
        await this.connection
            .getRepository(ctx, OrderSummaryWithStateViewEntity)
            .query(`REFRESH MATERIALIZED VIEW CONCURRENTLY order_summary_with_state_view_entity`);
        await this.connection
            .getRepository(ctx, TotalProductsViewEntity)
            .query(`REFRESH MATERIALIZED VIEW CONCURRENTLY total_products_view_entity`);
        await this.connection
            .getRepository(ctx, TotalProductsWithStateViewEntity)
            .query(`REFRESH MATERIALIZED VIEW CONCURRENTLY total_products_with_state_view_entity`);
    }
    async getOrderSummaryMetric(
        ctx: RequestContext,
        { range, orderStates }: ResolverInputTypes['OrderSummaryMetricInput'],
    ): Promise<GraphQLTypes['OrderSummaryMetrics']> {
        const data = await this.loadSummaryOrdersData(ctx, {
            ...range,
            orderStates,
        });

        return {
            __typename: 'OrderSummaryMetrics',
            data,
        };
    }

    async getChartMetrics(
        ctx: RequestContext,
        {
            range,
            types,
            interval,

            orderStates,
        }: ResolverInputTypes['ChartMetricInput'],
    ): Promise<GraphQLTypes['ChartMetrics']> {
        const data = await this.loadChartData(ctx, {
            ...range,
            // for now bcs we are using only one type
            metricType: types[0],
            interval,
            orderStates,
        });
        const metrics: GraphQLTypes['ChartMetrics'] = {
            __typename: 'ChartMetrics',
            data: [],
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

        return metrics;
    }

    async loadChartData(
        ctx: RequestContext,
        {
            start,
            end,
            metricType,
            interval,
            orderStates,
        }: ResolverInputTypes['BetterMetricRangeInput'] & {
            metricType: ChartMetricType;
            interval: MetricIntervalType;
            orderStates: string[];
        },
    ): Promise<{ response: any }> {
        let response: any;
        const startDate = (start as Date).toISOString();
        const endDate = end as Date | undefined;

        const shoulBeFromDefaultView = areArraysIdentical(DEFAULT_ORDER_STATES_ARRAY, orderStates);

        if (metricType === ChartMetricType.OrderTotalProductsCount) {
            // sub query for product variant name translations with rank
            // (if we have translation for choosen language we will take it first, if not, we will take one of rest languages)
            const rankedTranslations = this.connection
                .getRepository(ctx, ProductVariantTranslation)
                .createQueryBuilder('pvt')
                .select(RANKED_TRANSLATIONS_SELECT)
                .setParameter('languageCode', ctx.languageCode);

            // view query for total products count
            const viewQb = this.connection
                .getRepository(
                    ctx,
                    shoulBeFromDefaultView ? TotalProductsViewEntity : TotalProductsWithStateViewEntity,
                )
                .createQueryBuilder('tpv');
            // here we are checking if we should return tick as modulo of hour or day
            if (interval === MetricIntervalType.Hour) {
                viewQb.select('extract(epoch from tpv.hour - :startDate)::integer / 3600 AS "intervalTick"');
            } else {
                viewQb.select(
                    'extract(epoch from tpv.hour - :startDate)::integer / 86400 + 1 AS "intervalTick"',
                );
            }
            viewQb
                .setParameter('startDate', startDate)
                .addSelect(TOTAL_PRODUCT_VIEW_SELECT)
                // join with ranked translations
                .innerJoin(
                    `(${rankedTranslations.getQuery()})`,
                    'rt',
                    'rt."baseId" = tpv.productVariantId AND rt.rank = 1',
                )
                .setParameters(rankedTranslations.getParameters())
                .where('tpv.hour::timestamptz >= :startDate::timestamptz', {
                    startDate,
                })
                .andWhere('tpv."channelId" = :channelId', {
                    channelId: ctx.channel.id,
                });
            if (endDate) {
                viewQb.andWhere('tpv.hour::timestamptz <= :endDate::timestamptz', {
                    endDate: endDate.toISOString(),
                });
            }
            if (!shoulBeFromDefaultView && orderStates.length) {
                viewQb.andWhere({ state: In(orderStates) });
            }
            viewQb
                .groupBy(
                    '"intervalTick", tpv."productVariantId", tpv."channelId", rt.name, rt."languageCode" ',
                )
                .orderBy('"intervalTick"', 'ASC');

            const dbResponse = await viewQb.getRawMany();

            // !!!!!!!!!IMPORTANT for now we are assuming that listPrice from orderLine includes tax IMPORTANT!!!!!!!!!

            const reducedRes = (dbResponse as any[]).reduce((acc, curr) => {
                if (acc[curr.intervalTick]) {
                    acc[curr.intervalTick].value + curr.orderPlacedQuantitySum,
                        acc[curr.intervalTick].additionaldata.push({
                            name: curr.name,
                            id: curr.productVariantId,
                            quantity: +curr.orderPlacedQuantitySum,
                        });
                } else {
                    acc[curr.intervalTick] = {
                        value: +curr.orderPlacedQuantitySum,
                        additionaldata: [
                            {
                                name: curr.name,
                                id: curr.productVariantId,
                                quantity: +curr.orderPlacedQuantitySum,
                            },
                        ],
                    };
                }
                return acc;
            }, {});

            const mappedResponse = Object.entries(reducedRes)?.map(([key, r]: [key: string, r: any]) => ({
                intervalTick: key,
                value: +(+r.value.toFixed(2)),
                additionalData: r.additionaldata,
            }));

            response = mappedResponse;
        } else {
            const isDaily = interval === MetricIntervalType.Day;

            const viewQb = this.connection
                .getRepository(
                    ctx,
                    shoulBeFromDefaultView ? OrderSummaryViewEntity : OrderSummaryWithStateViewEntity,
                )
                .createQueryBuilder('osv')
                .select(MAPPINGS[metricType][isDaily ? 'dailyQuery' : 'hourlyQuery'])
                .where('osv.hour::timestamptz >= :startDate::timestamptz', {
                    startDate,
                })
                .andWhere('osv."channelId" = :channelId', {
                    channelId: ctx.channel.id,
                });
            if (endDate) {
                viewQb.andWhere('osv.hour::timestamptz <= :endDate::timestamptz', {
                    endDate: endDate.toISOString(),
                });
            }
            if (!shoulBeFromDefaultView && orderStates.length) {
                viewQb.andWhere({ state: In(orderStates) });
            }
            viewQb.groupBy('"intervalTick"').orderBy('"intervalTick"', 'ASC');

            const viewResponse = await viewQb.getRawMany();

            const mappedResponse = viewResponse.map((r: any) => ({
                intervalTick: r.intervalTick,
                value: +('ordercount' in r ? +r.value / +r.ordercount : +r.value).toFixed(2),
            }));

            response = mappedResponse;
        }
        return { response };
    }

    async loadSummaryOrdersData(
        ctx: RequestContext,
        {
            start,
            end,
            orderStates,
        }: ResolverInputTypes['BetterMetricRangeInput'] & {
            orderStates: string[];
        },
    ): Promise<GraphQLTypes['OrderSummaryDataMetric']> {
        const shoulBeFromDefaultView = areArraysIdentical(DEFAULT_ORDER_STATES_ARRAY, orderStates);
        const ordersSummaryViewRepo = this.connection.getRepository(
            ctx,
            shoulBeFromDefaultView ? OrderSummaryViewEntity : OrderSummaryWithStateViewEntity,
        );

        const startDate = (start as Date).toISOString();
        const endDate = end as Date | undefined;
        const viewQb = ordersSummaryViewRepo
            .createQueryBuilder('osv')
            .select('SUM(osv."orderCount")', 'orderCount')
            .addSelect('SUM(osv."totalWithTax")', 'totalWithTax')
            .addSelect('SUM(osv.total)', 'total')
            .addSelect('SUM(osv."productPlacedCount")', 'productCount')
            .where('osv.hour::timestamptz >= :startDate::timestamptz', {
                startDate,
            })
            .andWhere('osv."channelId" = :channelId', {
                channelId: ctx.channel.id,
            });
        if (endDate) {
            viewQb.andWhere('osv.hour::timestamptz <= :endDate::timestamptz', {
                endDate: endDate.toISOString(),
            });
        }
        if (!shoulBeFromDefaultView && orderStates.length) {
            viewQb.andWhere({ state: In(orderStates) });
        }
        const viewResponse = await viewQb.getRawOne();

        return {
            currencyCode: ctx.currencyCode,
            __typename: 'OrderSummaryDataMetric',
            averageOrderValue: +(+(+viewResponse?.total / +viewResponse?.orderCount) || 0).toFixed(2),
            averageOrderValueWithTax: +(
                +(+viewResponse?.totalWithTax / +viewResponse?.orderCount) || 0
            ).toFixed(2),
            orderCount: +viewResponse?.orderCount || 0,
            total: +(+viewResponse?.total || 0).toFixed(2),
            totalWithTax: +(+viewResponse?.totalWithTax || 0).toFixed(2),
            productCount: +viewResponse?.productCount || 0,
        };
    }
}
