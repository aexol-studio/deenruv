import { priceFormatter, Card, CardTitle, useLazyQuery, SimpleSelect } from '@deenruv/react-ui-devkit';
import React, { useEffect, useState } from 'react';
import { endOfWeek, startOfWeek } from 'date-fns';
import { BetterMetricInterval, CurrencyCode, GraphQLTypes } from '../zeus';

import { OrderSummaryMetricsQuery } from '../graphql/queries';
import { useTranslation } from 'react-i18next';
import { RefreshCacheButton } from './shared/RefreshCacheButton';
import { getCustomIntervalDates } from '../utils';
import { DateRangeType, GrossNet } from '../types';
import { MetricsRangeSelect } from './shared/MetricsRangeSelect';

export const OrdersSummaryWidget = () => {
    const [getOrdersSummaryMetric] = useLazyQuery(OrderSummaryMetricsQuery);
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [dateRange, setDateRange] = useState<DateRangeType>({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const [metricLoading, setMetricLoading] = useState(false);
    const [metricRangeTypeSelectValue, setMetricRangeTypeSelectValue] = useState(BetterMetricInterval.Weekly);
    const [grossOrNet, setGrossOrNet] = useState<'gross' | 'net'>('gross');
    const [ordersSummaryMetric, setOrdersSummaryMetrics] = useState<GraphQLTypes['OrderSummaryMetrics']>();

    const getOrders = async ({
        end,
        start,
        refresh = false,
    }: {
        start: Date;
        end?: Date;
        refresh?: boolean;
    }) => {
        try {
            setMetricLoading(true);
            const response = await getOrdersSummaryMetric({
                input: {
                    range: {
                        start,
                        end,
                    },
                    refresh,
                },
            });

            setOrdersSummaryMetrics(response.orderSummaryMetric);
        } catch (e) {
            console.log(e);
        } finally {
            setMetricLoading(false);
        }
    };

    const refreshData = () => {
        getOrders({
            ...dateRange,
            refresh: true,
        });
    };

    useEffect(() => {
        try {
            const widgetConfig = localStorage.getItem('orderSummaryWidgetConfig');
            if (widgetConfig) {
                const parsedConfig = JSON.parse(widgetConfig);
                setDateRange({
                    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                    ...parsedConfig?.dateRange,
                });
                setMetricRangeTypeSelectValue(parsedConfig?.dateRangeType ?? BetterMetricInterval.Weekly);
                setGrossOrNet(parsedConfig?.grossOrNet ?? 'gross');
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        getOrders({ ...dateRange });
    }, [dateRange]);

    useEffect(() => {
        setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue));
    }, [metricRangeTypeSelectValue]);

    useEffect(() => {
        const config = {
            dateRange,
            dateRangeType: metricRangeTypeSelectValue,
            grossOrNet,
        };
        localStorage.setItem('orderSummaryWidgetConfig', JSON.stringify(config));
    }, [dateRange, metricRangeTypeSelectValue, grossOrNet]);

    const _grossNet: { type: 'gross' | 'net'; text: string }[] = [
        { type: 'gross', text: t('gross') },
        { type: 'net', text: t('net') },
    ];

    return (
        <Card className="relative border-0 shadow-none p-6">
            <div className="flex flex-col items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-8 lg:items-center lg:justify-between">
                    <CardTitle className="text-lg shrink-0">{t('ordersSummary')}</CardTitle>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <RefreshCacheButton
                            className="shrink-0"
                            fetchData={refreshData}
                            lastCacheRefreshTime={ordersSummaryMetric?.lastCacheRefreshTime}
                        />
                        <div className="shrink flex flex-col sm:flex-row gap-2">
                            <div className="w-full max-w-[240px]">
                                <SimpleSelect
                                    size="sm"
                                    options={_grossNet.map(e => ({
                                        label: e.text,
                                        value: e.type,
                                    }))}
                                    value={grossOrNet}
                                    onValueChange={e => setGrossOrNet(e as GrossNet)}
                                />
                            </div>
                            <MetricsRangeSelect
                                value={metricRangeTypeSelectValue}
                                changeMetricInterval={setMetricRangeTypeSelectValue}
                                loading={metricLoading}
                                withoutCustom
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 justify-between w-full flex-wrap">
                    <h3 className="text-xs md:text-base lg:text-lg xl:text-xl 2xl:text-2xl flex items-center gap-4 shrink-0">
                        <span>{t('totalOrdersCount')}</span>
                        <span>{ordersSummaryMetric?.data?.orderCount || 0}</span>
                    </h3>

                    <h3 className="text-xs md:text-base lg:text-lg xl:text-xl 2xl:text-2xl flex items-center gap-4  shrink-0">
                        <span>{t('totalOrdersValue')}</span>
                        <span>
                            {priceFormatter(
                                grossOrNet === 'gross'
                                    ? ordersSummaryMetric?.data?.totalWithTax || 0
                                    : ordersSummaryMetric?.data?.total || 0,
                                ordersSummaryMetric?.data?.currencyCode || CurrencyCode.PLN,
                            )}
                        </span>
                    </h3>

                    <h3 className="text-xs md:text-base lg:text-lg xl:text-xl 2xl:text-2xl flex items-center gap-4  shrink-0">
                        <span>{t('averageOrdersValue')}</span>
                        <span>
                            {priceFormatter(
                                grossOrNet === 'gross'
                                    ? ordersSummaryMetric?.data?.averageOrderValueWithTax || 0
                                    : ordersSummaryMetric?.data?.averageOrderValue || 0,
                                ordersSummaryMetric?.data?.currencyCode || CurrencyCode.PLN,
                            )}
                        </span>
                    </h3>
                </div>
            </div>
        </Card>
    );
};
