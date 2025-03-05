import { Permission } from '@deenruv/admin-types';

export const getPermissions = (type: string) => ({
  create: Permission[`Create${type}` as keyof typeof Permission],
  edit: Permission[`Update${type}` as keyof typeof Permission],
  delete: Permission[`Delete${type}` as keyof typeof Permission],
});
