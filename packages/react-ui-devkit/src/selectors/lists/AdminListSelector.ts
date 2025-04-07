import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const AdminListSelector = Selector("Administrator")({
  id: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  user: {
    roles: {
      description: true,
    },
  },
});

export type AdminListType = FromSelectorWithScalars<
  typeof AdminListSelector,
  "Administrator"
>;
