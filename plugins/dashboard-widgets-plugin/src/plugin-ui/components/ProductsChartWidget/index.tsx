import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ORDER_STATE,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useLazyQuery,
  useSettings,
  useWidgetItem,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { ChartConfig, ChartTooltip, Separator } from "@deenruv/react-ui-devkit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MetricRangeType,
  ChartMetricType,
  MetricIntervalType,
} from "../../zeus";

import { endOfWeek, startOfWeek } from "date-fns";
import { colors, EmptyData } from "../shared";
import { BarChartMetricQuery } from "../../graphql";

import { CurrencyCode } from "@deenruv/admin-types";
import { CustomBarChartTooltip } from "./CustomBarChartTooltip";
import { UIPluginOptions } from "../..";
import { getCustomIntervalDates, getRandomColor } from "../../utils";

import { DateRangeType } from "../../types";
import { MetricsRangeSelect } from "../shared/MetricsRangeSelect";

type ShowData = "FIRST_FIVE" | "ALL";

export const ProductsChartWidget = () => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  const [fetchChartMetrics] = useLazyQuery(BarChartMetricQuery);
  const currencyCode = useSettings((p) => p.selectedChannel?.currencyCode);
  const [showData, setShowData] = useState<ShowData>("FIRST_FIVE");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricRangeTypeSelectValue, setMetricRangeTypeSelectValue] = useState(
    MetricRangeType.ThisWeek,
  );
  const [chartData, setChartData] = useState<
    { product: string; value: number }[]
  >([]);
  const [selectedOrderStates, setSelectedOrderStates] = useState<
    Array<ORDER_STATE[keyof ORDER_STATE]>
  >([
    "PaymentSettled",
    "PartiallyShipped",
    "Shipped",
    "PartiallyDelivered",
    "Delivered",
  ]);
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
            orderStates: selectedOrderStates as string[],
            range: dateRange,
            types: [ChartMetricType.OrderTotalProductsCount],
            interval: MetricIntervalType.Day,
          },
        }).then(({ chartMetric }) => {
          const entries = chartMetric.data[0].entries;
          const salesTotals: Record<
            string,
            { name: string; quantity: number }
          > = {};

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

          const _chartData = Object.values(salesTotals)
            .map((product) => ({
              product: product.name,
              value: product.quantity,
            }))
            .sort((a, b) => b.value - a.value);

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

  const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
    config[item.product] = {
      label: item.product,
      color: getRandomColor(barColors),
    };
    return config;
  }, {} as ChartConfig);
  useEffect(() => {
    setDateRange(getCustomIntervalDates(metricRangeTypeSelectValue).range);
  }, [metricRangeTypeSelectValue]);
  useEffect(() => {
    fetchData();
  }, [dateRange, selectedOrderStates]);

  return (
    <Card className="flex h-full flex-col border-0 shadow-none">
      <CardHeader className="flex justify-between">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg">{t("bestsellers")}</CardTitle>{" "}
          <div className="flex w-[240px] flex-col gap-2">
            <MetricsRangeSelect
              value={metricRangeTypeSelectValue}
              changeMetricInterval={setMetricRangeTypeSelectValue}
              loading={metricLoading}
              withoutCustom
            />
            <Select
              onValueChange={(value) => setShowData(value as ShowData)}
              value={showData}
              defaultValue={"BY_COUNT"}
            >
              <SelectTrigger className="h-[30px] w-[240px] text-[13px]">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"FIRST_FIVE"}>
                    {t("showFirstFive")}
                  </SelectItem>
                  <SelectItem value={"ALL"}>{t("showAll")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-3" />
      <CardContent className="flex flex-1 items-center justify-center text-xs  ">
        {!chartData.length ? (
          <div className="flex flex-col items-center text-center">
            <EmptyData text={t("emptyData")} />
          </div>
        ) : (
          <ResponsiveContainer
            className="transition-all"
            width="100%"
            height={
              (showData === "FIRST_FIVE"
                ? chartData.slice(0, 5).length
                : chartData.length) * 50
            }
          >
            <BarChart
              data={
                showData === "FIRST_FIVE" ? chartData.slice(0, 5) : chartData
              }
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
                content={(p) => (
                  <CustomBarChartTooltip
                    currencyCode={currencyCode ?? CurrencyCode.PLN}
                    chartProps={p}
                  />
                )}
              />
              <Bar minPointSize={5} dataKey="value" radius={5} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.product].color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
