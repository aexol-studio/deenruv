import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const paymentSelector = Selector("Payment")({
  id: true,
  method: true,
  amount: true,
  state: true,
  errorMessage: true,
  createdAt: true,
  metadata: true,
  transactionId: true,
});

export type PaymentType = FromSelectorWithScalars<
  typeof paymentSelector,
  "Payment"
>;
