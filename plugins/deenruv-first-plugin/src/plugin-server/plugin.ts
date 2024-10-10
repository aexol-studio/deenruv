import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { BetterMetricsService } from './services/metrics.service';
import gql from 'graphql-tag';

@DeenruvPlugin({
    compatibility: '0.0.1',
    imports: [PluginCommonModule],
    providers: [BetterMetricsService],
    adminApiExtensions: {
        schema: gql`
            type BetterMetricSummary {
                interval: BetterMetricInterval!
                type: BetterMetricType!
                title: String!
                entries: [BetterMetricSummaryEntry!]!
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
                betterMetricSummary(input: BetterMetricSummaryInput!): [BetterMetricSummary!]!
            }
        `,
        resolvers: [AdminResolver],
    },
})
export class DeenruvFirstPlugin {}
