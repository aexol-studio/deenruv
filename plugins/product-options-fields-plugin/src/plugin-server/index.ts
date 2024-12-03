import { PluginCommonModule, DeenruvPlugin, LanguageCode, Asset } from '@deenruv/core';

const ProductOptionCustomFields = [
    {
        name: 'hexColor',
        type: 'string' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Color' },
            { languageCode: LanguageCode.pl, value: 'Kolor' },
        ],
        public: true,
        defaultValue: '---',
        nullable: true,
        ui: { component: 'color-picker-input' },
    },
    {
        name: 'isNew',
        type: 'boolean' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'New' },
            { languageCode: LanguageCode.pl, value: 'Nowy' },
        ],
        defaultValue: false,
        public: true,
    },
    {
        name: 'isHidden',
        type: 'boolean' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Hidden' },
            { languageCode: LanguageCode.pl, value: 'Ukryty' },
        ],
        defaultValue: false,
        public: true,
    },
    {
        name: 'image',
        type: 'relation' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Image' },
            { languageCode: LanguageCode.pl, value: 'Obraz' },
        ],
        entity: Asset,
        public: true,
    }
];

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.ProductOption.push(...ProductOptionCustomFields);

        return config;
    },
})
export class ProductOptionServerPlugin {}
