import { Permission } from "@deenruv/admin-types";

export type PermissionMatchMode = "any" | "all";

export type AdminAccessSurface =
  | "globalSearch"
  | "notifications"
  | "systemStatus"
  | "extensionsPage"
  | "channelSwitcher"
  | "languageSwitcher"
  | "reindexAction";

export type AdminAccessRequirement = {
  requiredPermissions?: Permission[];
  permissionMatch?: PermissionMatchMode;
  accessProfileIds?: string[];
};

export type AdminAccessProfile = {
  id: string;
  mode?: "full" | "restricted";
  allowedRouteIds?: string[];
  deniedRouteIds?: string[];
  defaultRouteId?: string;
  plugins?: {
    enabledIds?: string[];
    disabledIds?: string[];
  };
  surfaces?: Partial<Record<AdminAccessSurface, boolean | "auto">>;
};
