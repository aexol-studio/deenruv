import gql from "graphql-tag";

const base = gql`
  type OrderRealization {
    orderID: ID!
    assetID: ID!
    plannedAt: String!
    finalPlannedAt: String
    note: String
    color: String!
    key: String
    url: String
  }

  type ShopOrderRealization {
    note: String
    plannedAt: String
    finalPlannedAt: String
  }

  input RealizationAssetInput {
    id: String!
    orderLineID: String!
    preview: String!
  }

  input OrderRealizationInput {
    orderID: String!
    assets: [RealizationAssetInput!]!
    plannedAt: String!
    finalPlannedAt: String!
    note: String!
    color: String!
  }
`;

export const ShopExtension = gql`
  ${base}

  extend type Order {
    realization: ShopOrderRealization
  }
`;

export const AdminExtension = gql`
  ${base}

  extend type Order {
    getRealization: OrderRealization
  }

  extend type Query {
    getRealizationURL(orderID: ID!): String
  }

  extend type Mutation {
    registerRealization(input: OrderRealizationInput!): OrderRealization
  }
`;
