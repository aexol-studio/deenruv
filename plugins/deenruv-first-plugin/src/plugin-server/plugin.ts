import {
    PluginCommonModule,
    DeenruvPlugin,
    LanguageCode,
    Asset,
    Product,
    ProductVariant,
} from '@deenruv/core';
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

        // primivite fields
        config.customFields.Product.push({
            name: 'boolTest',
            type: 'boolean',
            label: [{ languageCode: LanguageCode.en, value: 'boolean Test' }],
        });
        config.customFields.Product.push({
            name: 'floatTest',
            type: 'float',
            label: [{ languageCode: LanguageCode.en, value: 'float Test' }],
        });
        config.customFields.Product.push({
            name: 'intTest',
            type: 'int',
            label: [{ languageCode: LanguageCode.en, value: 'int Test' }],
        });
        config.customFields.Product.push({
            name: 'stringTest',
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'string Test' }],
        });
        config.customFields.Product.push({
            name: 'textTest',
            type: 'text',
            label: [{ languageCode: LanguageCode.en, value: 'text Test' }],
        });
        config.customFields.Product.push({
            name: 'dateTime',
            type: 'datetime',
            label: [{ languageCode: LanguageCode.en, value: 'dateTime Test' }],
        });
        // primivite fields

        // primivite LIST fields
        config.customFields.Product.push({
            name: 'listTestString',
            type: 'string',
            list: true,
            label: [
                { languageCode: LanguageCode.en, value: 'String list test' },
                { languageCode: LanguageCode.pl, value: 'test listy String' },
            ],
        });
        config.customFields.Product.push({
            name: 'listTestInt',
            type: 'int',
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'int list test' }],
        });
        config.customFields.Product.push({
            name: 'listTestFloat',
            type: 'float',
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'float list test' }],
        });
        config.customFields.Product.push({
            name: 'listTestText',
            type: 'text',
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'Text list test' }],
        });
        config.customFields.Product.push({
            name: 'listLocaleString',
            list: true,
            type: 'localeString',
            label: [{ languageCode: LanguageCode.en, value: 'listLocaleString Test' }],
        });
        config.customFields.Product.push({
            name: 'listLocaleText',
            list: true,
            type: 'localeText',
            label: [{ languageCode: LanguageCode.en, value: 'listLocaleText Test' }],
        });
        // primivite LIST fields

        // relation fields
        config.customFields.Product.push({
            name: 'singleAssetTest',
            type: 'relation',
            graphQLType: 'Asset',
            entity: Asset,
            public: true,
            nullable: true,
            eager: true,
            label: [{ languageCode: LanguageCode.en, value: 'single asset Test' }],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Recommended size: 1200x630px',
                },
            ],
        });
        config.customFields.Product.push({
            name: 'listAssetTest',
            type: 'relation',
            graphQLType: 'Asset',
            entity: Asset,
            public: true,
            nullable: true,
            eager: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'list asset Test' }],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Recommended size: 1200x630px',
                },
            ],
        });
        config.customFields.Order.push({
            name: 'singleProductTest',
            type: 'relation',
            graphQLType: 'Product',
            entity: Product,
            public: true,
            nullable: true,
            eager: true,
            label: [{ languageCode: LanguageCode.en, value: 'single product test' }],
        });

        // config.customFields.Order.push({
        //     name: 'singleProductVariantTest',
        //     type: 'relation',
        //     graphQLType: 'ProductVariant',
        //     entity: ProductVariant,
        //     public: true,
        //     nullable: true,
        //     eager: true,
        //     label: [{ languageCode: LanguageCode.en, value: 'single product variant test' }],
        // });

        // relation fields

        config.customFields.Asset.push(
            {
                name: 'attributes',
                type: 'text',
                label: [
                    { languageCode: LanguageCode.en, value: 'Attributes' },
                    { languageCode: LanguageCode.pl, value: 'Atrybuty' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Here you can specify order attributes' },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Tutaj możesz opisać różne atrybuty zamówienia',
                    },
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
