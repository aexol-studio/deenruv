import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from 'date-fns';
import { pl, enGB } from 'date-fns/locale';
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    addMissingDays,
    getZonedDate,
    usePluginStore,
    useLazyQuery,
    CardFooter,
} from '@deenruv/react-ui-devkit';
import { MetricsIntervalSelect } from './MetricsIntervalSelect';
import { MetricsCustomDates } from './MetricCustomDates';
import { MetricTypeSelect } from './MetricTypeSelect';
import { OrdersChart } from './OrdersChart';

import { BetterMetricInterval, BetterMetricType, ResolverInputTypes } from '../../zeus';
import { BetterMetricsQuery } from '../../graphql';
import { RefreshCacheButton } from '../shared/RefreshCacheButton';

type AdditionalEntryData = { id: string; name: string; quantity: number };
type BetterMetricsChartDataType = {
    data: {
        title: string;
        type: BetterMetricType;
        interval: BetterMetricInterval;
        entries: { label: string; value: number; additionalData?: AdditionalEntryData[] }[];
    }[];
    lastCacheRefreshTime?: string;
};

export const OrdersWidget = () => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [fetchBetterMetrics] = useLazyQuery(BetterMetricsQuery);
    const { language } = usePluginStore();
    const [metricLoading, setMetricLoading] = useState(false);
    const [metricSelectValue, setMetricSelectValue] = useState(BetterMetricInterval.Weekly);

    const [betterMetricsSettings, setBetterMetricsSettings] = useState<
        ResolverInputTypes['BetterMetricSummaryInput']
    >({
        interval: { type: BetterMetricInterval.Weekly },
        types: [BetterMetricType.OrderTotal],
        refresh: false,
    });

    const [betterMetrics, setBetterMetrics] = useState<BetterMetricsChartDataType>({ data: [] });

    const getCustomIntervalDates = useCallback(
        (interval: BetterMetricInterval): { start: Date; end: Date } => {
            switch (interval) {
                case BetterMetricInterval.ThisWeek:
                    return {
                        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                    };

                case BetterMetricInterval.LastWeek:
                    return {
                        start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                        end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                    };

                case BetterMetricInterval.ThisMonth:
                    return {
                        start: addDays(startOfMonth(new Date()), 1),
                        end: endOfMonth(new Date()),
                    };

                case BetterMetricInterval.LastMonth:
                    return {
                        start: startOfMonth(subMonths(new Date(), 1)),
                        end: endOfMonth(subMonths(new Date(), 1)),
                    };

                default:
                    return {
                        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                    };
            }
        },
        [],
    );

    const fetchData = useCallback(
        async (refresh: boolean = false) => {
            const metricSettings = betterMetricsSettings;
            if (
                [
                    BetterMetricInterval.LastMonth,
                    BetterMetricInterval.ThisMonth,
                    BetterMetricInterval.LastWeek,
                    BetterMetricInterval.ThisWeek,
                ].includes(betterMetricsSettings.interval.type)
            ) {
                metricSettings.interval = {
                    type: BetterMetricInterval.Custom,
                    ...getCustomIntervalDates(betterMetricsSettings.interval.type),
                };
            }
            try {
                setMetricLoading(true);
                const { betterMetricSummary } = await fetchBetterMetrics({
                    input: { ...metricSettings, refresh },
                });
                setBetterMetrics(betterMetricSummary);
            } catch (e) {
                console.log(e);
            } finally {
                setMetricLoading(false);
            }
        },
        [betterMetricsSettings, getCustomIntervalDates],
    );

    useEffect(() => {
        fetchData();
    }, [betterMetricsSettings, getCustomIntervalDates]);

    const changeBetterMetricType = (type: BetterMetricType) => {
        setBetterMetricsSettings(prev => ({ ...prev, types: [type] }));
    };
    const changeMetricsInterval = (interval: BetterMetricInterval) => {
        setMetricSelectValue(interval);
        setBetterMetricsSettings(p => ({ ...p, interval: { type: interval } }));
    };
    const changeCustomIntervalDate = (date: Date | undefined, key: 'end' | 'start') => {
        setBetterMetricsSettings(p => ({ ...p, interval: { ...p.interval, [key]: date } }));
    };

    const betterData = useMemo(() => {
        return betterMetrics.data
            .map(metric => {
                return metric.interval !== BetterMetricInterval.Custom
                    ? metric.entries.map(entry => ({
                          name: format(getZonedDate(entry.label), 'PPP', {
                              locale: language === 'pl' ? pl : enGB,
                          }),
                          value:
                              metric.type === BetterMetricType.AverageOrderValue ||
                              metric.type === BetterMetricType.OrderTotal
                                  ? entry.value / 100
                                  : entry.value,
                          type: metric.type,
                          additionalData: entry.additionalData,
                      }))
                    : // When interval is custom, Backend returns only entries with values. This adds remaining days.
                      addMissingDays(
                          betterMetricsSettings.interval.start as string,
                          betterMetricsSettings.interval.end as string,
                          metric.type,
                          language,
                          metric.entries.map(entry => ({
                              label: entry.label,
                              value:
                                  metric.type === BetterMetricType.AverageOrderValue ||
                                  metric.type === BetterMetricType.OrderTotal
                                      ? entry.value / 100
                                      : entry.value,
                              additionalData: entry.additionalData,
                          })),
                      );
            })
            .flat();
    }, [betterMetrics, betterMetricsSettings.interval.start, betterMetricsSettings.interval.end, language]);

    return (
        <Card className="border-0 shadow-none pr-6 py-6">
            <CardHeader className="pt-0">
                <div className="flex flex-col justify-between gap-4">
                    <CardTitle className="flex items-center gap-8 text-lg">
                        <span>{t('metrics')}</span>
                        <div className="flex gap-3">
                            <MetricTypeSelect
                                changeMetricType={changeBetterMetricType}
                                loading={metricLoading}
                            />
                            <div className="flex gap-3">
                                <MetricsIntervalSelect
                                    value={metricSelectValue}
                                    changeMetricInterval={changeMetricsInterval}
                                    loading={metricLoading}
                                />
                                <MetricsCustomDates
                                    isVisible={metricSelectValue === BetterMetricInterval.Custom}
                                    endDate={betterMetricsSettings.interval.end as Date | undefined}
                                    startDate={betterMetricsSettings.interval.start as Date | undefined}
                                    setDate={changeCustomIntervalDate}
                                />
                            </div>
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
