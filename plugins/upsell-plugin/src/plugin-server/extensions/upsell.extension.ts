import { gql } from "graphql-tag";

export const base = gql`
  extend type Product {
    upsellProducts: [Product!]!
  }
`;

export const ShopAPIExtension = gql`
  ${base}
`;

export const AdminAPIExtension = gql`
  ${base}

  input UpsellInput {
    baseProductID: ID!
    upsellProductID: ID!
  }

  extend type Mutation {
    createUpsell(input: [UpsellInput!]!): Boolean!
    deleteUpsell(input: [UpsellInput!]!): Boolean!
  }

  extend type Query {
    upsellProducts(productID: ID!): [Product!]!
  }
`;
