import { RoleDetailsSelector } from '@/selectors/RoleDetailSelector.js';
import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const AdminDetailSelector = Selector('Administrator')({
    id: true,
    createdAt: true,
    updatedAt: true,
    firstName: true,
    lastName: true,
    emailAddress: true,
    user: {
        roles: RoleDetailsSelector,
    },
});

export type AdminDetailsType = FromSelectorWithScalars<typeof AdminDetailSelector, 'Administrator'>;
