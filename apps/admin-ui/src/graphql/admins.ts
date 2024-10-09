import { RoleSelector } from '@/graphql/roles';
import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const AdminListSelector = Selector('Administrator')({
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

export type AdminListType = FromSelectorWithScalars<typeof AdminListSelector, 'Administrator'>;

export const AdminDetailsSelector = Selector('Administrator')({
  id: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  emailAddress: true,
  user: {
    roles: RoleSelector,
  },
});

export type AdminDetailsType = FromSelectorWithScalars<typeof AdminDetailsSelector, 'Administrator'>;
