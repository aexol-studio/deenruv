import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { differenceInDays, endOfWeek, startOfWeek, subWeeks } from 'date-fns';

import {
  Card,
  CardHeader,
  CardContent,
  usePluginStore,
  useLazyQuery,
  ORDER_STATE,
  Checkbox,
  cn,
} from '@deenruv/react-ui-devkit';

import { MetricsCustomDates } from './MetricCustomDates';
import { MetricTypeSelect } from './MetricTypeSelect';
import { OrdersChart } from './OrdersChart';

import {
  MetricRangeType,
  ChartMetricType,
  MetricIntervalType,
} from '../../zeus';
import { ChartMetricQuery } from '../../graphql';

import {
  convertBackedDataToChartData,
  generateBrightRandomColor,
  getCustomIntervalDates,
} from '../../utils';

import { BetterMetricsChartDataType, DateRangeType } from '../../types';
import { MetricsRangeSelect } from '../shared/MetricsRangeSelect';
import { OrdersSummaryTile } from './OrdersSummaryTile';
import { OrderStatesSelect } from '../shared/OrderStatesSelect';
import { ProductSelector } from './ProductSelector';

export const OrdersWidget = () => {
  const { t } = useTranslation('dashboard-widgets-plugin', {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const [fetchChartMetrics] = useLazyQuery(ChartMetricQuery);
  const { language } = usePluginStore();
  const [metricLoading, setMetricLoading] = useState(false);
  const [shouldShowCompare, setShouldShowCompare] = useState(false);
  const [dateRange, setDateRange] = useState<{
    range: DateRangeType;
    prevRange: DateRangeType;
  }>({
    range: {
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    },
    prevRange: {
      start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    },
  });
  const [metricRangeTypeSelectValue, setMetricRangeTypeSelectValue] =
    useState<MetricRangeType>();
  const [metricType, setMetricType] = useState<ChartMetricType>(
    ChartMetricType.OrderTotal,
  );

  const [betterMetrics, setBetterMetrics] =
    useState<BetterMetricsChartDataType>({ data: [] });

  const [allAvailableProducts, setAllAvailableProducts] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedAvailableProducts, setSelectedAvailableProducts] = useState<
    { id: string; color: string }[]
  >([]);
  const [selectedOrderStates, setSelectedOrderStates] = useState<
    Array<ORDER_STATE[keyof ORDER_STATE]>
  >([
    'PaymentSettled',
    'PartiallyShipped',
    'Shipped',
    'PartiallyDelivered',
    'Delivered',
  ]);
  const fetchData = useCallback(async () => {
    try {
      setMetricLoading(true);
      let interval = MetricIntervalType.Day;
      const { range, prevRange } = dateRange;
      if (range.end) {
        const diffrenceInDays = differenceInDays(range.end, range.start);
        interval =
          diffrenceInDays > 0
            ? MetricIntervalType.Day
            : MetricIntervalType.Hour;
      }
      const { chartMetric, prevChartMetric } = await fetchChartMetrics({
        prevInput: {
          types: [metricType],
          range: { ...prevRange },
          orderStates: selectedOrderStates as string[],
          interval,
        },
        input: {
          types: [metricType],
          range,
          orderStates: selectedOrderStates as string[],
          interval,
        },
      });

      if (chartMetric?.data?.length) {
        const dataWithMappedEntries = chartMetric.data.map((data, i) => {
          const prevEntries = prevChartMetric.data[i]?.entries ?? [];

          return {
            ...data,
            entries: convertBackedDataToChartData({
              type: data.type,
              entries: data.entries,
              prevEntries,
              interval,
              language,
              start: range.start,
              end: range.end,
            }),
          };
        });
        if (metricType === ChartMetricType.OrderTotalProductsCount) {
          const flatted = dataWithMappedEntries.map((d) => d.entries).flat();
          const allAvailableProducts = flatted.reduce(
            (acc, curr) => {
              curr.additionalData?.forEach((product) => {
                if (!acc.some((p) => p.id === product.id)) {
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
          data: dataWithMappedEntries,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMetricLoading(false);
    }
  }, [dateRange, metricType, selectedOrderStates]);

  useEffect(() => {
    if (metricRangeTypeSelectValue !== MetricRangeType.Custom)
      setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue));
    if (
      metricType === ChartMetricType.OrderTotalProductsCount ||
      metricRangeTypeSelectValue === MetricRangeType.Custom
    )
      setShouldShowCompare(false);

    if (metricType === ChartMetricType.OrderTotalProductsCount) return;
    setSelectedAvailableProducts([]);
  }, [metricRangeTypeSelectValue, metricType]);

  useEffect(() => {
    fetchData();
  }, [dateRange, metricType, selectedOrderStates]);

  const changeCustomMetricRange = (
    date: Date | undefined,
    key: 'end' | 'start',
  ) => {
    if (!date) return;
    setDateRange((p) => ({
      ...p,
      range: { ...p.range, [key]: date } as DateRangeType,
    }));
  };

  const betterData = useMemo(() => {
    const allData = betterMetrics.data
      .map((metric) =>
        metric.entries.map((entry) => {
          const reduced = selectedAvailableProducts.reduce(
            (acc, selectedProduct) => {
              const product = entry.additionalData?.find(
                (data) => data.id === selectedProduct.id,
              );
              acc[selectedProduct.id] = product?.quantity ?? 0;
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
    setSelectedAvailableProducts((prev) =>
      prev.some((product) => product.id === id)
        ? prev.filter((p) => p.id !== id)
        : [
            ...prev,
            {
              id,
              color: generateBrightRandomColor(),
            },
          ],
    );
  };
  const onSelectedAStatesChange = (value: string) => {
    setSelectedOrderStates((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <Card className="border-0 shadow-none pr-6 py-6 ">
      <CardHeader className="pt-0 flex-col xl:flex-row gap-2 justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col xl:flex-row gap-2">
            <MetricsRangeSelect
              value={metricRangeTypeSelectValue}
              changeMetricInterval={setMetricRangeTypeSelectValue}
              loading={metricLoading}
            />
            <MetricsCustomDates
              isVisible={metricRangeTypeSelectValue === MetricRangeType.Custom}
              endDate={dateRange.range.end as Date | undefined}
              startDate={dateRange.range.start as Date | undefined}
              setDate={changeCustomMetricRange}
            />
          </div>

          <div
            className={cn(
              'flex cursor-pointer  items-center gap-2 text-sm opacity-0 select-none',
              metricRangeTypeSelectValue !== MetricRangeType.Custom &&
                metricType !== ChartMetricType.OrderTotalProductsCount &&
                'opacity-100 select-auto',
            )}
          >
            <Checkbox
              id="compare"
              checked={shouldShowCompare}
              onCheckedChange={(e) => setShouldShowCompare(e as boolean)}
            />
            <label
              htmlFor="compare"
              className="cursor-pointer shrink-0 text-[0.75rem] select-none font-medium leading-none text-foreground/70"
            >
              {t('compare')}
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 !mt-0">
          <OrderStatesSelect
            selectedOrderStates={selectedOrderStates as string[]}
            onSelectedOrderStatesChange={onSelectedAStatesChange}
          />
          <MetricTypeSelect
            metricType={metricType}
            changeMetricType={setMetricType}
            loading={metricLoading}
          />
        </div>
      </CardHeader>
      <OrdersSummaryTile
        orderStates={selectedOrderStates as string[]}
        dateRange={dateRange}
      />

      <div className="mb-6" />
      <CardContent className="p-0 mr-6 mb-6">
        <div
          className={cn(
            'pl-6 flex justify-start pb-6 opacity-0 select-none',
            metricType === ChartMetricType.OrderTotalProductsCount &&
              'opacity-100 select-auto',
          )}
        >
          <ProductSelector
            onSelectedAvailableProductsChange={
              onSelectedAvailableProductsChange
            }
            clearSelectedProducts={() => setSelectedAvailableProducts([])}
            metricType={metricType}
            allAvailableProducts={allAvailableProducts}
            selectedAvailableProducts={selectedAvailableProducts}
          />
        </div>
        <OrdersChart
          shouldShowCompare={
            metricRangeTypeSelectValue === MetricRangeType.Custom
              ? false
              : shouldShowCompare
          }
          selectedAvailableProducts={selectedAvailableProducts}
          data={betterData.allData}
          language={language}
          metricType={metricType}
        />
      </CardContent>
    </Card>
  );
};
