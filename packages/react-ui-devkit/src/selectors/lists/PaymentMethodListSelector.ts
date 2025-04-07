import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const PaymentMethodListSelector = Selector("PaymentMethod")({
  id: true,
  name: true,
  enabled: true,
  code: true,
  createdAt: true,
  updatedAt: true,
});

export type PaymentMethodListType = FromSelectorWithScalars<
  typeof PaymentMethodListSelector,
  "PaymentMethod"
>;
