import { PluginCommonModule, DeenruvPlugin, Type } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { BetterMetricsService } from './services/metrics.service';
import gql from 'graphql-tag';
import { AdminUIController } from './controllers/admin-ui-controller';
import { DEFAULT_CACHE_TIME, PLUGIN_INIT_OPTIONS } from './constants';
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
            type BetterMetricDataType {
                interval: BetterMetricInterval!
                type: BetterMetricType!
                title: String!
                entries: [BetterMetricSummaryEntry!]!
            }

            type BetterMetricSummary {
                data: [BetterMetricDataType!]!
                lastCacheRefreshTime: DateTime!
            }
            enum BetterMetricInterval {
                Weekly
                Monthly
                Yearly
                Custom
                ThisWeek
                LastWeek
                ThisMonth
                LastMonth
            }
            enum BetterMetricType {
                OrderCount
                OrderTotal
                AverageOrderValue
                OrderTotalProductsCount
            }
            type BetterMeticSummaryEntryAdditionalData {
                id: String!
                name: String!
                quantity: Float!
            }

            type BetterMetricSummaryEntry {
                label: String!
                value: Float!
                additionalData: [BetterMeticSummaryEntryAdditionalData!]
            }
            input BetterMetricIntervalInput {
                type: BetterMetricInterval!
                start: DateTime
                end: DateTime
            }
            input BetterMetricSummaryInput {
                interval: BetterMetricIntervalInput!
                types: [BetterMetricType!]!
                productIDs: [String!]
                refresh: Boolean
            }

            extend type Query {
                betterMetricSummary(input: BetterMetricSummaryInput!): BetterMetricSummary!
            }
        `,
        resolvers: [AdminResolver],
    },
})
export class DashboardWidgetsPlugin {
    private static options: DashboardWidgetsPluginOptions;

    static init(options: DashboardWidgetsPluginOptions): Type<DashboardWidgetsPlugin> {
        DashboardWidgetsPlugin.options = options ?? { cacheTime: DEFAULT_CACHE_TIME };
        return this;
    }
}
