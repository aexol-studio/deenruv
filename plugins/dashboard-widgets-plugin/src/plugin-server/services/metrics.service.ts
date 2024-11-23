import { Injectable } from '@nestjs/common';
import { assertNever } from '@deenruv/common/lib/shared-utils';
import type { SelectQueryBuilder } from 'typeorm';
import { Logger, Order, RequestContext, TransactionalConnection, TtlCache } from '@deenruv/core';
import {
    endOfDay,
    getDayOfYear,
    getDay,
    getISOWeek,
    getMonth,
    getDaysInMonth,
    startOfDay,
    startOfWeek,
    startOfMonth,
    add,
    getDate,
    isLeapYear,
    startOfYear,
    endOfYear,
    endOfMonth,
    endOfWeek,
} from 'date-fns';
import { BetterMetricInterval, BetterMetricType, GraphQLTypes, ResolverInputTypes } from '../zeus';
import { MetricResponse } from '../types';
import {
    ORDER_COUNT_QUERY_SELECT,
    ORDER_TOTAL_PRODUCT_QUERY_SELECT,
    ORDER_TOTAL_QUERY_SELECT,
} from '../raw-sql';

export type MetricData = {
    date: Date;
    orders: MetricResponse[];
};

const QUERY_MAPPINGS2 = {
    [BetterMetricType.OrderCount]: ORDER_COUNT_QUERY_SELECT,
    [BetterMetricType.OrderTotal]: ORDER_TOTAL_QUERY_SELECT,
    [BetterMetricType.AverageOrderValue]: ORDER_TOTAL_QUERY_SELECT,
    [BetterMetricType.OrderTotalProductsCount]: ORDER_TOTAL_PRODUCT_QUERY_SELECT,
};
const MAPPINGS = {
    [BetterMetricType.OrderCount]: {
        title: 'order-count',
        calculate: (data: MetricData) => data.orders.length,
    },
    [BetterMetricType.OrderTotal]: {
        title: 'order-total',
        calculate: (data: MetricData) =>
            data.orders.map(o => o.totalWithTax).reduce((_total, current) => _total + current, 0),
    },
    [BetterMetricType.AverageOrderValue]: {
        title: 'average-order-value',
        calculate: (data: MetricData) => {
            if (!data.orders.length) return 0;
            const total = data.orders.map(o => o.totalWithTax).reduce((_total, current) => _total + current);
            const average = Math.round(total / data.orders.length);
            return average;
        },
    },
    [BetterMetricType.OrderTotalProductsCount]: {
        title: 'order-products-count',
        calculate: (data: MetricData) =>
            data.orders.map(o => o.overallQuantity).reduce((_total, current) => _total + current, 0),
        additionalData: (data: MetricData) => {
            const uniqueProductsObject = data.orders.reduce(
                (acc, curr) => {
                    curr.orderProducts?.map(({ id, name, quantity }) => {
                        if (acc[id]) {
                            acc[id] = {
                                ...acc[id],
                                quantity: acc[id].quantity + quantity,
                            };
                        } else
                            acc[id] = {
                                __typename: 'BetterMeticSummaryEntryAdditionalData',
                                name,
                                quantity,
                            };
                    });

                    return acc;
                },
                {} as {
                    [key: number]: {
                        __typename: 'BetterMeticSummaryEntryAdditionalData';
                        name: string;
                        quantity: number;
                    };
                },
            );
            const productArray = Object.entries(uniqueProductsObject).map(([key, value]) => ({
                id: key,
                ...value,
            }));
            return productArray;
        },
    },
};

@Injectable()
export class BetterMetricsService {
    private cache = new TtlCache<string, GraphQLTypes['BetterMetricSummary'][]>({
        ttl: 1000 * 60 * 60 * 24,
    });
    constructor(private connection: TransactionalConnection) {}

