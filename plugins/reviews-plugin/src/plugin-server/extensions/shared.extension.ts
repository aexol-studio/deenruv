import { gql } from "graphql-tag";
import { DocumentNode } from "graphql";

export const SharedAPIExtension: DocumentNode = gql`
  enum ReviewState {
    PENDING
    ACCEPTED
    DECLINED
  }

  type ReviewTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: String!
    body: String
  }

  type ReviewAsset {
    key: String!
    url: String!
  }

  type Review implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    assets: [ReviewAsset!]!
    state: ReviewState!
    response: String
    responseCreatedAt: DateTime
    rating: Float!
    authorName: String!
    authorLocation: String
    authorEmailAddress: String!
    body: String
    translations: [ReviewTranslation!]!
    product: Product
    productVariant: ProductVariant
    order: Order
    author: Customer
    keepAnonymous: Boolean!
  }

  type ReviewList implements PaginatedList {
    items: [Review!]!
    totalItems: Int!
  }

  input ReviewFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    state: StringOperators
    response: StringOperators
    responseCreatedAt: DateOperators
    rating: NumberOperators
    authorName: StringOperators
    authorLocation: StringOperators
    authorEmailAddress: StringOperators
    body: StringOperators
    productId: IDOperators
    orderId: IDOperators
    customerId: IDOperators
    _and: [ReviewFilterParameter!]
    _or: [ReviewFilterParameter!]
  }

  input ReviewSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    response: SortOrder
    responseCreatedAt: SortOrder
    rating: SortOrder
    authorName: SortOrder
    authorLocation: SortOrder
    authorEmailAddress: SortOrder
    body: SortOrder
  }

  input ReviewListOptions {
    skip: Int
    take: Int
    sort: ReviewSortParameter
    filter: ReviewFilterParameter
    filterOperator: LogicalOperator
  }
`;
