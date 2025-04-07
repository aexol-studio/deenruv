import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const SellerDetailSelector = Selector("Seller")({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type SellerDetailType = FromSelectorWithScalars<
  typeof SellerDetailSelector,
  "Seller"
>;
