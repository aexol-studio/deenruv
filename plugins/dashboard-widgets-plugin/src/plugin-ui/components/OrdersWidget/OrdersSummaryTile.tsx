import { priceFormatter, useLazyQuery } from "@deenruv/react-ui-devkit";
import React, { useEffect, useState } from "react";
import { OrderSummaryMetricsQuery } from "../../graphql";
import { DateRangeType } from "../../types";
import { CurrencyCode, ModelTypes } from "../../zeus";
import { useTranslation } from "react-i18next";

import { giveSummaryMetricsRatio } from "../../utils";
import { RatioBadge } from "./RatioBadge";

interface OrdersSummaryTileProps {
  dateRange: { range: DateRangeType; prevRange: DateRangeType };
  orderStates: string[];
}

export const OrdersSummaryTile: React.FC<OrdersSummaryTileProps> = ({
  dateRange,
  orderStates,
}) => {
  const { t } = useTranslation("dashboard-widgets-plugin", {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
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

  return (
    <div className="px-6">
      <h2 className="pb-2">{t("summary")}</h2>
      <div className="bg-muted/20 grid grid-cols-2 rounded-md border lg:grid-cols-4">
        <div className="border-r p-6 pb-1">
          <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
            <h4 className="text-foreground/70 text-sm">{t("netSold")}</h4>
            <RatioBadge ratio={ordersSummaryMetric?.prevRatio.total} />
          </div>
          <h3 className="flex items-end">
            {priceFormatter(
              ordersSummaryMetric?.metric?.total || 0,
              ordersSummaryMetric?.metric?.currencyCode || CurrencyCode.PLN,
            )}
          </h3>
        </div>
        <div className="border-r p-6 ">
          <div className="flex flex-col-reverse justify-between gap-1 2xl:flex-row 2xl:items-center">
            <h4 className="text-foreground/70 text-sm">
              {t("averageNetSold")}
            </h4>
            <RatioBadge
              ratio={ordersSummaryMetric?.prevRatio.averageOrderValue}
            />
          </div>
          <h3 className="flex items-end">
            {priceFormatter(
              ordersSummaryMetric?.metric?.averageOrderValue || 0,
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
