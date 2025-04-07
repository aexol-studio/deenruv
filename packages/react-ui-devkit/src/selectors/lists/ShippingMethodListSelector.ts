import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ShippingMethodListSelector = Selector("ShippingMethod")({
  id: true,
  name: true,
  code: true,
  createdAt: true,
  updatedAt: true,
});

export type ShippingMethodListType = FromSelectorWithScalars<
  typeof ShippingMethodListSelector,
  "ShippingMethod"
>;
