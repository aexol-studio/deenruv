import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Separator,
  useLazyQuery,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useState } from 'react';
import { ChartMetricType, MetricIntervalType } from '../../zeus';
import { useTranslation } from 'react-i18next';
import { endOfToday, startOfToday } from 'date-fns';
import { PeriodSelect, Period, Periods } from '../shared';
import { dashCaseToSpaces } from './dashCaseToSpaces';
import { colors, EmptyData } from '../shared';

import { CategoriesMetricQuery, ProductCollectionsQuery } from '../../graphql';

export const CategoriesChartWidget = () => {
  const { t } = useTranslation('dashboard-widgets-plugin', {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const [chartData, setChartData] = useState<
    { category: string; value: number }[]
  >([]);

  const [fetchBetterMetrics] = useLazyQuery(CategoriesMetricQuery);
  const [fetchProductCollections] = useLazyQuery(ProductCollectionsQuery);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    period: Periods.Today,
    text: t('today'),
    start: startOfToday(),
    end: endOfToday(),
  });
  const fetchData = useCallback(async () => {
    fetchBetterMetrics({
      input: {
        orderStates: [],
        interval: MetricIntervalType.Day,
        range: {
          start: selectedPeriod.start,
          end: selectedPeriod.end,
        },
        types: [ChartMetricType.OrderTotalProductsCount],
      },
    }).then(({ chartMetric }) => {
      const entries = chartMetric.data[0].entries;
      const salesTotals: Record<string, { name: string; quantity: number }> =
        {};

      entries.forEach((entry) => {
        entry.additionalData?.forEach((product) => {
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

      fetchProductCollections({ in: Object.keys(salesTotals) }).then(
        ({ products }) => {
          const categoryCounts: Record<string, number> = {};

          products?.items.forEach(({ collections }) => {
            collections
              .filter((c) => c.slug !== 'wszystkie')
              .forEach((category) => {
                const categoryName = dashCaseToSpaces(category.slug.trim());
                if (categoryCounts[categoryName]) {
                  categoryCounts[categoryName] += 1;
                } else {
                  categoryCounts[categoryName] = 1;
                }
              });
          });

          const _chartData = Object.entries(categoryCounts)
            .map(([category, count]) => ({
              category,
              value: count,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

          setChartData(_chartData);
        },
      );
    });
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
    config[item.category] = {
      label: item.category,
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
        <div className="flex -mb-[1px] items-center gap-8">
          <CardTitle className="text-lg">{t('categories')}</CardTitle>
          <PeriodSelect
            selectedPeriod={selectedPeriod.period}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </CardHeader>
      <Separator className="mb-3" />
      <CardContent className="flex flex-1 justify-center items-center pb-0">
        {!chartData.length ? (
          <div className="flex flex-col items-center text-center">
            <EmptyData text={t('emptyData')} />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            style={{ height: `300px`, width: '100%' }}
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" label nameKey="category">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.category].color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
