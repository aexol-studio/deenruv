import { gql } from "graphql-tag";
import { DocumentNode } from "graphql";
import { SharedAPIExtension } from "./shared.extension.js";

export const AdminAPIExtension: DocumentNode = gql`
  ${SharedAPIExtension}

  type ReviewsConfig {
    reviewsLanguages: [LanguageCode!]!
    canTranslate: Boolean!
  }

  input TranslateReviewsInput {
    id: ID!
    languages: [LanguageCode!]!
  }

  type GeneratedReviewTranslation {
    languageCode: LanguageCode!
    body: String!
  }

  type ReviewInfoForProduct {
    averageRating: Float!
    totalReviews: Int!
    totalRatings: Int!
  }

  extend type Query {
    translateReviews(
      input: TranslateReviewsInput!
    ): [GeneratedReviewTranslation!]!
    getReviewsConfig: ReviewsConfig!
    listReviews(
      options: ReviewListOptions!
      productId: ID
      orderId: ID
    ): ReviewList!
    getReview(id: ID!): Review
    getReviewInfoForProduct(productId: ID!): ReviewInfoForProduct
    getReviewForOrder(orderId: ID!): Review
  }

  input ChangeReviewStateInput {
    id: ID!
    state: ReviewState!
    message: String
  }

  input ReviewEntityTranslation {
    languageCode: LanguageCode!
    body: String!
  }

  input UpdateTranslationsReviewInput {
    id: ID!
    translations: [ReviewEntityTranslation!]!
  }

  type ChangeReviewStateResult {
    id: ID!
    success: Boolean!
  }

  extend type Mutation {
    changeReviewState(input: ChangeReviewStateInput!): ChangeReviewStateResult!
    changeReviewsState(
      input: [ChangeReviewStateInput!]!
    ): [ChangeReviewStateResult!]!
    updateTranslationsReview(input: UpdateTranslationsReviewInput!): Review!
  }
`;
