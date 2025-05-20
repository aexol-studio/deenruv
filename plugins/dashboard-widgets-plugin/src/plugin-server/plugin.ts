import { PluginCommonModule, DeenruvPlugin, Type } from "@deenruv/core";
import { AdminResolver } from "./resolvers/admin.resolver";
import { BetterMetricsService } from "./services/metrics.service";
import gql from "graphql-tag";
import { AdminUIController } from "./controllers/admin-ui-controller";
import { PLUGIN_INIT_OPTIONS } from "./constants";
import { DashboardWidgetsPluginOptions } from "./types";
import { OrderSummaryViewEntity } from "./materialisedViewEntities/order_summary";
import { TotalProductsViewEntity } from "./materialisedViewEntities/total_products";
import { OrderSummaryWithStateViewEntity } from "./materialisedViewEntities/orders_summary_with_state";
import { TotalProductsWithStateViewEntity } from "./materialisedViewEntities/total_products_with_state";
import { RefreshViewController } from "./controllers/refresh-view-controller";

@DeenruvPlugin({
  compatibility: "^0.0.0",
  imports: [PluginCommonModule],
  controllers: [AdminUIController, RefreshViewController],
  entities: [
    OrderSummaryViewEntity,
    OrderSummaryWithStateViewEntity,
    TotalProductsViewEntity,
    TotalProductsWithStateViewEntity,
  ],
  providers: [
    BetterMetricsService,
    {
      provide: PLUGIN_INIT_OPTIONS,
      useFactory: () => DashboardWidgetsPlugin.options,
    },
  ],
  configuration: (config) => {
    return config;
  },
  adminApiExtensions: {
    schema: gql`
      type AdditionalOrderState {
        state: String!
        selectedByDefault: Boolean!
      }

      type ChartDataType {
        type: ChartMetricType!
        title: String!
        entries: [ChartEntry!]!
      }

      type ChartMetrics {
        data: [ChartDataType!]!
      }
      type OrderSummaryMetrics {
        data: OrderSummaryDataMetric!
      }
      type OrderSummaryDataMetric {
        currencyCode: CurrencyCode!
        total: Float!
        totalWithTax: Float!
        orderCount: Float!
        averageOrderValue: Float!
        averageOrderValueWithTax: Float!
        productCount: Float!
      }
      enum MetricRangeType {
        Today
        Yesterday
        ThisWeek
        LastWeek
        ThisMonth
        LastMonth
        ThisYear
        LastYear
        FirstQuarter
        SecondQuarter
        ThirdQuarter
        FourthQuarter
        Custom
      }

      enum MetricIntervalType {
        Day
        Hour
      }

      enum ChartMetricType {
        OrderCount
        OrderTotal
        AverageOrderValue
        OrderTotalProductsCount
      }
      type ChartEntryAdditionalData {
        id: String!
        name: String!
        quantity: Float!
      }

      type ChartEntry {
        intervalTick: Int!
        value: Float!
        additionalData: [ChartEntryAdditionalData!]
      }
      input BetterMetricRangeInput {
        start: DateTime!
        end: DateTime
      }

      input OrderSummaryMetricInput {
        range: BetterMetricRangeInput!
        orderStates: [String!]!
      }

      input ChartMetricInput {
        range: BetterMetricRangeInput!
        interval: MetricIntervalType!
        types: [ChartMetricType!]!
        orderStates: [String!]!
        productIDs: [String!]
        net: Boolean
      }

      extend type Query {
        additionalOrderStates: [AdditionalOrderState!]!
        chartMetric(input: ChartMetricInput!): ChartMetrics!
        orderSummaryMetric(
          input: OrderSummaryMetricInput!
        ): OrderSummaryMetrics!
      }
    `,
    resolvers: [AdminResolver],
  },
})
export class DashboardWidgetsPlugin {
  private static options?: DashboardWidgetsPluginOptions;

  static init(
    options: DashboardWidgetsPluginOptions,
  ): Type<DashboardWidgetsPlugin> {
    DashboardWidgetsPlugin.options = options;
    return this;
  }
}
