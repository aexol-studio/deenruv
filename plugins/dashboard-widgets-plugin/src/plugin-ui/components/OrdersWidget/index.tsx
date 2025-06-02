import React, { useCallback, useEffect, useMemo, useState } from "react";

import { differenceInDays, endOfWeek, startOfWeek, subWeeks } from "date-fns";

import {
  Card,
  CardHeader,
  CardContent,
  usePluginStore,
  useLazyQuery,
  ORDER_STATE,
  Checkbox,
  cn,
  useTranslation,
  useSettings,
  useQuery,
  useLocalStorage,
  DraggableSelect,
  Button,
} from "@deenruv/react-ui-devkit";

import { MetricsCustomDates } from "./MetricCustomDates";
import { MetricTypeSelect } from "./MetricTypeSelect";
import { OrdersChart } from "./OrdersChart";

import {
  MetricRangeType,
  ChartMetricType,
  MetricIntervalType,
} from "../../zeus";
import { AdditionalOrderStatesQuery, ChartMetricQuery } from "../../graphql";

import {
  convertBackedDataToChartData,
  generateBrightRandomColor,
  getCustomIntervalDates,
  groupByPeriods,
  parseNameToCurrentLanguage,
} from "../../utils";

import {
  BetterMetricsChartDataType,
  DateRangeType,
  GroupBy,
} from "../../types";
import { MetricsRangeSelect } from "../shared/MetricsRangeSelect";
import { OrdersSummaryTile } from "./OrdersSummaryTile";
import { OrderStatesSelect } from "../shared/OrderStatesSelect";
import { ProductSelector } from "./ProductSelector";
import { GroupBySelect } from "./GroupBySelect";
import { PanelsTopLeft } from "lucide-react";

export const OrdersWidget = () => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  const [net, setNet] = useState(false);
  const { data } = useQuery(AdditionalOrderStatesQuery);
  const [fetchChartMetrics] = useLazyQuery(ChartMetricQuery);
  const { language } = usePluginStore();
  const channel = useSettings((state) => state.selectedChannel);
  const [metricLoading, setMetricLoading] = useState(false);
  const [shouldShowCompare, setShouldShowCompare] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
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
    useLocalStorage<MetricRangeType>(
      "orders-metric-range",
      MetricRangeType.Today,
    );
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
    (string | ORDER_STATE)[]
  >([
    "PaymentSettled",
    "PartiallyShipped",
    "Shipped",
    "PartiallyDelivered",
    "Delivered",
  ]);

  useEffect(() => {
    if (!data) return;
    const selectedAdditionalOrderStates = data.additionalOrderStates.filter(
      (state) => state.selectedByDefault,
    );
    setSelectedOrderStates((prev) => [
      ...prev,
      ...selectedAdditionalOrderStates
        .map((state) => state.state)
        .filter((state) => !prev.includes(state)),
    ]);
  }, [data]);

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
          net,
        },
        input: {
          types: [metricType],
          range,
          orderStates: selectedOrderStates as string[],
          interval,
          net,
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
  }, [dateRange, metricType, selectedOrderStates, net]);

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
  }, [
    net,
    channel,
    dateRange,
    metricType,
    selectedOrderStates,
    data?.additionalOrderStates,
  ]);

  const changeCustomMetricRange = (
    date: Date | undefined,
    key: "end" | "start",
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
          const name = parseNameToCurrentLanguage(entry.name, language);
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
          return { ...entry, name, ...reduced };
        }),
      )
      .flat();

    return { allData };
  }, [betterMetrics, net, language, selectedAvailableProducts]);

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

  const shouldShowGroupBy = useMemo(() => {
    const { start, end } = dateRange.range;
    return end && differenceInDays(end, start) > 28;
  }, [dateRange.range.start, dateRange.range.end]);

  const groupedData = useMemo(() => {
    const { start, end } = dateRange.range;
    const shouldShowGroupBy = end && differenceInDays(end, start) > 28;

    if (!shouldShowGroupBy) return betterData.allData;
    return Object.values(
      groupByPeriods({ data: betterData.allData, language, groupBy }),
    );
  }, [betterData.allData, groupBy, dateRange.range.start, dateRange.range.end]);

  const options = useMemo(
    () =>
      [
        ...Object.values(ORDER_STATE),
        ...(data?.additionalOrderStates.map(({ state }) => state) || []),
      ]
        .filter((i, index, arr) => arr.indexOf(i) === index)
        .sort((a, b) => a.localeCompare(b))
        .map((state) => ({
          value: state,
          label: parseNameToCurrentLanguage(state, language),
        })),
    [data?.additionalOrderStates],
  );

  return (
    <Card className="border-0 py-6 pr-6 shadow-none ">
      <CardHeader className="flex-col items-start justify-between gap-2 pt-0 xl:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 xl:flex-row">
            <div className="flex gap-2">
              <MetricsRangeSelect
                value={metricRangeTypeSelectValue}
                changeMetricInterval={setMetricRangeTypeSelectValue}
                loading={metricLoading}
              />
              {shouldShowGroupBy ? (
                <GroupBySelect
                  value={groupBy}
                  changeGroupBy={(value: GroupBy) => setGroupBy(value)}
                />
              ) : null}
            </div>
            <MetricsCustomDates
              isVisible={metricRangeTypeSelectValue === MetricRangeType.Custom}
              endDate={dateRange.range.end as Date | undefined}
              startDate={dateRange.range.start as Date | undefined}
              setDate={changeCustomMetricRange}
            />
          </div>

          <div
            className={cn(
              "flex cursor-pointer  items-center gap-2 text-sm opacity-0 select-none",
              metricRangeTypeSelectValue !== MetricRangeType.Custom &&
                metricType !== ChartMetricType.OrderTotalProductsCount &&
                "opacity-100 select-auto",
            )}
          >
            <Checkbox
              id="compare"
              checked={shouldShowCompare}
              onCheckedChange={(e) => setShouldShowCompare(e as boolean)}
            />
            <label
              htmlFor="compare"
              className="text-foreground/70 shrink-0 cursor-pointer select-none text-[0.75rem] font-medium leading-none"
            >
              {t("compare")}
            </label>
          </div>
        </div>
        <div className="!mt-0 flex items-center gap-2">
          <DraggableSelect
            localStorageKey="orders-widget-order-states"
            align="end"
            title={t("selectOrderStates")}
            button={
              <Button variant="outline" size="sm" className="h-8 gap-2 py-0">
                {selectedOrderStates.length
                  ? `${t("selectedOrderStates")} (${selectedOrderStates.length})`
                  : t("selectOrderStates")}
                <PanelsTopLeft className="size-4" aria-hidden="true" />
              </Button>
            }
            value={selectedOrderStates}
            onChange={setSelectedOrderStates}
            options={options}
          />
          <MetricTypeSelect
            metricType={metricType}
            changeMetricType={setMetricType}
            loading={metricLoading}
          />
        </div>
      </CardHeader>
      <OrdersSummaryTile
        net={net}
        setNet={setNet}
        orderStates={selectedOrderStates as string[]}
        dateRange={dateRange}
      />

      <div className="mb-6" />
      <CardContent className="mb-6 mr-6 p-0">
        <div
          className={cn(
            "pl-6 flex justify-start pb-6 opacity-0 select-none",
            metricType === ChartMetricType.OrderTotalProductsCount &&
              "opacity-100 select-auto",
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
          data={groupedData}
          language={language}
          metricType={metricType}
        />
      </CardContent>
    </Card>
  );
};
