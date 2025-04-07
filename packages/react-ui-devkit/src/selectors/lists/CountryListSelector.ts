import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const CountryListSelector = Selector("Country")({
  createdAt: true,
  updatedAt: true,
  code: true,
  enabled: true,
  id: true,
  name: true,
});
export type CountryListType = FromSelectorWithScalars<
  typeof CountryListSelector,
  "Country"
>;
