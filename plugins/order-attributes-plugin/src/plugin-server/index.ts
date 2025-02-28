import { PluginCommonModule, DeenruvPlugin, Asset, LanguageCode } from '@deenruv/core';

const OrderLineCustomFields = [
    {
        name: 'discountBy',
        type: 'int' as const,
        defaultValue: 0,
        label: [
            { languageCode: LanguageCode.en, value: 'Discount' },
            { languageCode: LanguageCode.pl, value: 'Znizka' },
        ],
        description: [
            { languageCode: LanguageCode.en, value: 'Discount amount' },
            { languageCode: LanguageCode.pl, value: 'Wartość Znizki' },
        ],
        nullable: true,
    },
    {
        name: 'modifiedListPrice',
        type: 'string' as const,
        public: true,
        label: [
            { languageCode: LanguageCode.en, value: 'Modified price' },
            { languageCode: LanguageCode.pl, value: 'Zmodyfikowana cena' },
        ],
    },
    {
        name: 'attributes',
        type: 'text' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Attributes' },
            { languageCode: LanguageCode.pl, value: 'Atrybuty' },
        ],
        description: [
            { languageCode: LanguageCode.en, value: 'Attributes' },
            { languageCode: LanguageCode.pl, value: 'Atrybuty' },
        ],
        nullable: true,
        ui: { component: 'attributes-input' },
    },
    {
        name: 'selectedImage',
        type: 'relation' as const,
        entity: Asset,
        nullable: true,
        ui: { component: 'selected-image-input' },
        label: [
            { languageCode: LanguageCode.en, value: 'Selected image' },
            { languageCode: LanguageCode.pl, value: 'Wybrany obrazek' },
        ],
        description: [
            { languageCode: LanguageCode.en, value: 'Selected image' },
            { languageCode: LanguageCode.pl, value: 'Wybrany obrazek' },
        ],
    },
];

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.OrderLine.push(...OrderLineCustomFields);

        return config;
    },
})
export class OrderLineAttributesServerPlugin {}
