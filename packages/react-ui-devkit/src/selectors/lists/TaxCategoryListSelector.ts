import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const TaxCategoryListSelector = Selector("TaxCategory")({
  id: true,
  name: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
});

export type TaxCategoryListType = FromSelectorWithScalars<
  typeof TaxCategoryListSelector,
  "TaxCategory"
>;
