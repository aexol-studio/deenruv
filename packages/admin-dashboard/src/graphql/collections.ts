import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@deenruv/admin-types';

export const CollectionListSelector = Selector('Collection')({
  id: true,
  createdAt: true,
  updatedAt: true,
  position: true,
  name: true,
  breadcrumbs: { name: true, slug: true },
  slug: true,
  description: true,
  isPrivate: true,
  featuredAsset: {
    preview: true,
  },
  children: { id: true },
  productVariants: [{}, { totalItems: true }],
});

export const CollectionProductVariantsSelector = Selector('ProductVariant')({
  featuredAsset: { preview: true },
  id: true,
  name: true,
  // productId: true,
  product: { name: true, id: true },
  sku: true,
  stockAllocated: true,
});

export type CollectionListType = FromSelectorWithScalars<typeof CollectionListSelector, 'Collection'>;
export type CollectionProductVariantsType = FromSelectorWithScalars<
  typeof CollectionProductVariantsSelector,
  'ProductVariant'
>;

export const CollectionTileProductVariantSelector = Selector('ProductVariant')({
  id: true,
  featuredAsset: { preview: true },
  priceWithTax: true,
  currencyCode: true,
  name: true,
  product: { name: true, slug: true, featuredAsset: { preview: true } },
});

export type CollectionTileProductVariantType = FromSelectorWithScalars<
  typeof CollectionTileProductVariantSelector,
  'ProductVariant'
>;

export const CollectionTileSelector = Selector('Collection')({
  name: true,
  id: true,
  slug: true,
  parentId: true,
  parent: { slug: true },
  description: true,
  featuredAsset: {
    preview: true,
  },
});

export type CollectionTileType = FromSelectorWithScalars<typeof CollectionTileSelector, 'Collection'>;

export const CollectionDetailsSelector = Selector('Collection')({
  id: true,
  translations: {
    description: true,
    name: true,
    slug: true,
    id: true,
    languageCode: true,
  },
  assets: {
    id: true,
  },
  filters: {
    code: true,
    args: {
      name: true,
      value: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  name: true,
  isPrivate: true,
  slug: true,
  description: true,
  inheritFilters: true,
  featuredAsset: {
    id: true,
    preview: true,
  },
  parent: { slug: true, name: true },
  children: {
    id: true,
    name: true,
    slug: true,
    featuredAsset: { preview: true },
  },
});

export type CollectionDetailsType = FromSelectorWithScalars<typeof CollectionDetailsSelector, 'Collection'>;
