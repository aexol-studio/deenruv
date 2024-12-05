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
import { convertBackedDataToChartData, generateBrightRandomColor, getCustomIntervalDates } from '../../utils';
import { ProductSelector } from './ProductSelector';
import { BetterMetricsChartDataType } from '../../types';

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
    const [allAvailableProducts, setAllAvailableProducts] = useState<{ name: string; id: string }[]>([]);
    const [selectedAvailableProducts, setSelectedAvailableProducts] = useState<
        { id: string; color: string }[]
    >([]);

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
                    if (
                        metricType === ChartMetricType.OrderTotalProductsCount ||
                        metricType === ChartMetricType.OrderTotalProductsValue
                    ) {
                        const flatted = dataWithMappedEntries.map(d => d.entries).flat();
                        const allAvailableProducts = flatted.reduce(
                            (acc, curr) => {
                                curr.additionalData?.forEach(product => {
                                    if (!acc.some(p => p.id === product.id)) {
                                        acc.push({ id: product.id, name: product.name });
                                    }
                                });
                                return acc;
                            },
                            [] as { name: string; id: string }[],
                        );
                        setAllAvailableProducts(allAvailableProducts);
                    }
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
        if (metricRangeTypeSelectValue !== BetterMetricInterval.Custom)
            setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue));
        if (
            metricType === ChartMetricType.OrderTotalProductsCount ||
            metricType === ChartMetricType.OrderTotalProductsValue
        )
            return;
        setSelectedAvailableProducts([]);
    }, [metricRangeTypeSelectValue, metricType]);

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const changeCustomMetricRange = (date: Date | undefined, key: 'end' | 'start') => {
        setDateRange(p => ({ ...p, [key]: date }));
    };

    const betterData = useMemo(() => {
        const allData = betterMetrics.data
            .map(metric =>
                metric.entries.map(entry => {
                    const reduced = selectedAvailableProducts.reduce(
                        (acc, selectedProduct) => {
                            const product = entry.additionalData?.find(
                                data => data.id === selectedProduct.id,
                            );
                            acc[selectedProduct.id] =
                                metricType === ChartMetricType.OrderTotalProductsCount
                                    ? product?.quantity || 0
                                    : (product?.priceWithTax || 0) / 100;
                            return acc;
                        },
                        {} as Record<string, number>,
                    );
                    return { ...entry, ...reduced };
                }),
            )
            .flat();

        return {
            allData,
        };
    }, [betterMetrics, language, selectedAvailableProducts]);

    const onSelectedAvailableProductsChange = (id: string) => {
        setSelectedAvailableProducts(prev =>
            prev.some(product => product.id === id)
                ? prev.filter(p => p.id !== id)
                : [
                      ...prev,
                      {
                          id,
                          color: generateBrightRandomColor(),
                      },
                  ],
        );
    };

    return (
        <Card className="border-0 shadow-none pr-6 py-6">
            <CardHeader className="pt-0">
                <div className="flex justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <CardTitle className="flex items-center justify-between gap-2 text-lg">
                            <span>{t('metrics')}</span>
                        </CardTitle>
                        <ProductSelector
                            onSelectedAvailableProductsChange={onSelectedAvailableProductsChange}
                            clearSelectedProducts={() => setSelectedAvailableProducts([])}
                            metricType={metricType}
                            allAvailableProducts={allAvailableProducts}
                            selectedAvailableProducts={selectedAvailableProducts}
                        />
                    </div>
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
                </div>
            </CardHeader>
            <div className="mb-6" />
            <CardContent className="p-0 mr-6 mb-6">
                <OrdersChart
                    selectedAvailableProducts={selectedAvailableProducts}
                    data={betterData.allData}
                    language={language}
                    metricType={metricType}
                />
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
