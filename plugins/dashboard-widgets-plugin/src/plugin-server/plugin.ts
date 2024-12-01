import { PluginCommonModule, DeenruvPlugin, Type } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { BetterMetricsService } from './services/metrics.service';
import gql from 'graphql-tag';
import { AdminUIController } from './controllers/admin-ui-controller';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { DashboardWidgetsPluginOptions } from './types';
@DeenruvPlugin({
    compatibility: '0.0.20',
    imports: [PluginCommonModule],
    controllers: [AdminUIController],
    providers: [
        BetterMetricsService,
        {
            provide: PLUGIN_INIT_OPTIONS,
            useFactory: () => DashboardWidgetsPlugin.options,
        },
    ],
    configuration: config => {
        return config;
    },
    adminApiExtensions: {
        schema: gql`
            type ChartDataType {
                interval: BetterMetricInterval!
                type: ChartMetricType!
                title: String!
                entries: [ChartEntry!]!
            }

            type ChartMetrics {
                data: [ChartDataType!]!
                lastCacheRefreshTime: String!
            }
            type OrderSummaryMetrics {
                data: OrderSummaryDataMetric!
                lastCacheRefreshTime: String!
            }
            type OrderSummaryDataMetric {
                currencyCode: CurrencyCode!
                total: Float!
                totalWithTax: Float!
                orderCount: Float!
                averageOrderValue: Float!
                averageOrderValueWithTax: Float!
            }
            enum BetterMetricInterval {
                Weekly
                Monthly
                Yearly
                Custom
                LastWeek
                ThisMonth
                LastMonth
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
                priceWithTax: Float!
            }

            type ChartEntry {
                label: String!
                value: Float!
                additionalData: [ChartEntryAdditionalData!]
            }
            input BetterMetricIntervalInput {
                type: BetterMetricInterval!
                start: DateTime
                end: DateTime
            }

            input OrderSummaryMetricInput {
                interval: BetterMetricIntervalInput!
                refresh: Boolean
            }

            input ChartMetricInput {
                interval: BetterMetricIntervalInput!
                types: [ChartMetricType!]!
                productIDs: [String!]
                refresh: Boolean
            }

            extend type Query {
                chartMetric(input: ChartMetricInput!): ChartMetrics!
                orderSummaryMetric(input: OrderSummaryMetricInput!): OrderSummaryMetrics!
            }
        `,
        resolvers: [AdminResolver],
    },
})
export class DashboardWidgetsPlugin {
    private static options?: DashboardWidgetsPluginOptions;

    static init(options: DashboardWidgetsPluginOptions): Type<DashboardWidgetsPlugin> {
        DashboardWidgetsPlugin.options = options;
        return this;
    }
}
