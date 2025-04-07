import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const CollectionListSelector = Selector("Collection")({
  id: true,
  createdAt: true,
  updatedAt: true,
  position: true,
  name: true,
  breadcrumbs: { name: true, slug: true },
  slug: true,
  description: true,
  isPrivate: true,
  featuredAsset: { __typename: true, preview: true },
  productVariants: [{}, { totalItems: true }],
  parentId: true,
  children: {
    id: true,
    createdAt: true,
    updatedAt: true,
    position: true,
    name: true,
    slug: true,
    description: true,
    isPrivate: true,
    parentId: true,
    featuredAsset: { __typename: true, preview: true },
    productVariants: [{}, { totalItems: true }],
  },
});
export type CollectionListType = FromSelectorWithScalars<
  typeof CollectionListSelector,
  "Collection"
>;
