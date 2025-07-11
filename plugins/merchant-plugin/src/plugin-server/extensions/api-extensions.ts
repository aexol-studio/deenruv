import { gql } from "graphql-tag";
import { DocumentNode } from "graphql";

const base: DocumentNode = gql`
  type MerchantPlatformSetting {
    key: String!
    value: String!
  }

  type MerchantPlatformSettingsEntity implements Node {
    id: ID!
    platform: String!
    entries: [MerchantPlatformSetting!]
  }

  type MerchantPlatformInfo {
    isValidConnection: Boolean!
    productsCount: Int!
  }
`;

export const adminApiExtensions = gql`
  ${base}

  input MerchantPlatformSettingInput {
    key: String!
    value: String!
  }

  input SaveMerchantPlatformSettingInput {
    platform: String!
    entries: [MerchantPlatformSettingInput!]
  }

  extend type Mutation {
    sendAllProductsToMerchantPlatform(platform: String!): Boolean
    saveMerchantPlatformSettings(
      input: SaveMerchantPlatformSettingInput!
    ): MerchantPlatformSettingsEntity!
  }

  extend type Query {
    getMerchantPlatformSettings(
      platform: String!
    ): MerchantPlatformSettingsEntity
    getMerchantPlatformInfo(platform: String!): [MerchantPlatformInfo!]
  }
`;
