import { FromSelector, Selector, ZeusScalars } from "../zeus";

const scalars = ZeusScalars({
  ID: {
    decode: (value) => value as string,
  },
});

const FacetValueSelector = Selector("FacetValue")({
  id: true,
  name: true,
  code: true,
  customFields: {
    hexColor: true,
    image: { id: true, preview: true },
    isHidden: true,
    isNew: true,
  },
});

const FacetSelector = Selector("Facet")({
  id: true,
  name: true,
  code: true,
  customFields: {
    colorsCollection: true,
    usedForColors: true,
    usedForProductCreations: true,
  },
  values: FacetValueSelector,
});

export const FacetListOptionsSelector = Selector("FacetList")({
  items: FacetSelector,
  totalItems: true,
});

export type FacetValue = FromSelector<
  typeof FacetValueSelector,
  "FacetValue",
  typeof scalars
>;
export type Facet = FromSelector<typeof FacetSelector, "Facet", typeof scalars>;
