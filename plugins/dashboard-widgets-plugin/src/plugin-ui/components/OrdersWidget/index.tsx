import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { endOfWeek, startOfWeek } from 'date-fns';

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    usePluginStore,
    useLazyQuery,
    CardFooter,
} from '@deenruv/react-ui-devkit';
import { MetricsRangeSelect } from './MetricsIntervalSelect';
import { MetricsCustomDates } from './MetricCustomDates';
import { MetricTypeSelect } from './MetricTypeSelect';
import { OrdersChart } from './OrdersChart';

import { BetterMetricInterval, ChartMetricType } from '../../zeus';
import { ChartMetricQuery } from '../../graphql';
import { RefreshCacheButton } from '../shared/RefreshCacheButton';
import { convertBackedDataToChartData, getCustomIntervalDates } from '../../utils';

type AdditionalEntryData = { id: string; name: string; quantity: number };
type BetterMetricsChartDataType = {
    data: {
        title: string;
        type: ChartMetricType;
        entries: {
            type: ChartMetricType;
            name: string;
            value: number;
            additionalData?: AdditionalEntryData[];
        }[];
    }[];
    lastCacheRefreshTime?: string;
};

type DateRangeType = { start: Date; end?: Date };
export const OrdersWidget = () => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [fetchChartMetrics] = useLazyQuery(ChartMetricQuery);
    const { language } = usePluginStore();
    const [metricLoading, setMetricLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRangeType>({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const [metricRangeTypeSelectValue, setMetricRangeTypeSelectValue] = useState(BetterMetricInterval.Weekly);
    const [metricType, setMetricType] = useState<ChartMetricType>(ChartMetricType.OrderTotal);

    const [betterMetrics, setBetterMetrics] = useState<BetterMetricsChartDataType>({ data: [] });

    const fetchData = useCallback(
        async (refresh: boolean = false) => {
            try {
                setMetricLoading(true);
                const { chartMetric } = await fetchChartMetrics({
                    input: { types: [metricType], range: { ...dateRange }, refresh },
                });
                if (chartMetric?.data?.length) {
                    const dataWithMappedEntries = chartMetric.data.map(data => ({
                        ...data,
                        entries: convertBackedDataToChartData(
                            data.type,
                            data.entries,
                            language,
                            dateRange.start,
                            dateRange.end,
                        ),
                    }));

                    setBetterMetrics({
                        lastCacheRefreshTime: chartMetric.lastCacheRefreshTime,
                        data: dataWithMappedEntries,
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
                setMetricLoading(false);
            }
        },
        [dateRange, metricType],
    );

    useEffect(() => {
        if (metricRangeTypeSelectValue === BetterMetricInterval.Custom) return;
        setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue));
    }, [metricRangeTypeSelectValue, metricType]);

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const changeCustomMetricRange = (date: Date | undefined, key: 'end' | 'start') => {
        setDateRange(p => ({ ...p, [key]: date }));
    };

    const betterData = useMemo(() => {
        return betterMetrics.data.map(metric => metric.entries).flat();
    }, [betterMetrics, language]);

    return (
        <Card className="border-0 shadow-none pr-6 py-6">
            <CardHeader className="pt-0">
                <div className="flex flex-col justify-between gap-4">
                    <CardTitle className="flex items-center justify-between gap-2 text-lg">
                        <span>{t('metrics')}</span>
                        <div className="flex gap-3 flex-wrap justify-between">
                            <MetricTypeSelect changeMetricType={setMetricType} loading={metricLoading} />
                            <MetricsRangeSelect
                                value={metricRangeTypeSelectValue}
                                changeMetricInterval={setMetricRangeTypeSelectValue}
                                loading={metricLoading}
                            />
                            <MetricsCustomDates
                                isVisible={metricRangeTypeSelectValue === BetterMetricInterval.Custom}
                                endDate={dateRange.end as Date | undefined}
                                startDate={dateRange.start as Date | undefined}
                                setDate={changeCustomMetricRange}
                            />
                        </div>
                    </CardTitle>
                </div>
            </CardHeader>
            <div className="mb-6" />
            <CardContent className="p-0 mr-6 mb-6">
                <OrdersChart data={betterData} language={language} />
            </CardContent>
            <CardFooter className="justify-end pb-0 mt-4">
                <RefreshCacheButton
                    fetchData={() => fetchData(true)}
                    lastCacheRefreshTime={betterMetrics.lastCacheRefreshTime}
                />
            </CardFooter>
        </Card>
    );
};
