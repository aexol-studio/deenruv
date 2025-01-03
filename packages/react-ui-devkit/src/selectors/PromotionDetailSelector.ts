import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const PromotionDetailSelector = Selector('Promotion')({
    id: true,
    name: true,
    updatedAt: true,
    enabled: true,
    createdAt: true,
    actions: {
        args: {
            name: true,
            value: true,
        },
        code: true
    },
    conditions: {
        args: {
            name: true,
            value: true,
        },
        code: true,
    },
    couponCode: true,
    description: true,
    endsAt: true,
    perCustomerUsageLimit: true,
    startsAt: true,
    translations: {
        description: true,
        languageCode: true,
        name: true
    },
    usageLimit: true
});
export type PromotionDetailType = FromSelectorWithScalars<typeof PromotionDetailSelector, 'Promotion'>;