    async getBetterMetrics(
        ctx: RequestContext,
        { interval, types, refresh, productIDs }: ResolverInputTypes['BetterMetricSummaryInput'],
    ): Promise<GraphQLTypes['BetterMetricSummary'][]> {
        const endDate = interval.end ? endOfDay(new Date(interval.end as string)) : endOfDay(new Date());
        const cacheKey = JSON.stringify({
            startDate: interval.start,
            endDate,
            types: types.sort(),
            interval: interval.type,
            channel: ctx.channel.token,
        });
        const cachedMetricList = this.cache.get(cacheKey);
        if (cachedMetricList && refresh !== true) {
            Logger.verbose(
                `Returning cached metrics for channel ${ctx.channel.token}`,
                'BetterMetricsService',
            );
            return cachedMetricList;
        }
        Logger.verbose(
            `No cache hit, calculating ${interval.type} metrics until ${endDate.toISOString()} for channel ${
                ctx.channel.token
            } for all orders`,
            'BetterMetricsService',
        );
        const data = await this.loadData(ctx, {
            ...interval,
            // for now bcs we are using only one type
            metricType: types[0],
        });
        const metrics: GraphQLTypes['BetterMetricSummary'][] = [];
        for (const type of types) {
            const entry = MAPPINGS[type];

            if (!entry?.calculate) {
                throw new Error(`Unknown metric type ${type}`);
            }
            const entries: GraphQLTypes['BetterMetricSummaryEntry'][] = [];
            data.forEach(dataPerTick => {
                entries.push({
                    __typename: 'BetterMetricSummaryEntry',
                    label: dataPerTick.date.toISOString().split('T')[0],
                    value: entry.calculate(dataPerTick),
                    ...('additionalData' in entry
                        ? { additionalData: entry.additionalData(dataPerTick) }
                        : {}),
                });
            });

            metrics.push({
                __typename: 'BetterMetricSummary',
                interval: interval.type,
                title: entry.title,
                type,
                entries,
            });
        }
        if (interval.type !== BetterMetricInterval.Custom && !productIDs) {
            this.cache.set(cacheKey, metrics);
        }
        return metrics;
    }

