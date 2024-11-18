import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    Separator,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';
import { BetterMetricInterval, BetterMetricType, LanguageCode, ResolverInputTypes } from '../../zeus';
import { createClient, scalars } from '../../graphql/client';
import { useTranslation } from 'react-i18next';
import { PeriodSelect, Period, Periods } from '../shared';
import { endOfToday, startOfToday } from 'date-fns';
import { translationNS } from '../../translation-ns';
import { colors, EmptyData } from '../shared';

const getBetterMetrics = async (input: ResolverInputTypes['BetterMetricSummaryInput']) => {
    const { betterMetricSummary } = await createClient(LanguageCode.en)('query', { scalars })({
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

export const ProductsChartWidget = () => {
    const { t } = useTranslation(translationNS);
    const [chartData, setChartData] = useState<{ product: string; value: number }[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>({
        period: Periods.Today,
        text: t('today'),
        start: startOfToday(),
        end: endOfToday(),
    });

    useEffect(() => {
        getBetterMetrics({
            interval: {
                type: BetterMetricInterval.Custom,
                start: selectedPeriod.start,
                end: selectedPeriod.end,
            },
            types: [BetterMetricType.OrderTotalProductsCount],
        }).then(resp => {
            const entries = resp[0].entries;
            const salesTotals: Record<string, { name: string; quantity: number }> = {};

            entries.forEach(entry => {
                entry.additionalData?.forEach(product => {
                    if (salesTotals[product.id]) {
                        salesTotals[product.id].quantity += product.quantity;
                    } else {
                        salesTotals[product.id] = {
                            name: product.name,
                            quantity: product.quantity,
                        };
                    }
                });
            });

            const _chartData = Object.values(salesTotals)
                .map(product => ({
                    product: product.name,
                    value: product.quantity,
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            setChartData(_chartData);
        });
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
        <Card className="flex flex-col">
            <CardHeader className="flex justify-between">
                <div className="flex items-start gap-8">
                    <CardTitle className="text-lg">{t('bestsellers')}</CardTitle>
                    <PeriodSelect
                        selectedPeriod={selectedPeriod.period}
                        onPeriodChange={handlePeriodChange}
                    />
                </div>
            </CardHeader>
            <Separator className="mb-3" />
            <CardContent className="flex flex-grow items-center justify-center">
                {!chartData.length ? (
                    <EmptyData text={t('emptyData')} />
                ) : (
                    <ChartContainer config={chartConfig} className="w-full">
                        <BarChart data={chartData} layout="vertical">
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
                                cursor={false}
                                content={<ChartTooltipContent customLabel={t('sold')} hideIndicator />}
                            />
                            <Bar dataKey="value" radius={5} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartConfig[entry.product].color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
};
