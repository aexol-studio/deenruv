import {
  Label,
  priceFormatter,
  Switch,
  useLazyQuery,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React, { useEffect, useMemo, useState } from "react";
import { OrderSummaryMetricsQuery } from "../../graphql";
import { DateRangeType } from "../../types";
import { CurrencyCode, ModelTypes } from "../../zeus";

import { giveSummaryMetricsRatio } from "../../utils";
import { RatioBadge } from "./RatioBadge";

interface OrdersSummaryTileProps {
  net?: boolean;
  setNet: (net: boolean) => void;
  dateRange: { range: DateRangeType; prevRange: DateRangeType };
  orderStates: string[];
}

export const OrdersSummaryTile: React.FC<OrdersSummaryTileProps> = ({
  dateRange,
  orderStates,
  net,
  setNet,
}) => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  const [getOrdersSummaryMetric] = useLazyQuery(OrderSummaryMetricsQuery);
  const [metricLoading, setMetricLoading] = useState(false);
  const [ordersSummaryMetric, setOrdersSummaryMetrics] = useState<{
    metric: ModelTypes["OrderSummaryDataMetric"];
    prevRatio: ModelTypes["OrderSummaryDataMetric"];
  }>();

  const getOrders = async ({
    prevRange,
    range,
    refresh = false,
    _orderStates,
  }: {
    range: DateRangeType;
    prevRange: DateRangeType;
    refresh?: boolean;
    _orderStates: string[];
  }) => {
    try {
      setMetricLoading(true);
      const response = await getOrdersSummaryMetric({
        prevInput: {
          range: prevRange,
          orderStates: _orderStates,
        },
        input: {
          range,
          orderStates: _orderStates,
        },
      });
      const metric = response.orderSummaryMetric.data;
      const prevMetric = response.prevOrderSummaryMetric.data;
      const prevRatio = giveSummaryMetricsRatio(metric, prevMetric);
      setOrdersSummaryMetrics({
        metric,
        prevRatio,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setMetricLoading(false);
    }
  };

  useEffect(() => {
    getOrders({ ...dateRange, _orderStates: orderStates });
  }, [dateRange, orderStates]);

  const total = useMemo(() => {
    if (ordersSummaryMetric && net) {
      return ordersSummaryMetric.metric.total;
    } else if (ordersSummaryMetric) {
      return ordersSummaryMetric.metric.totalWithTax;
    }
    return 0;
  }, [net, ordersSummaryMetric]);

  const totalRatio = useMemo(() => {
    if (ordersSummaryMetric && net) {
      return ordersSummaryMetric.prevRatio.total;
    } else if (ordersSummaryMetric) {
      return ordersSummaryMetric.prevRatio.totalWithTax;
    }
    return 0;
  }, [net, ordersSummaryMetric]);

  const average = useMemo(() => {
    if (ordersSummaryMetric && net) {
      return ordersSummaryMetric.metric.averageOrderValue;
    } else if (ordersSummaryMetric) {
      return ordersSummaryMetric.metric.averageOrderValueWithTax;
    }
    return 0;
  }, [net, ordersSummaryMetric]);

  const averageRatio = useMemo(() => {
    if (ordersSummaryMetric && net) {
      return ordersSummaryMetric.prevRatio.averageOrderValue;
    } else if (ordersSummaryMetric) {
      return ordersSummaryMetric.prevRatio.averageOrderValueWithTax;
    }
    return 0;
  }, [net, ordersSummaryMetric]);

  return (
    <div className="px-6">
      <div className="flex items-center justify-between py-4">
        <h2>{t("summary")}</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="net">{net ? t("netSold") : t("grossSold")}</Label>
          <Switch
            id="net"
            checked={net}
            onCheckedChange={(checked) => {
              setNet(checked);
              getOrders({
                ...dateRange,
                refresh: true,
                _orderStates: orderStates,
                prevRange: dateRange.prevRange,
              });
            }}
          />
        </div>
      </div>
      <div className="bg-muted/20 grid grid-cols-2 rounded-md border lg:grid-cols-4">
        <div>
          <div className="border-r p-6 pb-1">
            <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
              <h4 className="text-foreground/70 text-sm">
                {net ? t("netSold") : t("grossSold")}
              </h4>
              <RatioBadge ratio={totalRatio} />
            </div>
            <h3 className="flex items-end">
              {priceFormatter(
                total || 0,
                ordersSummaryMetric?.metric?.currencyCode || CurrencyCode.PLN,
              )}
            </h3>
          </div>
        </div>
        <div className="border-r p-6 ">
          <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
            <h4 className="text-foreground/70 text-sm">
              {net ? t("averageNetSold") : t("averageGrossSold")}
            </h4>
            <RatioBadge ratio={averageRatio} />
          </div>
          <h3 className="flex items-end">
            {priceFormatter(
              average || 0,
              ordersSummaryMetric?.metric?.currencyCode || CurrencyCode.PLN,
            )}
          </h3>
        </div>
        <div className="border-r border-t  p-6 xl:border-t-0">
          <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
            <h4 className="text-foreground/70 text-sm">{t("orders")}</h4>
            <RatioBadge ratio={ordersSummaryMetric?.prevRatio.orderCount} />
          </div>

          <h3>{ordersSummaryMetric?.metric?.orderCount || 0}</h3>
        </div>
        <div className="border-t  p-6 xl:border-t-0">
          <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
            <h4 className="text-foreground/70 text-sm">{t("soldProducts")}</h4>
            <RatioBadge ratio={ordersSummaryMetric?.prevRatio.productCount} />
          </div>
          <h3>{ordersSummaryMetric?.metric?.productCount || 0}</h3>
        </div>
      </div>
    </div>
  );
};
