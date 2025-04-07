import {
  PluginCommonModule,
  DeenruvPlugin,
  LanguageCode,
  Asset,
} from "@deenruv/core";

const SeoCustomFields = [
  {
    name: "seoTitle",
    type: "localeString" as const,
    label: [{ languageCode: LanguageCode.en, value: "SEO Title" }],
    ui: { tab: "SEO" },
    public: true,
  },
  {
    name: "seoDescription",
    type: "localeString" as const,
    label: [{ languageCode: LanguageCode.en, value: "SEO Description" }],
    ui: { tab: "SEO" },
    public: true,
  },
  {
    name: "facebookImage",
    type: "relation" as const,
    graphQLType: "Asset",
    entity: Asset,
    label: [{ languageCode: LanguageCode.en, value: "Facebook SEO image" }],
    ui: { tab: "SEO" },
    eager: true,
    public: true,
  },
  {
    name: "twitterImage",
    type: "relation" as const,
    graphQLType: "Asset",
    entity: Asset,
    label: [{ languageCode: LanguageCode.en, value: "Twitter SEO image" }],
    ui: { tab: "SEO" },
    eager: true,
    public: true,
  },
];

@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push(...SeoCustomFields);
    config.customFields.Collection.push(...SeoCustomFields);

    return config;
  },
})
export class SeoPlugin {}
