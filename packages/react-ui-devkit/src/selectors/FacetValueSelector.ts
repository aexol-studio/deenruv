import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const FacetValueSelector = Selector("FacetValue")({
  id: true,
  name: true,
  updatedAt: true,
  createdAt: true,
  code: true,
  translations: { name: true },
});
export type FacetValueType = FromSelectorWithScalars<
  typeof FacetValueSelector,
  "FacetValue"
>;
