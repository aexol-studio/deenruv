import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const FacetListSelector = Selector("Facet")({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
  isPrivate: true,
  name: true,
  values: { id: true },
});
export type FacetListType = FromSelectorWithScalars<
  typeof FacetListSelector,
  "Facet"
>;
