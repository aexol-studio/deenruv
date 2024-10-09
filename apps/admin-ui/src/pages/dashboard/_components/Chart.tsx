'use client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import React, { useMemo } from 'react';
import { BetterMetricType } from '@/zeus';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '../../../../tailwind.config.ts';
import { camelCaseToSpaces } from '@/utils/camelCaseToSpaces.ts';
import { CustomTooltip } from '@/pages/dashboard/_components/CustomTooltip.tsx';
const tailwindConfig = resolveConfig(tailwindConfigFile);

interface ChartProps {
  data: { name: string; value: number; type: BetterMetricType }[];
}

const HEIGHT = 300;

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartConfig = useMemo((): ChartConfig => {
    return {
      value: {
        label: camelCaseToSpaces(data[0]?.type),
      },
    };
  }, [data]);

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
        <ChartTooltip cursor={false} content={(p) => <CustomTooltip chartProps={p} />} />
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={tailwindConfig.theme.colors.blue['500']} stopOpacity={0.9} />
            <stop offset="95%" stopColor={tailwindConfig.theme.colors.indigo['700']} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          fill="url(#fill)"
          fillOpacity={0.4}
          stroke={tailwindConfig.theme.colors.blue['300']}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
