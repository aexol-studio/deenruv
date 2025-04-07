import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const RoleListSelector = Selector("Role")({
  id: true,
  description: true,
  permissions: true,
  channels: {
    code: true,
  },
  code: true,
  createdAt: true,
  updatedAt: true,
});

export type RoleListType = FromSelectorWithScalars<
  typeof RoleListSelector,
  "Role"
>;
