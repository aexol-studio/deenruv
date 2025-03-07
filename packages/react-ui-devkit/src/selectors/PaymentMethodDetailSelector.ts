import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const PaymentMethodDetailsSelector = Selector('PaymentMethod')({
    id: true,
    name: true,
    enabled: true,
    code: true,
    handler: {
        code: true,
        args: {
            name: true,
            value: true,
        },
    },
    checker: {
        code: true,
        args: {
            name: true,
            value: true,
        },
    },
    createdAt: true,
    updatedAt: true,
    translations: {
        name: true,
        languageCode: true,
        description: true,
    },
});

export type PaymentMethodDetailsType = FromSelectorWithScalars<
    typeof PaymentMethodDetailsSelector,
    'PaymentMethod'
>;
