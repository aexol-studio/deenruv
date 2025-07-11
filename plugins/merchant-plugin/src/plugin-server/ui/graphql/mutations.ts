import { $, Selector } from "../zeus/index.js";
import { typedGql } from "../zeus/typedDocumentNode.js";
import { scalars } from "./scalars.js";

const mutation = typedGql("mutation", { scalars });

export const merchantPlatformSettingsSelector = Selector(
  "MerchantPlatformSettingsEntity",
)({
  platform: true,
  entries: { key: true, value: true },
});

const saveMerchantPlatformSettings = mutation({
  saveMerchantPlatformSettings: [
    { input: $("input", "SaveMerchantPlatformSettingInput!") },
    merchantPlatformSettingsSelector,
  ],
});

export const MUTATIONS = {
  saveMerchantPlatformSettings,
};
