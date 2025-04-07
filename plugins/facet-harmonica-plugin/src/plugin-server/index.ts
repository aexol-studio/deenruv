import {
  PluginCommonModule,
  DeenruvPlugin,
  LanguageCode,
  Asset,
} from "@deenruv/core";

const FacetCustomFields = [
  {
    name: "usedForColors",
    type: "boolean" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Used for colors" },
      { languageCode: LanguageCode.pl, value: "Używany dla kolorów" },
    ],
    description: [
      {
        languageCode: LanguageCode.en,
        value: "Use this attribute for guys that are colours",
      },
      {
        languageCode: LanguageCode.pl,
        value: "Użyj tego atrybutu dla facetów, którzy mają kolory",
      },
    ],
    defaultValue: false,
    public: true,
  },
  {
    name: "usedForProductCreations",
    type: "boolean" as const,
    ui: { component: "product-creations-input" },
    defaultValue: false,
    label: [
      { languageCode: LanguageCode.en, value: "Used for product creations" },
      { languageCode: LanguageCode.pl, value: "Używany przy kreacji" },
    ],
    description: [
      { languageCode: LanguageCode.en, value: "" },
      { languageCode: LanguageCode.pl, value: "" },
    ],
  },
  {
    name: "colorsCollection",
    type: "boolean" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Color collection" },
      { languageCode: LanguageCode.pl, value: "Kolekcja kolorów" },
    ],
    description: [
      {
        languageCode: LanguageCode.en,
        value: "Use this for the product paths in COLOUR (BLATH/CORPUS)",
      },
      {
        languageCode: LanguageCode.pl,
        value: "Użyj tej opcji dla ścieżek produktu w KOLORZE (BLAT/CORPUS)",
      },
    ],
    defaultValue: false,
    public: true,
  },
];

const FacetValueCustomFields = [
  {
    name: "hexColor",
    type: "string" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Color" },
      { languageCode: LanguageCode.pl, value: "Kolor" },
    ],
    public: true,
    defaultValue: "---",
    nullable: true,
    ui: { component: "color-picker-input" },
  },
  {
    name: "isNew",
    type: "boolean" as const,
    label: [
      { languageCode: LanguageCode.en, value: "New" },
      { languageCode: LanguageCode.pl, value: "Nowy" },
    ],
    defaultValue: false,
    public: true,
  },
  {
    name: "isHidden",
    type: "boolean" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Hidden" },
      { languageCode: LanguageCode.pl, value: "Ukryty" },
    ],
    defaultValue: false,
    public: true,
  },
  {
    name: "image",
    type: "relation" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Image" },
      { languageCode: LanguageCode.pl, value: "Obraz" },
    ],
    entity: Asset,
    public: true,
  },
];

@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Facet.push(...FacetCustomFields);
    config.customFields.FacetValue.push(...FacetValueCustomFields);
    return config;
  },
})
export class FacetHarmonicaServerPlugin {
  static config: {};

  static init(config: {}) {
    this.config = config;
    return this;
  }
}
