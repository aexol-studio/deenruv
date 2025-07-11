import { typedGql } from "../zeus/typedDocumentNode.js";
import { ReviewDetailSelector, ReviewListSelector } from "./selectors.js";
import { $ } from "../zeus/index.js";
import { scalars } from "./scalars.js";

export const ListReviewQuery = typedGql("query", { scalars })({
  listReviews: [
    { options: $("options", "ReviewListOptions!") },
    { items: ReviewListSelector, totalItems: true },
  ],
});

export const GetReviewQuery = typedGql("query", { scalars })({
  getReview: [{ id: $("id", "ID!") }, ReviewDetailSelector],
});

export const GetReviewsConfigQuery = typedGql("query", { scalars })({
  getReviewsConfig: {
    reviewsLanguages: true,
    canTranslate: true,
  },
});

export const TranslateReviewsQuery = typedGql("query", { scalars })({
  translateReviews: [
    { input: $("input", "TranslateReviewsInput!") },
    { body: true, languageCode: true, summary: true },
  ],
});

export const GetReviewInfoForProductQuery = typedGql("query", { scalars })({
  getReviewInfoForProduct: [
    { productId: $("productId", "ID!") },
    { averageRating: true, totalReviews: true, totalRatings: true },
  ],
});

export const GetReviewForOrderQuery = typedGql("query", { scalars })({
  getReviewForOrder: [{ orderId: $("orderId", "ID!") }, ReviewDetailSelector],
});
