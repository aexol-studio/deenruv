import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";
import { merchantPlatformSettingsSelector } from "./mutations";
import { $ } from "../zeus/index";

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
