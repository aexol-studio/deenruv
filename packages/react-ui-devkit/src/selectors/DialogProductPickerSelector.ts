import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const DialogProductPickerSelector = Selector('SearchResult')({
    productId: true,
    productVariantId: true,
    sku: true,
    slug: true,
    description: true,
    currencyCode: true,
    enabled: true,
    productName: true,
    productVariantName: true,
    channelIds: true,
    collectionIds: true,
    facetIds: true,
    facetValueIds: true,
    price: {
        __typename: true,
        '...on SinglePrice': { value: true },
        '...on PriceRange': { min: true, max: true },
    },
    priceWithTax: {
        __typename: true,
        '...on SinglePrice': { value: true },
        '...on PriceRange': { min: true, max: true },
    },
    productAsset: { id: true, preview: true },
    productVariantAsset: { id: true, preview: true },
});

export type DialogProductPickerType = FromSelectorWithScalars<
    typeof DialogProductPickerSelector,
    'SearchResult'
>;
