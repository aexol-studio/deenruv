import { Permission } from '@deenruv/admin-types';
import type { AdminAccessRequirement } from '@deenruv/react-ui-devkit';

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

export const canAccessAdminItem = ({
  item,
  userPermissions,
}: {
  item?: AdminAccessRequirement;
  userPermissions: Permission[];
}) => hasRequiredPermissions({ ...item, userPermissions });
