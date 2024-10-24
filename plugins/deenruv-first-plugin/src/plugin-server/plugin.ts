import { PluginCommonModule, DeenruvPlugin, LanguageCode } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { BetterMetricsService } from './services/metrics.service';
import gql from 'graphql-tag';
import { AdminUIController } from './controllers/admin-ui-controller';

@DeenruvPlugin({
    compatibility: '0.0.1',
    imports: [PluginCommonModule],
    controllers: [AdminUIController],
    providers: [BetterMetricsService],
    configuration: config => {
        config.customFields.Order.push(
            {
                name: 'attributes',
                type: 'text',
                label: [
                    { languageCode: LanguageCode.en, value: 'Attributes' },
                    { languageCode: LanguageCode.pl, value: 'Atrybuty' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Here you can specify order attributes' },
                    { languageCode: LanguageCode.pl, value: 'Tutaj możesz opisać różne atrybuty zamówienia' },
                ],
                defaultValue: '',
                nullable: true,
            },
            {
                name: 'additionalInfo',
                type: 'string',
                label: [
                    { languageCode: LanguageCode.en, value: 'Additional info' },
                    { languageCode: LanguageCode.pl, value: 'Dodatkowe informacje' },
                ],
                defaultValue: '',
                nullable: true,
            },
        );

        return config;
    },
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
