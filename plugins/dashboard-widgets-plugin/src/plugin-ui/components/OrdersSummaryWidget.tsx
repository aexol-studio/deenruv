import { priceFormatter, Card, CardTitle, useLazyQuery, SimpleSelect } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    endOfMonth,
    endOfToday,
    endOfWeek,
    endOfYear,
    endOfYesterday,
    startOfMonth,
    startOfToday,
    startOfWeek,
    startOfYear,
    startOfYesterday,
    subMonths,
    subWeeks,
} from 'date-fns';
import { CurrencyCode, GraphQLTypes } from '../zeus';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@deenruv/react-ui-devkit';

import { OrderSummaryMetricsQuery } from '../graphql/queries';
import { useTranslation } from 'react-i18next';
import { RefreshCacheButton } from './shared/RefreshCacheButton';
import { getQuartersForYear } from '../utils';
import { GrossNet, Period, Periods } from '../types';

export const OrdersSummaryWidget = () => {
    const [getOrdersSummaryMetric] = useLazyQuery(OrderSummaryMetricsQuery);
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.Today);
    const [grossOrNet, setGrossOrNet] = useState<'gross' | 'net'>('gross');
    const [ordersSummaryMetric, setOrdersSummaryMetrics] = useState<GraphQLTypes['OrderSummaryMetrics']>();
    const quarters = useMemo(() => getQuartersForYear(), []);
    const getOrders = async ({
        end,
        start,
        refresh = false,
    }: {
        start: Date;
        end: Date;
        refresh?: boolean;
    }) => {
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
    };

    const refreshData = () => {
        const periodData = _periods.find(p => p.period === selectedPeriod);
        if (periodData)
            getOrders({
                start: periodData.start,
                end: periodData.end,
                refresh: true,
            });
    };
    useEffect(() => {
        getOrders({ start: startOfToday(), end: endOfToday() });
    }, []);

    const _periods = useMemo(
        (): Period[] => [
            {
                period: Periods.Today,
                text: t('today'),
                start: startOfToday(),
                end: endOfToday(),
            },
            {
                period: Periods.Yesterday,
                text: t('yesterday'),
                start: startOfYesterday(),
                end: endOfYesterday(),
            },
            {
                period: Periods.ThisWeek,
                text: t('thisWeek'),
                start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                end: endOfWeek(new Date(), { weekStartsOn: 1 }),
            },
            {
                period: Periods.LastWeek,
                text: t('lastWeek'),
                start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
            },
            {
                period: Periods.ThisMonth,
                text: t('thisMonth'),
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date()),
            },
            {
                period: Periods.lastMonth,
                text: t('lastMonth'),
                start: startOfMonth(subMonths(new Date(), 1)),
                end: endOfMonth(subMonths(new Date(), 1)),
            },
            {
                period: Periods.ThisYear,
                text: t('thisYear'),
                start: startOfYear(new Date()),
                end: endOfYear(new Date()),
            },
            {
                period: Periods.FirstYearQuarter,
                text: t('firstYearQuarterInterval'),
                ...quarters[0],
            },
            {
                period: Periods.SecondYearQuarter,
                text: t('secondYearQuarterInterval'),
                ...quarters[1],
            },
            {
                period: Periods.ThirdYearQuarter,
                text: t('thirdYearQuarterInterval'),
                ...quarters[2],
            },
            {
                period: Periods.FourthYearQuarter,
                text: t('fourthYearQuarterInterval'),
                ...quarters[3],
            },
        ],
        [t],
    );

    const handlePeriodChange = useCallback(
        (period: Periods) => {
            setSelectedPeriod(period);
            const periodData = _periods.find(p => p.period === period);

            if (periodData)
                getOrders({
                    start: periodData.start,
                    end: periodData.end,
                });
        },
        [_periods],
    );

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
                        <div className="shrink flex gap-2">
                            <SimpleSelect
                                size="sm"
                                options={_grossNet.map(e => ({
                                    label: e.text,
                                    value: e.type,
                                }))}
                                value={grossOrNet}
                                onValueChange={e => setGrossOrNet(e as GrossNet)}
                            />
                            <Select
                                onValueChange={value => handlePeriodChange(value as Periods)}
                                value={selectedPeriod}
                                defaultValue={_periods[0].period}
                            >
                                <SelectTrigger className="h-[30px] w-[280px] text-[13px]">
                                    <SelectValue placeholder={t('selectDataType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {_periods.map(p => (
                                            <SelectItem key={p.period} value={p.period}>
                                                {p.text}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
