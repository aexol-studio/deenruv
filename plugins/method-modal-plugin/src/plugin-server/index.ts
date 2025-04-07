import { PluginCommonModule, DeenruvPlugin, LanguageCode } from "@deenruv/core";

const MethodModalFields = [
  {
    name: "modalTitle",
    type: "localeString" as const,
    label: [{ languageCode: LanguageCode.en, value: "Modal title" }],
    public: true,
  },
  {
    name: "modalDescription",
    type: "localeText" as const,
    label: [{ languageCode: LanguageCode.en, value: "Modal description" }],
    ui: { richText: true, fullWidth: true },
    public: true,
  },
  {
    name: "modalAdditionalDescription",
    type: "localeText" as const,
    label: [
      { languageCode: LanguageCode.en, value: "Modal additional description" },
    ],
    ui: { richText: true, fullWidth: true },
    public: true,
  },
];

@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.PaymentMethod.push(...MethodModalFields);
    config.customFields.ShippingMethod.push(...MethodModalFields);

    return config;
  },
})
export class MethodModalServerPlugin {}
