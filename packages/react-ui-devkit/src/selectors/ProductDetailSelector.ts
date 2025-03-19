import { Selector } from '@deenruv/admin-types';
import type { FromSelectorWithScalars } from '@deenruv/admin-types';

export const ProductDetailsFacetSelector = Selector('FacetValue')({
    name: true,
    id: true,
    translations: { name: true, languageCode: true, id: true },
    facet: {
        name: true,
        id: true,
        translations: { name: true, languageCode: true, id: true },
    },
});

export type ProductDetailsFacetType = FromSelectorWithScalars<
    typeof ProductDetailsFacetSelector,
    'FacetValue'
>;

export const ProductDetailSelector = Selector('Product')({
    name: true,
    description: true,
    id: true,
    slug: true,
    enabled: true,
    createdAt: true,
    updatedAt: true,
    channels: { id: true, code: true },
    translations: {
        id: true,
        languageCode: true,
        name: true,
        slug: true,
        description: true,
    },
    assets: { source: true, preview: true, id: true },
    collections: { slug: true, name: true, parent: { slug: true } },
    featuredAsset: { source: true, preview: true, id: true },
    optionGroups: { id: true, name: true, code: true },
    facetValues: ProductDetailsFacetSelector,
});

export type ProductDetailType = FromSelectorWithScalars<typeof ProductDetailSelector, 'Product'>;