    async loadData(
        ctx: RequestContext,
        {
            type: interval,
            start,
            end,
            metricType,
        }: ResolverInputTypes['BetterMetricIntervalInput'] & {
            metricType: BetterMetricType;
        },
    ): Promise<Map<number, MetricData>> {
        const orderRepo = this.connection.getRepository(ctx, Order);

        // query builder base, we always want to fetch the channel and orderLines,
        const qb = orderRepo
            .createQueryBuilder('o')
            .innerJoin('order_channels_channel', 'occ', 'occ."orderId" = o.id')
            .innerJoin('order_line', 'ol', 'ol."orderId" = o.id');

        let getTickNrFn: typeof getMonth | typeof getISOWeek;
        const today = new Date();
        let startDate: Date;
        let endDate: Date | undefined;
        let tickOffset = 0;
        let ticks: number[] = [];
        switch (interval) {
            case BetterMetricInterval.Weekly: {
                getTickNrFn = getDay;
                startDate = startOfWeek(today);
                endDate = endOfWeek(today);
                ticks = Array.from({ length: 7 }, (_, i) => i + 1);
                tickOffset = 1;
                break;
            }
            case BetterMetricInterval.Monthly: {
                getTickNrFn = getDate;
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                ticks = Array.from({ length: getDaysInMonth(today) }, (_, i) => i + 1);
                break;
            }
            case BetterMetricInterval.Yearly: {
                getTickNrFn = getDayOfYear;
                startDate = startOfYear(today);
                endDate = endOfYear(today);
                ticks = Array.from({ length: isLeapYear(today) ? 366 : 365 }, (_, i) => i + 1);
                break;
            }
            case BetterMetricInterval.Custom: {
                startDate = start ? startOfDay(new Date(start as string)) : startOfDay(today);
                endDate = end as Date | undefined;
                break;
            }
            default:
                assertNever(interval as never);
        }

        // here we are finish formatting query builders
        // type casting for now bcs idk why it is shouting with wrong type
        finishFormattingQueryBuilders(qb as any as SelectQueryBuilder<Order>, {
            ctx,
            metricType,
            startDate,
            endDate,
        });

        let skip = 0;
        const take = 1000;
        let hasMoreOrders = true;
        const orders: MetricResponse[] = [];
        const totalItems = await qb.getCount();

        while (hasMoreOrders) {
            let queryResponse: MetricResponse[] = [];
            queryResponse = await qb.limit(take).offset(skip).getRawMany();
            orders.push(...queryResponse);
            Logger.verbose(
                `Fetched orders ${skip}-${skip + take} for channel ${
                    ctx.channel.token
                } for ${interval} metrics`,
                'BetterMetricsService',
            );
            skip += queryResponse.length;
            if (orders.length >= totalItems) hasMoreOrders = false;
        }

        Logger.verbose(
            `Finished fetching all ${orders.length} orders for channel ${ctx.channel.token} for ${interval} metrics`,
            'BetterMetricsService',
        );

        const dataPerInterval = new Map<number, MetricData>();
        let objectForGroup: { [key: string]: MetricResponse[] } = {};
        if (interval === BetterMetricInterval.Custom) {
            objectForGroup = orders.reduce(
                (acc, curr) => {
                    const key = endOfDay(new Date(curr.orderPlacedAt)).toISOString().split('T')[0];
                    if (acc[key]) {
                        acc[key].push(curr);
                    } else acc[key] = [curr];
                    return acc;
                },
                {} as { [key: string]: MetricResponse[] },
            );
            ticks = Array.from({ length: Object.keys(objectForGroup).length }, (_, i) => i);
        }

        ticks.forEach(tick => {
            if (interval === BetterMetricInterval.Custom) {
                const ordersInCurrentTick = Object.values(objectForGroup)[tick];
                const date = new Date(ordersInCurrentTick[0].orderPlacedAt);
                dataPerInterval.set(tick, {
                    orders: ordersInCurrentTick,
                    date,
                });
                return;
            }
            const ordersInCurrentTick = orders.filter(order => {
                return getTickNrFn(new Date(order.orderPlacedAt)) === tick;
            });
            dataPerInterval.set(tick, {
                orders: ordersInCurrentTick,
                date: add(startDate, { days: tick + tickOffset }),
                ...(metricType === BetterMetricType.OrderTotalProductsCount ? {} : {}),
            });
        });

        return dataPerInterval;
    }
}

const finishFormattingQueryBuilders = (
    qb: SelectQueryBuilder<Order>,
    args: {
        ctx: RequestContext;
        metricType: BetterMetricType;
        startDate: Date;
        endDate?: Date;
    },
) => {
    const { ctx, metricType, startDate, endDate } = args;
    qb.select(QUERY_MAPPINGS2[metricType]);
    // we are adding startDate to query builder and channel id
    qb.where('o."orderPlacedAt" >= :startDate', {
        startDate,
    }).andWhere('occ.channelId = :channelId', { channelId: ctx.channel.id });

    // we are adding endDate to query builder if it exists
    if (endDate) {
        qb.andWhere('o."orderPlacedAt" <= :endDate', {
            endDate,
        });
    }
    if (metricType === BetterMetricType.OrderTotalProductsCount) {
        qb.innerJoin('product_variant', 'pv', 'pv.id = ol."productVariantId"') // add product_variant
            .innerJoin('product', 'p', 'p.id = pv."productId"') // add product
            .innerJoin('product_translation', 'pt', 'pt."baseId" = p.id')
            .andWhere('pt."languageCode" = :languageCode', {
                languageCode: ctx.languageCode,
            });
    }

    qb.groupBy('occ."channelId"')
        .addGroupBy('o.id')
        .addGroupBy('o."orderPlacedAt"')
        .orderBy('o."orderPlacedAt"', 'ASC');
};
