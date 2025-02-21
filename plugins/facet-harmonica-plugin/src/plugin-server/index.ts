import { PluginCommonModule, DeenruvPlugin, LanguageCode, Asset, OrderProcess } from '@deenruv/core';
import { StorageService } from './services/storage.service.js';
import { PDFService } from './services/pdf.service.js';
import { OrderRegisterService } from './services/order-register.service.js';
import { FacetHarmonicaPluginOptions, PLUGIN_INIT_OPTIONS } from './consts.js';
import { OrderRealizationEntity } from './entities/order-realization.entity.js';
import { ProFormaEntity } from './entities/pro-forma.entity.js';
import { AdminExtension, ShopExtension } from './extensions/pdf.extension.js';
import { ShopOrderResolver } from './api/shop-order.resolver.js';
import { AdminResolver } from './api/admin.resolver.js';
import { AdminOrderResolver } from './api/admin-order.resolver.js';

const FacetCustomFields = [
    {
        name: 'usedForColors',
        type: 'boolean' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Used for colors' },
            { languageCode: LanguageCode.pl, value: 'Używany dla kolorów' },
        ],
        description: [
            { languageCode: LanguageCode.en, value: 'Use this attribute for guys that are colours' },
            { languageCode: LanguageCode.pl, value: 'Użyj tego atrybutu dla facetów, którzy mają kolory' },
        ],
        defaultValue: false,
        public: true,
    },
    {
        name: 'colorsCollection',
        type: 'boolean' as const,
        label: [
            { languageCode: LanguageCode.en, value: 'Color collection' },
            { languageCode: LanguageCode.pl, value: 'Kolekcja kolorów' },
        ],
        description: [
            {
                languageCode: LanguageCode.en,
                value: 'Use this for the product paths in COLOUR (BLATH/CORPUS)',
            },
            {
                languageCode: LanguageCode.pl,
                value: 'Użyj tej opcji dla ścieżek produktu w KOLORZE (BLAT/CORPUS)',
            },
        ],
        defaultValue: false,
        public: true,
    },
];

const FacetValueCustomFields = [
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
    },
];

const OrderLineCustomFields = [
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

const inRealizationProcess: OrderProcess<'InRealization'> = {
    transitions: {
        PaymentSettled: {
            to: ['InRealization', 'Cancelled', 'Modifying', 'ArrangingAdditionalPayment'],
            mergeStrategy: 'replace',
        },
        InRealization: {
            to: [
                'PartiallyDelivered',
                'Delivered',
                'PartiallyShipped',
                'Shipped',
                'Cancelled',
                'Modifying',
                'ArrangingAdditionalPayment',
            ],
        },
    },
    onTransitionStart: async (from, to, { ctx, order }) => {},
};

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    providers: [
        OrderRegisterService,
        PDFService,
        StorageService,
        {
            provide: PLUGIN_INIT_OPTIONS,
            useFactory: () => FacetHarmonicaServerPlugin.config,
        },
    ],
    entities: [OrderRealizationEntity, ProFormaEntity],
    shopApiExtensions: {
        schema: ShopExtension,
        resolvers: [ShopOrderResolver],
    },
    adminApiExtensions: {
        schema: AdminExtension,
        resolvers: [AdminResolver, AdminOrderResolver],
    },
    configuration: config => {
        config.orderOptions.process.push(inRealizationProcess);
        config.customFields.Facet.push(...FacetCustomFields);
        config.customFields.FacetValue.push(...FacetValueCustomFields);
        config.customFields.OrderLine.push(...OrderLineCustomFields);
        return config;
    },
})
export class FacetHarmonicaServerPlugin {
    static config: FacetHarmonicaPluginOptions;

    static init(config: FacetHarmonicaPluginOptions) {
        this.config = config;
        return this;
    }
}
