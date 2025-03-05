import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const TaxRateDetailsSelector = Selector('TaxRate')({
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    category: {
        name: true,
        id: true,
    },
    enabled: true,
    zone: {
        name: true,
        id: true,
    },
    value: true,
    customerGroup: {
        name: true,
        id: true,
    },
});

export type TaxRateDetailsType = FromSelectorWithScalars<typeof TaxRateDetailsSelector, 'TaxRate'>;
