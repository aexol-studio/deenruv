import { Selector } from "@deenruv/admin-types";
import type { FromSelectorWithScalars } from "@deenruv/admin-types";

export const TaxCategoryDetailSelector = Selector("TaxCategory")({
  name: true,
  id: true,
  createdAt: true,
  updatedAt: true,
  isDefault: true,
});

export type TaxCategoryDetailType = FromSelectorWithScalars<
  typeof TaxCategoryDetailSelector,
  "TaxCategory"
>;
