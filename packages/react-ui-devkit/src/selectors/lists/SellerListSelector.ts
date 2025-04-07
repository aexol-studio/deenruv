import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const SellerListSelector = Selector("Seller")({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type SellerListType = FromSelectorWithScalars<
  typeof SellerListSelector,
  "Seller"
>;
