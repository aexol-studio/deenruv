import { Permission } from "@deenruv/admin-types";

export type PermissionMatchMode = "any" | "all";

export type AdminAccessRequirement = {
  requiredPermissions?: Permission[];
  permissionMatch?: PermissionMatchMode;
};
