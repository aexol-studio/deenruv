import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const TaxRateListSelector = Selector("TaxRate")({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  category: { name: true },
  enabled: true,
  zone: { name: true },
  value: true,
  customerGroup: { name: true },
});

export type TaxRateListType = FromSelectorWithScalars<
  typeof TaxRateListSelector,
  "TaxRate"
>;
