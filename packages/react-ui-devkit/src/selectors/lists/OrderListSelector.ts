import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const OrderListSelector = Selector("Order")({
  type: true,
  totalWithTax: true,
  state: true,
  active: true,
  currencyCode: true,
  createdAt: true,
  updatedAt: true,
  shipping: true,
  totalQuantity: true,
  orderPlacedAt: true,
  code: true,
  id: true,
  payments: {
    method: true,
    createdAt: true,
    state: true,
  },
  shippingAddress: {
    fullName: true,
  },
  customer: {
    id: true,
    emailAddress: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
  },
});
export type OrderListType = FromSelectorWithScalars<
  typeof OrderListSelector,
  "Order"
>;
