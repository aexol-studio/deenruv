import {
    PluginCommonModule,
    DeenruvPlugin,
    LanguageCode,
    Asset,
    Product,
    ProductVariant,
} from '@deenruv/core';

@DeenruvPlugin({
    compatibility: '0.0.1',
    imports: [PluginCommonModule],
    controllers: [],
    providers: [],
    configuration: config => {
        // PRODUCT
        config.customFields.Product.push({
            name: 'discountBy',
            type: 'string',
            nullable: true,
            defaultValue: '',
            ui: { component: 'string-custom-field-input' },
            label: [
                { languageCode: LanguageCode.en, value: 'Discount by' },
                { languageCode: LanguageCode.pl, value: 'Obniż cenę o' },
            ],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'This field lets user define discount by given number.',
                },
                {
                    languageCode: LanguageCode.pl,
                    value: 'Te pole pozwala określić o ile taniej produkt ma kosztować.',
                },
            ],
        });
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
        config.customFields.Product.push({
            name: 'singleAssetTestP',
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
            name: 'listAssetTestP',
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

        // ORDER
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

        // COLLECTION
        config.customFields.Collection.push({
            name: 'stringTest',
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'string Test' }],
        });
        config.customFields.Collection.push({
            name: 'localestringTest',
            type: 'localeString',
            label: [{ languageCode: LanguageCode.en, value: 'localestring Test' }],
        });

        // FACET
        config.customFields.Facet.push({
            name: 'stringTest',
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'string Test' }],
        });
        config.customFields.Facet.push({
            name: 'localestringTest',
            type: 'localeString',
            label: [{ languageCode: LanguageCode.en, value: 'localestring Test' }],
        });

        config.customFields.Facet.push({
            name: 'ProductListTest',
            type: 'relation',
            graphQLType: 'Product',
            entity: Product,
            public: true,
            nullable: true,
            eager: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'list Product Test' }],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Recommended size: 1200x630px',
                },
            ],
        });
        config.customFields.Facet.push({
            name: 'listProductVariantTest',
            type: 'relation',
            graphQLType: 'ProductVariant',
            entity: ProductVariant,
            public: true,
            nullable: true,
            eager: true,
            list: true,
            label: [{ languageCode: LanguageCode.en, value: 'list product variant test' }],
        });

        //ORDER_LINE
        config.customFields.OrderLine.push({
            name: 'stringTest',
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'string Test' }],
        });
        config.customFields.OrderLine.push({
            name: 'textTest',
            type: 'text',
            label: [{ languageCode: LanguageCode.en, value: 'text Test' }],
        });

        //PRODUCT_VARIANT
        config.customFields.ProductVariant.push({
            name: 'stringTest',
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'string Test' }],
        });
        // ASSET
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
        // relation fields

        return config;
    },
})
export class DeenruvExamplesPlugin {}
