import { $, Selector } from "../zeus/index";
import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";

const mutation = typedGql("mutation", { scalars });

export const merchantPlatformSettingsSelector = Selector(
  "MerchantPlatformSettingsEntity",
)({
  platform: true,
  entries: { key: true, value: true },
});

export const saveMerchantPlatformSettings = mutation({
  saveMerchantPlatformSettings: [
    { input: $("input", "SaveMerchantPlatformSettingInput!") },
    merchantPlatformSettingsSelector,
  ],
});

export const removeOrphanItems = mutation({
  removeOrphanItems: [{ platform: $("platform", "String!") }, true],
});
