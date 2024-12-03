import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
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
} from '@deenruv/react-ui-devkit';
import { ChartConfig, ChartContainer, ChartTooltip, Separator } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChartMetricType } from '../../zeus';
import { useTranslation } from 'react-i18next';
import { PeriodSelect, Period, Periods } from '../shared';
import { endOfToday, startOfToday } from 'date-fns';
import { colors, EmptyData } from '../shared';
import { ChartMetricQuery } from '../../graphql';
import { RefreshCacheButton } from '../shared/RefreshCacheButton';
import { CurrencyCode } from '@deenruv/admin-types';
import { CustomBarChartTooltip } from './CustomBarChartTooltip';

type SortBy = 'BY_COUNT' | 'BY_NET_WORTH';

export const ProductsChartWidget = () => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [fetchChartMetrics] = useLazyQuery(ChartMetricQuery);
    const currencyCode = useSettings(p => p.selectedChannel?.currencyCode);

    const [chartData, setChartData] = useState<{ product: string; value: number; priceValue: number }[]>([]);
    const [lastRefreshedCache, setLastRefreshedCache] = useState<string | undefined>();
    const [selectedPeriod, setSelectedPeriod] = useState<Period>({
        period: Periods.Today,
        text: t('today'),
        start: startOfToday(),
        end: endOfToday(),
    });
    const [sortBy, setSortBy] = useState<SortBy>('BY_COUNT');
    const fetchData = useCallback(
        async (refresh: boolean = false) => {
            fetchChartMetrics({
                input: {
                    range: {
                        start: selectedPeriod.start,
                        end: selectedPeriod.end,
                    },
                    types: [ChartMetricType.OrderTotalProductsCount],
                    refresh,
                },
            }).then(({ chartMetric }) => {
                const entries = chartMetric.data[0].entries;
                setLastRefreshedCache(chartMetric.lastCacheRefreshTime);
                const salesTotals: Record<string, { name: string; quantity: number; priceWithTax: number }> =
                    {};

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
                    .sort((a, b) => (sortBy === 'BY_COUNT' ? b.value - a.value : b.priceValue - a.priceValue))
                    .slice(0, 5);

                setChartData(_chartData);
            });
        },
        [selectedPeriod],
    );

    const sortedData = useMemo(
        () =>
            chartData.sort((a, b) =>
                sortBy === 'BY_COUNT' ? b.value - a.value : b.priceValue - a.priceValue,
            ),
        [chartData, sortBy],
    );

    useEffect(() => {
        fetchData();
    }, [selectedPeriod]);

    const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
        config[item.product] = {
            label: item.product,
            color: colors[index],
        };
        return config;
    }, {} as ChartConfig);

    const handlePeriodChange = useCallback((periodData: Period) => {
        setSelectedPeriod(periodData);
    }, []);

    return (
        <Card className="flex flex-col border-0 shadow-none h-full">
            <CardHeader className="flex justify-between">
                <div className="flex flex-col items-start gap-4">
                    <CardTitle className="text-lg">{t('bestsellers')}</CardTitle>
                    <div className="w-full flex gap-2 items-center justify-between flex-wrap">
                        <PeriodSelect
                            selectedPeriod={selectedPeriod.period}
                            onPeriodChange={handlePeriodChange}
                        />
                        <Select
                            onValueChange={value => setSortBy(value as SortBy)}
                            value={sortBy}
                            defaultValue={'BY_COUNT'}
                        >
                            <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
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
            <CardContent className="flex flex-1 justify-center items-center">
                {!chartData.length ? (
                    <div className="flex flex-col items-center text-center">
                        <EmptyData text={t('emptyData')} />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="w-full">
                        <BarChart data={sortedData} layout="vertical">
                            <YAxis
                                dataKey="product"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={150}
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
                                dataKey={sortBy === 'BY_COUNT' ? 'value' : 'priceValue'}
                                radius={5}
                                barSize={40}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartConfig[entry.product].color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
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
