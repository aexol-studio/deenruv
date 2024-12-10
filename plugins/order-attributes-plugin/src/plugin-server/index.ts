import { PluginCommonModule, DeenruvPlugin, Asset, LanguageCode } from '@deenruv/core';

const FacetCustomFields = [
    {
        name: 'usedForProductCreations',
        type: 'boolean' as const,
        public: true
    },
];

const FacetValueCustomFields = [
    {
        name: 'hexColor',
        type: 'string' as const,
        public: true
    },
    {
        name: 'image',
        type: 'relation' as const,
        entity: Asset,
        public: true,
    },
];

const OrderLineCustomFields = [
    {
        name: 'attributes',
        type: 'string' as const, // parsed object, eg. '{"kolor-blatkorpus":"lilly","kolor-stelaza-nogi":"vee-white-metalowy"}'
        public: true,
        label: [
            { languageCode: LanguageCode.en, value: 'Attributes' },
            { languageCode: LanguageCode.pl, value: 'Attrybuty' },
        ],
        ui: { component: 'attributes-input', fullWidth: true },
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
        name: 'discountBy',
        type: 'string' as const,
        public: true,
        label: [
            { languageCode: LanguageCode.en, value: 'Discount by' },
            { languageCode: LanguageCode.pl, value: 'Obniżka o' },
        ],
    },
    {
        name: 'selectedImage',
        type: 'relation' as const,
        entity: Asset,
        public: true,
        label: [
            { languageCode: LanguageCode.en, value: 'Image' },
            { languageCode: LanguageCode.pl, value: 'Obrazek' },
        ],
    },
];

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.OrderLine.push(...OrderLineCustomFields);
        config.customFields.FacetValue.push(...FacetValueCustomFields);
        config.customFields.Facet.push(...FacetCustomFields);

        return config;
    },
})
export class OrderLineAttributesServerPlugin {}
