import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useLazyQuery,
    useSettings,
    useWidgetItem,
} from '@deenruv/react-ui-devkit';
import { ChartConfig, ChartTooltip, Separator } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BetterMetricInterval, ChartMetricType } from '../../zeus';
import { useTranslation } from 'react-i18next';

import { endOfWeek, startOfWeek } from 'date-fns';
import { colors, EmptyData } from '../shared';
import { ChartMetricQuery } from '../../graphql';
import { RefreshCacheButton } from '../shared/RefreshCacheButton';
import { CurrencyCode } from '@deenruv/admin-types';
import { CustomBarChartTooltip } from './CustomBarChartTooltip';
import { UIPluginOptions } from '../..';
import { getCustomIntervalDates, getRandomColor } from '../../utils';

import { DateRangeType } from '../../types';
import { MetricsRangeSelect } from '../shared/MetricsRangeSelect';

type SortBy = 'BY_COUNT' | 'BY_NET_WORTH';
type ShowData = 'FIRST_FIVE' | 'ALL';

export const ProductsChartWidget = () => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [fetchChartMetrics] = useLazyQuery(ChartMetricQuery);
    const currencyCode = useSettings(p => p.selectedChannel?.currencyCode);
    const [showData, setShowData] = useState<ShowData>('FIRST_FIVE');
    const [dateRange, setDateRange] = useState<DateRangeType>({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const [metricLoading, setMetricLoading] = useState(false);
    const [metricRangeTypeSelectValue, setMetricRangeTypeSelectValue] = useState(BetterMetricInterval.Weekly);
    const [chartData, setChartData] = useState<{ product: string; value: number; priceValue: number }[]>([]);
    const [lastRefreshedCache, setLastRefreshedCache] = useState<string | undefined>();

    const [sortBy, setSortBy] = useState<SortBy>('BY_COUNT');
    const { plugin } = useWidgetItem();

    const barColors =
        // @ts-expect-error: for now we dont have information about these types, but we know that this exists
        (plugin?.config?.options as UIPluginOptions)?.barChartColors || colors;
    const fetchData = useCallback(
        async (refresh: boolean = false) => {
            try {
                setMetricLoading(true);
                fetchChartMetrics({
                    input: {
                        range: dateRange,
                        types: [ChartMetricType.OrderTotalProductsCount],
                        refresh,
                    },
                }).then(({ chartMetric }) => {
                    const entries = chartMetric.data[0].entries;
                    setLastRefreshedCache(chartMetric.lastCacheRefreshTime);
                    const salesTotals: Record<
                        string,
                        { name: string; quantity: number; priceWithTax: number }
                    > = {};

                    entries.forEach(entry => {
                        entry.additionalData?.forEach(product => {
                            if (salesTotals[product.id]) {
                                salesTotals[product.id].quantity += product.quantity;
                                salesTotals[product.id].priceWithTax += product.priceWithTax;
                            } else {
                                salesTotals[product.id] = {
                                    name: product.name,
                                    quantity: product.quantity,
                                    priceWithTax: product.priceWithTax,
                                };
                            }
                        });
                    });

                    const _chartData = Object.values(salesTotals)
                        .map(product => ({
                            product: product.name,
                            value: product.quantity,
                            priceValue: product.priceWithTax,
                        }))
                        .sort((a, b) =>
                            sortBy === 'BY_COUNT' ? b.value - a.value : b.priceValue - a.priceValue,
                        );

                    setChartData(_chartData);
                });
            } catch (e) {
                console.log(e);
            } finally {
                setMetricLoading(false);
            }
        },
        [dateRange],
    );

    const sortedData = useMemo(
        () =>
            chartData.sort((a, b) =>
                sortBy === 'BY_COUNT' ? b.value - a.value : b.priceValue - a.priceValue,
            ),
        [chartData, sortBy],
    );
    const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
        config[item.product] = {
            label: item.product,
            color: getRandomColor(barColors),
        };
        return config;
    }, {} as ChartConfig);
    useEffect(() => {
        setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue));
    }, [metricRangeTypeSelectValue]);
    useEffect(() => {
        fetchData();
    }, [dateRange]);

    useEffect(() => {
        try {
            const widgetConfig = localStorage.getItem('ordersBarChartWidgetConfig');
            if (widgetConfig) {
                const parsedConfig = JSON.parse(widgetConfig);
                setDateRange({
                    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                    ...parsedConfig?.dateRange,
                });
                setMetricRangeTypeSelectValue(parsedConfig?.dateRangeType ?? BetterMetricInterval.Weekly);
                setShowData(parsedConfig?.showData ?? 'FIRST_FIVE');
            }
        } catch (e) {
            console.log(e);
        }
    }, []);
    useEffect(() => {
        const config = {
            dateRange,
            dateRangeType: metricRangeTypeSelectValue,
            showData,
        };
        localStorage.setItem('ordersBarChartWidgetConfig', JSON.stringify(config));
    }, [dateRange, metricRangeTypeSelectValue, showData]);

    return (
        <Card className="flex flex-col border-0 shadow-none h-full">
            <CardHeader className="flex justify-between">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-lg">{t('bestsellers')}</CardTitle>{' '}
                        <Select
                            onValueChange={value => setShowData(value as ShowData)}
                            value={showData}
                            defaultValue={'BY_COUNT'}
                        >
                            <SelectTrigger className="h-[30px] w-[240px] text-[13px]">
                                <SelectValue placeholder={t('sortBy')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={'FIRST_FIVE'}>{t('showFirstFive')}</SelectItem>
                                    <SelectItem value={'ALL'}>{t('showAll')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-col flex gap-2 w-[240px]">
                        <MetricsRangeSelect
                            value={metricRangeTypeSelectValue}
                            changeMetricInterval={setMetricRangeTypeSelectValue}
                            loading={metricLoading}
                            withoutCustom
                        />
                        <Select
                            onValueChange={value => setSortBy(value as SortBy)}
                            value={sortBy}
                            defaultValue={'BY_COUNT'}
                        >
                            <SelectTrigger className="h-[30px] w-full text-[13px]">
                                <SelectValue placeholder={t('sortBy')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={'BY_COUNT'}>{t('sortByCount')}</SelectItem>
                                    <SelectItem value={'BY_NET_WORTH'}>{t('sortByNet')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <Separator className="mb-3" />
            <CardContent className="flex flex-1 justify-center items-center text-xs  ">
                {!chartData.length ? (
                    <div className="flex flex-col items-center text-center">
                        <EmptyData text={t('emptyData')} />
                    </div>
                ) : (
                    <ResponsiveContainer
                        className="transition-all"
                        width="100%"
                        height={
                            (showData === 'FIRST_FIVE' ? sortedData.slice(0, 5).length : sortedData.length) *
                            50
                        }
                    >
                        <BarChart
                            data={showData === 'FIRST_FIVE' ? sortedData.slice(0, 5) : sortedData}
                            layout="vertical"
                        >
                            <YAxis
                                dataKey="product"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={180}
                                tick={{ fontSize: 12, fontSizeAdjust: 0.5 }}
                            />
                            <XAxis type="number" hide />
                            <ChartTooltip
                                wrapperStyle={{ zIndex: 1000 }}
                                cursor={false}
                                content={p => (
                                    <CustomBarChartTooltip
                                        currencyCode={currencyCode ?? CurrencyCode.PLN}
                                        chartProps={p}
                                    />
                                )}
                            />
                            <Bar
                                minPointSize={5}
                                dataKey={sortBy === 'BY_COUNT' ? 'value' : 'priceValue'}
                                radius={5}
                                barSize={40}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartConfig[entry.product].color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
            <CardFooter className="justify-end mt-2">
                <RefreshCacheButton
                    fetchData={() => fetchData(true)}
                    lastCacheRefreshTime={lastRefreshedCache}
                />
            </CardFooter>
        </Card>
    );
};
