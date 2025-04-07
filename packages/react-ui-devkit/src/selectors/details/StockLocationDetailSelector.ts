import { Selector } from "@deenruv/admin-types";
import type { FromSelectorWithScalars } from "@deenruv/admin-types";

export const StockLocationDetailSelector = Selector("StockLocation")({
  name: true,
  id: true,
  createdAt: true,
  updatedAt: true,
  description: true,
});

export type StockLocationDetailType = FromSelectorWithScalars<
  typeof StockLocationDetailSelector,
  "StockLocation"
>;
