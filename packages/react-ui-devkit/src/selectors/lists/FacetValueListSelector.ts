import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const FacetValueListSelector = Selector("Facet")({
  id: true,
  name: true,
  code: true,
});
export type FacetValueListType = FromSelectorWithScalars<
  typeof FacetValueListSelector,
  "Facet"
>;
