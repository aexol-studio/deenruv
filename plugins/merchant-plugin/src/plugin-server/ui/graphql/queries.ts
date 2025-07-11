import { typedGql } from "../zeus/typedDocumentNode.js";
import { scalars } from "./scalars.js";
import { merchantPlatformSettingsSelector } from "./mutations.js";
import { $ } from "../zeus/index.js";

const query = typedGql("query", { scalars });

export const QUERIES = {
  getMerchantPlatformSettings: query({
    getMerchantPlatformSettings: [
      { platform: $("platform", "String!") },
      merchantPlatformSettingsSelector,
    ],
  }),
  getMerchantPlatformInfo: query({
    getMerchantPlatformInfo: [
      { platform: $("platform", "String!") },
      { isValidConnection: true, productsCount: true },
    ],
  }),
};
