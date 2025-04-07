import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ProductListSelector = Selector("Product")({
  id: true,
  name: true,
  slug: true,
  updatedAt: true,
  enabled: true,
  createdAt: true,
  collections: { __typename: true, name: true, slug: true },
  variantList: [
    {},
    { totalItems: true, items: { stockOnHand: true, stockAllocated: true } },
  ],
  featuredAsset: { __typename: true, preview: true },
});
export type ProductListType = FromSelectorWithScalars<
  typeof ProductListSelector,
  "Product"
>;
