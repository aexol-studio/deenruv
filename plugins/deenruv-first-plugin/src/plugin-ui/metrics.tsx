import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@deenruv/react-ui-devkit';
import { client } from './client';
import { BetterMetricInterval, BetterMetricType, ResolverInputTypes } from './zeus';
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { translationNs } from '.';

const getBetterMetrics = async (input: ResolverInputTypes['BetterMetricSummaryInput']) => {
    const { betterMetricSummary } = await client('query')({
        betterMetricSummary: [
            { input },
            {
                title: true,
                interval: true,
                type: true,
                entries: {
                    label: true,
                    value: true,
                    additionalData: { id: true, name: true, quantity: true },
                },
            },
        ],
    });

    return betterMetricSummary;
};

type AdditionalEntryData = { id: string; name: string; quantity: number };
type BetterMetricsChartDataType = {
    title: string;
    type: BetterMetricType;
    interval: BetterMetricInterval;
    entries: { label: string; value: number; additionalData?: AdditionalEntryData[] }[];
}[];

export const Test = () => {
    const { t } = useTranslation(translationNs);
    const [metricLoading, setMetricLoading] = useState(false);
    const [metricSelectValue, setMetricSelectValue] = useState(BetterMetricInterval.Weekly);

    const [betterMetricsSettings, setBetterMetricsSettings] = useState<
        ResolverInputTypes['BetterMetricSummaryInput']
    >({
        interval: { type: BetterMetricInterval.Weekly },
        types: [BetterMetricType.OrderCount],
        refresh: false,
    });

    const [betterMetrics, setBetterMetrics] = useState<BetterMetricsChartDataType>([]);

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
                        start: startOfMonth(new Date()),
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

    useEffect(() => {
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

        (async () => {
            try {
                setMetricLoading(true);
                const metric = await getBetterMetrics(metricSettings);

                setBetterMetrics(metric);
            } catch (e) {
                console.log(e);
            } finally {
                setMetricLoading(false);
            }
        })();
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
        return betterMetrics
            .map(metric => {
                return metric.entries.map(entry => ({
                    name: format(getZonedDate(entry.label), 'PPP', {
                        locale: pl,
                    }),
                    value:
                        metric.type === BetterMetricType.AverageOrderValue ||
                        metric.type === BetterMetricType.OrderTotal
                            ? entry.value / 100
                            : entry.value,
                    type: metric.type,
                    additionalData: entry.additionalData,
                }));
            })
            .flat();
    }, [betterMetrics]);

    console.log(betterData);

    return (
        <div>
            <Button
                onClick={async () => {
                    const { channels } = await client('query')({
                        channels: [{ options: { take: 20 } }, { items: { id: true, code: true } }],
                    });
                }}
            >
                {t('button')}
            </Button>
        </div>
    );
};

const getZonedDate = (date: Date | string): Date => {
    const _date = new Date(date);
    const timezoneOffsetInMs = _date.getTimezoneOffset() * 60000;

    return new Date(_date.getTime() + timezoneOffsetInMs);
};
