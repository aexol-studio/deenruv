import { Selector } from "../zeus/index.js";
import { FromSelectorWithScalars } from "./scalars.js";

export const ReviewListSelector = Selector("Review")({
  id: true,
  createdAt: true,
  updatedAt: true,
  responseCreatedAt: true,
  rating: true,
  state: true,
  product: { id: true, name: true },
  order: { id: true },
});

export const ReviewDetailSelector = Selector("Review")({
  id: true,
  state: true,
  createdAt: true,
  updatedAt: true,
  authorLocation: true,
  authorEmailAddress: true,
  authorName: true,
  body: true,
  rating: true,
  response: true,
  responseCreatedAt: true,
  assets: { url: true, key: true },
  translations: { id: true, body: true, languageCode: true },
  author: { id: true },
  order: {
    id: true,
    code: true,
    totalWithTax: true,
    totalQuantity: true,
    currencyCode: true,
  },
  productVariant: {
    id: true,
    name: true,
    product: { id: true, name: true, slug: true },
  },
});
export type ReviewDetail = FromSelectorWithScalars<
  typeof ReviewDetailSelector,
  "Review"
>;
