import { Selector } from '@deenruv/admin-types';
import type { FromSelectorWithScalars } from '@deenruv/admin-types';

const AddressSelector = Selector('Address')({
    id: true,
    fullName: true,
    phoneNumber: true,
    postalCode: true,
    province: true,
    streetLine1: true,
    streetLine2: true,
    city: true,
    company: true,
    country: {
        code: true,
    },
    defaultBillingAddress: true,
    defaultShippingAddress: true,
});

export const HistorySelector = Selector('HistoryEntryList')({
    items: {
        administrator: {
            id: true,
            firstName: true,
            lastName: true,
        },
        createdAt: true,
        id: true,
        isPublic: true,
        type: true,
        updatedAt: true,
        data: true,
    },
    totalItems: true,
});

export const CustomerDetailOrderSelector = Selector('Order')({
    type: true,
    totalWithTax: true,
    state: true,
    active: true,
    currencyCode: true,
    createdAt: true,
    updatedAt: true,
    shipping: true,
    totalQuantity: true,
    code: true,
    id: true,
});

export const CustomerDetailSelector = Selector('Customer')({
    addresses: AddressSelector,
    createdAt: true,
    emailAddress: true,
    firstName: true,
    groups: {
        id: true,
        name: true,
    },
    id: true,
    lastName: true,
    phoneNumber: true,
    title: true,
    updatedAt: true,
    user: {
        verified: true,
    },
});

export type CustomerAddressType = FromSelectorWithScalars<typeof AddressSelector, 'Address'>;
export type CustomerDetailType = FromSelectorWithScalars<typeof CustomerDetailSelector, 'Customer'>;
