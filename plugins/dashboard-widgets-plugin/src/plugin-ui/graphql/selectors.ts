import { FromSelectorWithScalars } from "@deenruv/admin-types";
import { Selector } from "../zeus";

export const SummaryOrdersSelector = Selector("Order")({
  total: true,
  totalWithTax: true,
  currencyCode: true,
});

export const LatestOrderSelector = Selector("Order")({
  totalWithTax: true,
  state: true,
  createdAt: true,
  code: true,
  id: true,
  currencyCode: true,
  // getRealization: {
  //   finalPlannedAt: true,
  // },
  payments: {
    method: true,
    id: true,
  },
});
export type LatestOrderListType = FromSelectorWithScalars<
  typeof LatestOrderSelector,
  "Order"
>;
