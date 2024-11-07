import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import React, { useMemo } from 'react';
import { BetterMetricType } from '../../zeus';
import { camelCaseToSpaces } from '@deenruv/react-ui-devkit';
import { CustomTooltip } from './CustomTooltip';
import { ChartConfig, ChartContainer, ChartTooltip } from '@deenruv/react-ui-devkit';

interface ChartProps {
    data: { name: string; value: number; type: BetterMetricType }[];
    language: string;
    options?: { colorFrom?: string; colorTo?: string; stroke?: string };
}

const HEIGHT = 300;

export const OrdersChart: React.FC<ChartProps> = ({ data, language, options: _options }) => {
    const chartConfig = useMemo((): ChartConfig => {
        return { value: { label: camelCaseToSpaces(data[0]?.type) } };
    }, [data]);

    const options = _options || {
        colorFrom: `#4338ca`,
        colorTo: `#6366f1`,
        stroke: `#6366f1`,
    };

    return (
        <ChartContainer config={chartConfig} style={{ height: `${HEIGHT}px`, width: '100%' }}>
            <AreaChart
                height={HEIGHT}
                accessibilityLayer
                data={data}
                margin={{
                    top: 4,
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis dataKey="value" tickLine={false} axisLine={false} tickMargin={4} />
                <ChartTooltip
                    cursor={false}
                    content={p => <CustomTooltip chartProps={p} language={language} />}
                />
                <defs>
                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={options.colorFrom} stopOpacity={0.9} />
                        <stop offset="95%" stopColor={options.colorTo} stopOpacity={0.2} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="value"
                    type="monotone"
                    fill="url(#fill)"
                    fillOpacity={0.4}
                    stroke={options.stroke}
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};
