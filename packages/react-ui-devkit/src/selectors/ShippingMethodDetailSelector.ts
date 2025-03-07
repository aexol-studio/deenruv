import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const ShippingMethodDetailsSelector = Selector('ShippingMethod')({
    id: true,
    name: true,
    code: true,
    description: true,
    checker: {
        code: true,
        args: {
            name: true,
            value: true,
        },
    },
    calculator: {
        args: {
            name: true,
            value: true,
        },
        code: true,
    },
    fulfillmentHandlerCode: true,
    createdAt: true,
    updatedAt: true,
    translations: {
        name: true,
        description: true,
        languageCode: true,
    },
});

export type ShippingMethodDetailsType = FromSelectorWithScalars<
    typeof ShippingMethodDetailsSelector,
    'ShippingMethod'
>;
