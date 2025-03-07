import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

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
