import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const CustomerListSelector = Selector("Customer")({
  id: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  emailAddress: true,
  phoneNumber: true,
  user: {
    id: true,
    verified: true,
  },
});
export type CustomerListType = FromSelectorWithScalars<
  typeof CustomerListSelector,
  "Customer"
>;
