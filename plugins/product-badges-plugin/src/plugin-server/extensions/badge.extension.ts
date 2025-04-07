import { gql } from "graphql-tag";
import graphql from "graphql";

const base = gql`
  extend type Product {
    badges: [Badge!]
  }

  # type SearchResultBadge {
  #   id: ID!
  #   name: String
  #   color: String!
  # }

  # extend type SearchResult {
  #   badges: [SearchResultBadge!]
  # }

  type BadgeTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    languageCode: LanguageCode!
    name: String!
  }

  type Badge implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    product: Product!
    color: String!
    name: String
    translations(languageCode: LanguageCode): [BadgeTranslation!]!
  }
`;

export const ShopExtension = gql`
  ${base}
`;

export const AdminExtension = gql`
  ${base}

  input BadgeTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CreateBadgeInput {
    productId: ID!
    color: String!
    translations: [BadgeTranslationInput!]
  }

  input RemoveBadgeInput {
    id: ID!
  }
  input EditBadgeInput {
    id: ID!
    color: String
    translations: [BadgeTranslationInput!]
  }

  extend type Mutation {
    createBadge(input: CreateBadgeInput!): Badge!
    editBadge(input: EditBadgeInput!): Badge!
    removeBadge(input: RemoveBadgeInput!): Boolean!
  }

  input GetProductBadgesInput {
    productId: ID!
  }

  extend type Query {
    getProductBadges(input: GetProductBadgesInput!): [Badge!]
  }
`;
