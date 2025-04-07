import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";
import { RoleDetailsSelector } from "./RoleDetailSelector.js";

export const AdminDetailSelector = Selector("Administrator")({
  id: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  user: { roles: RoleDetailsSelector },
});

export type AdminDetailsType = FromSelectorWithScalars<
  typeof AdminDetailSelector,
  "Administrator"
>;
