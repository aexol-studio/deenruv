import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

const FacetValueSelector = Selector("FacetValue")({
  name: true,
  code: true,
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const FacetDetailSelector = Selector("Facet")({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
  isPrivate: true,
  languageCode: true,
  name: true,
  translations: {
    name: true,
    languageCode: true,
  },
  values: FacetValueSelector,
});
export type FacetDetailType = FromSelectorWithScalars<
  typeof FacetDetailSelector,
  "Facet"
>;
