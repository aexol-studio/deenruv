import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const CustomerSearchSelector = Selector("Customer")({
  firstName: true,
  lastName: true,
  id: true,
  emailAddress: true,
  phoneNumber: true,
});

export type CustomerSearchType = FromSelectorWithScalars<
  typeof CustomerSearchSelector,
  "Customer"
>;
