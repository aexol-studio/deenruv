import { Permission } from "@deenruv/admin-types";
import type { ActiveAdministratorType } from "@/selectors";

export type PermissionMatchMode = "any" | "all";

export type AdminAccessRequirement = {
  requiredPermissions?: Permission[];
  permissionMatch?: PermissionMatchMode;
};

export type PermissionRequirement =
  | Permission
  | Permission[]
  | AdminAccessRequirement;

export const matchesPermissions = (
  grantedPermissions: readonly Permission[],
  requirement: PermissionRequirement | undefined,
  defaultMatch: PermissionMatchMode = "any",
): boolean => {
  if (requirement === undefined) return true;

  const requiredPermissions = Array.isArray(requirement)
    ? requirement
    : typeof requirement === "string"
      ? [requirement]
      : (requirement.requiredPermissions ?? []);
  const permissionMatch =
    !Array.isArray(requirement) && typeof requirement !== "string"
      ? (requirement.permissionMatch ?? defaultMatch)
      : defaultMatch;

  if (requiredPermissions.length === 0) return true;
  return permissionMatch === "all"
    ? requiredPermissions.every((permission) =>
        grantedPermissions.includes(permission),
      )
    : requiredPermissions.some((permission) =>
        grantedPermissions.includes(permission),
      );
};

export const getSelectedChannelPermissions = (
  activeAdministrator: ActiveAdministratorType | undefined,
  selectedChannelId: string | undefined,
): Permission[] => {
  if (!activeAdministrator || !selectedChannelId) return [];

  return Array.from(
    new Set(
      activeAdministrator.user.roles
        .filter((role) =>
          role.channels.some((channel) => channel.id === selectedChannelId),
        )
        .flatMap((role) => role.permissions),
    ),
  );
};

export const hasDetailDropdownActions = ({
  canDelete,
  dropdownActionCount,
  hasEntity,
}: {
  canDelete: boolean;
  dropdownActionCount: number;
  hasEntity: boolean;
}): boolean => hasEntity && (canDelete || dropdownActionCount > 0);
