import { FromSelector, GraphQLTypes, Selector, ZeusScalars } from "./index.js";

export const scalars = ZeusScalars({
  Money: {
    decode: (e) => e as number,
  },
  JSON: {
    encode: (e: unknown) => JSON.stringify(JSON.stringify(e)),
    decode: (e: unknown) => JSON.parse(e as string),
  },
  DateTime: {
    decode: (e: unknown) => new Date(e as string).toISOString(),
    encode: (e: unknown) => (e as Date).toISOString(),
  },
});

export type ScalarsType = typeof scalars;
export type FromSelectorWithScalars<
  SELECTOR,
  NAME extends keyof GraphQLTypes,
> = FromSelector<SELECTOR, NAME, ScalarsType>;

export const ProductSearchSelector = Selector("SearchResult")({
  productName: true,
  slug: true,
  collectionIds: true,
  currencyCode: true,
  productVariantId: true,
  productVariantName: true,
  productId: true,
  price: {
    "...on PriceRange": {
      max: true,
      min: true,
    },
    "...on SinglePrice": {
      value: true,
    },
  },
  priceWithTax: {
    "...on PriceRange": {
      max: true,
      min: true,
    },
    "...on SinglePrice": {
      value: true,
    },
  },
  facetIds: true,
  facetValueIds: true,
  productAsset: { preview: true,
  },
  inStock: true,
  description: true,
  sku: true,
  score: true,
});

export type ProductSearchType = FromSelectorWithScalars<
  typeof ProductSearchSelector,
  "SearchResult"
>;
