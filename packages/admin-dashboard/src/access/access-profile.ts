import { Permission } from '@deenruv/admin-types';
import type { AdminAccessProfile, AdminAccessRequirement, AdminAccessSurface } from '@deenruv/react-ui-devkit';

export const FULL_ADMIN_ACCESS_PROFILE: AdminAccessProfile = {
  id: 'full-admin',
  mode: 'full',
  surfaces: {
    globalSearch: true,
    notifications: true,
    systemStatus: true,
    extensionsPage: true,
    channelSwitcher: true,
    languageSwitcher: true,
    reindexAction: true,
  },
};

export const normalizeAccessProfile = (profile?: AdminAccessProfile): AdminAccessProfile => ({
  ...FULL_ADMIN_ACCESS_PROFILE,
  ...profile,
  surfaces: {
    ...FULL_ADMIN_ACCESS_PROFILE.surfaces,
    ...profile?.surfaces,
  },
});

export const hasRequiredPermissions = ({
  requiredPermissions,
  permissionMatch = 'any',
  userPermissions,
}: AdminAccessRequirement & { userPermissions: Permission[] }) => {
  if (!requiredPermissions?.length) return true;
  if (permissionMatch === 'all') {
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

export const isRouteAllowedByProfile = (routeId: string, profile: AdminAccessProfile) => {
  if (profile.deniedRouteIds?.includes(routeId)) return false;
  if (profile.mode === 'restricted') return !!profile.allowedRouteIds?.includes(routeId);
  return true;
};

export const isItemAllowedByProfile = ({
  item,
  profile,
  routeId,
}: {
  item?: AdminAccessRequirement;
  profile: AdminAccessProfile;
  routeId?: string;
}) => {
  if (routeId && !isRouteAllowedByProfile(routeId, profile)) return false;
  if (!item?.accessProfileIds?.length) return true;
  return item.accessProfileIds.includes(profile.id);
};

export const canAccessAdminItem = ({
  item,
  profile,
  routeId,
  userPermissions,
}: {
  item?: AdminAccessRequirement;
  profile: AdminAccessProfile;
  routeId?: string;
  userPermissions: Permission[];
}) => {
  if (!isItemAllowedByProfile({ item, profile, routeId })) return false;
  return hasRequiredPermissions({
    requiredPermissions: item?.requiredPermissions,
    permissionMatch: item?.permissionMatch,
    userPermissions,
  });
};

export const isAccessSurfaceEnabled = (profile: AdminAccessProfile, surface: AdminAccessSurface) => {
  const value = profile.surfaces?.[surface];
  return value === undefined || value === 'auto' ? true : value;
};
