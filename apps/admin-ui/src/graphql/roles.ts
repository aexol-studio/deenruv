import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const RoleSelector = Selector('Role')({
  id: true,
  description: true,
  permissions: true,
  channels: {
    code: true,
  },
  code: true,
});

export type RoleType = FromSelectorWithScalars<typeof RoleSelector, 'Role'>;

export const RoleListSelector = Selector('Role')({
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

export type RoleListType = FromSelectorWithScalars<typeof RoleListSelector, 'Role'>;

export const RoleDetailsSelector = Selector('Role')({
  id: true,
  description: true,
  permissions: true,
  channels: {
    code: true,
    id: true,
  },
  code: true,
  createdAt: true,
  updatedAt: true,
});

export type RoleDetailsType = FromSelectorWithScalars<typeof RoleDetailsSelector, 'Role'>;
