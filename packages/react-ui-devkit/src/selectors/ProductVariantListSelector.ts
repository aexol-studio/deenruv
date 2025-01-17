import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const ProductVariantListSelector = Selector('ProductVariant')({
    id: true,
    name: true,
    updatedAt: true,
    enabled: true,
    createdAt: true,
    featuredAsset: { __typename: true, preview: true },
    sku: true,
    price: true,
    priceWithTax: true,
    stockOnHand: true,
    stockAllocated: true,
    productId: true
    // customFields: { discountBy: true }, // TODO: Add this field to the selector
});
export type ProductVariantListType = FromSelectorWithScalars<typeof ProductVariantListSelector, 'ProductVariant'>;
