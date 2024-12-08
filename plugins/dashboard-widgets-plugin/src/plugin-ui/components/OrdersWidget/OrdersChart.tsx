import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import React, { useMemo } from 'react';
import { ChartMetricType } from '../../zeus';
import { camelCaseToSpaces, priceFormatter, useSettings, useWidgetItem } from '@deenruv/react-ui-devkit';
import { CustomTooltip } from './CustomTooltip';
import { ChartConfig, ChartContainer, ChartTooltip } from '@deenruv/react-ui-devkit';
import { UIPluginOptions } from '../..';

import { CurrencyCode } from '@deenruv/admin-types';

interface ChartProps {
    data: {
        [key: string]: any;
        name: string;
        value?: number;
        type: ChartMetricType;
    }[];
    language: string;
    options?: { colorFrom?: string; colorTo?: string; stroke?: string };
    selectedAvailableProducts: { id: string; color: string }[];
    metricType: ChartMetricType;
}

const HEIGHT = 300;

export const OrdersChart: React.FC<ChartProps> = ({
    data,
    language,
    selectedAvailableProducts,
    metricType,
    options: _options,
}) => {
    const chartConfig = useMemo((): ChartConfig => {
        return { value: { label: camelCaseToSpaces(data[0]?.type) } };
    }, [data]);
    const currencyCode = useSettings(p => p.selectedChannel?.currencyCode);
    const { plugin } = useWidgetItem();
    // @ts-expect-error: for now we dont have types, we now that this is working
    const options = (plugin?.config.options as UIPluginOptions)?.horizontalChartColors || {
        colorFrom: `#4338ca`,
        colorTo: `#6366f1`,
        stroke: `#6366f1`,
    };
    return (
        <ChartContainer config={chartConfig} style={{ height: `${HEIGHT}px`, width: '100%' }}>
            <ComposedChart
                height={HEIGHT}
                accessibilityLayer
                data={data}
                margin={{
                    top: 4,
                    left: 8,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    tick={{ dx: 15 }}
                    tickFormatter={value =>
                        metricType === ChartMetricType.OrderCount ||
                        metricType === ChartMetricType.OrderTotalProductsCount
                            ? value
                            : priceFormatter((value ?? 0) * 100, currencyCode ?? CurrencyCode.PLN)
                    }
                />
                <ChartTooltip
                    wrapperStyle={{ zIndex: 1000 }}
                    cursor={false}
                    content={p => (
                        <CustomTooltip
                            currencyCode={currencyCode ?? CurrencyCode.PLN}
                            selectedAvailableProducts={selectedAvailableProducts}
                            chartProps={p}
                            language={language}
                        />
                    )}
                />
                <defs>
                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={options.colorFrom} stopOpacity={0.9} />
                        <stop offset="95%" stopColor={options.colorTo} stopOpacity={0.2} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey={selectedAvailableProducts.length ? 'no-value' : 'value'}
                    type="monotone"
                    fill="url(#fill)"
                    fillOpacity={0.4}
                    stroke={options.stroke}
                    stackId="a"
                />

                {selectedAvailableProducts.length
                    ? selectedAvailableProducts.map(selectedProduct => (
                          <Line
                              dot={false}
                              stroke={selectedProduct.color}
                              key={selectedProduct.id}
                              dataKey={selectedProduct.id}
                          />
                      ))
                    : null}
            </ComposedChart>
        </ChartContainer>
    );
};
