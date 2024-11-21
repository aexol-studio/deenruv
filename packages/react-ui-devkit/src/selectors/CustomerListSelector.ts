import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const CustomerListSelector = Selector('Product')({
    id: true,
    name: true,
    slug: true,
    updatedAt: true,
    enabled: true,
    createdAt: true,
    collections: { __typename: true, name: true, slug: true },
    variantList: [{}, { totalItems: true }],
    featuredAsset: { __typename: true, preview: true },
    // customFields: { discountBy: true }, // TODO: Add this field to the selector
});
export type ProductListType = FromSelectorWithScalars<typeof CustomerListSelector, 'Product'>;
