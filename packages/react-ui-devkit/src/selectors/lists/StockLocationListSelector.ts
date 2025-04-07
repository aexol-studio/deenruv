import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const StockLocationListSelector = Selector("StockLocation")({
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
});

export type StockLocationListType = FromSelectorWithScalars<
  typeof StockLocationListSelector,
  "StockLocation"
>;
