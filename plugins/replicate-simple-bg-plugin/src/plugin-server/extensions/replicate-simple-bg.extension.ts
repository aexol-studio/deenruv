import * as _ from "graphql";
import { gql } from "graphql-tag";

export const AdminExtension = gql`
  input StartGenerateSimpleBgInput {
    assetId: String
    roomType: String
    roomStyle: String
    prompt: String
  }

  input GetPredictionAssetInput {
    predictionId: String!
    productId: String!
  }

  type AssetPrediction {
    id: ID!
    preview: String!
    source: String!
  }

  extend type Mutation {
    startGenerateSimpleBg(input: StartGenerateSimpleBgInput!): String!
    getPredictionAsset(input: GetPredictionAssetInput!): Asset!
  }

  input GetSimpleBgEntityInput {
    prediction_simple_bg_entity_id: String!
  }

  enum PredictionSimpleBgStatus {
    starting
    preprocessing
    succeeded
    failed
  }

  type PredictionSimpleBgResult {
    id: ID!
    status: PredictionSimpleBgStatus
    image: String
    roomType: String
    roomStyle: String
  }

  input ReplicateSimpleBgEntityListOptions

  type Image {
    url: String!
  }

  type RoomType implements Node {
    id: ID!
    value: String
    label: String
  }

  type RoomTheme implements Node {
    id: ID!
    value: String
    label: String
    image: String
  }

  type SimpleBgPluginOptions {
    roomTypes: [RoomType]
    roomThemes: [RoomTheme]
  }

  extend type Query {
    getSimpleBgID(input: GetSimpleBgEntityInput!): String
    getSimpleBgPredictions(
      options: ReplicateSimpleBgEntityListOptions
    ): ReplicateSimpleBgEntityList!
    getSimpleBgItem(id: String!): PredictionSimpleBgResult!
    getSimpleBgThemeAsset(url: String!): Image!
    getSimpleBgOptions: SimpleBgPluginOptions!
  }

  type ReplicateSimpleBgEntity implements Node {
    id: ID!
    status: PredictionSimpleBgStatus!
    finishedAt: DateTime
  }

  type ReplicateSimpleBgEntityList implements PaginatedList {
    items: [ReplicateSimpleBgEntity!]!
    totalItems: Int!
  }

  type SimpleBgProduct implements Node {
    createdAt: DateTime
    updatedAt: DateTime
    name: String
    slug: String
    id: ID!
  }

  type SimpleBgProductList implements PaginatedList {
    items: [SimpleBgProduct!]!
    totalItems: Int!
  }
`;
