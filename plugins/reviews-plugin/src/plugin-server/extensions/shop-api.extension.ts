import { gql } from "graphql-tag";
import { SharedAPIExtension } from "./shared.extension.js";
import { DocumentNode } from "graphql";

export const ShopAPIExtension: DocumentNode = gql`
  ${SharedAPIExtension}

  input CreateReviewInput {
    rating: Float!
    body: String!
    authorName: String
    authorLocation: String
    authorEmailAddress: String
    uploadedAssets: [String!]
    orderId: ID
    productVariantId: ID
    keepAnonymous: Boolean
  }

  input ReviewsStorageOptions {
    filename: String!
  }

  type ReviewsStorage {
    url: String!
    key: String!
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
  }

  type AverageRating {
    total: Int!
    count: Int!
  }

  type AverageRatings {
    shopAverageRating: AverageRating!
    productsAverageRating: AverageRating!
  }

  extend type Query {
    getAverageRatings: AverageRatings!
    getReviewsStorage(input: [ReviewsStorageOptions!]!): [ReviewsStorage!]!
  }

  extend type Product {
    averageRating: Float!
    reviews(options: ReviewListOptions): ReviewList!
  }

  extend type Order {
    reviewed: Boolean!
    review: Review
  }

  extend type Customer {
    reviews(options: ReviewListOptions): ReviewList!
    shopReviewCreated: Boolean!
  }
`;
