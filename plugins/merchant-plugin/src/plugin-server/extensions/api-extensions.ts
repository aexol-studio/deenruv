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
    entries: [MerchantPlatformSetting!]!
  }

  type MerchantPlatformInfo {
    isValidConnection: Boolean!
    productsCount: Int!
    connectionStatus: String
    dataSourceVerified: Boolean
    checkedAt: DateTime
    latencyMs: Int
    disapprovedProductsCount: Int
    issuesCount: Int
    lastError: MerchantPlatformError
    issues: [MerchantProductIssue!]
  }

  type MerchantPlatformError {
    code: String!
    message: String!
    retryable: Boolean!
  }

  type MerchantProductIssue {
    offerId: String!
    code: String!
    description: String!
    severity: String!
  }

  type MerchantSyncItem {
    id: ID!
    offerId: String!
    operation: String!
    status: String!
    errorCode: String
    errorMessage: String
    attempts: Int!
  }

  type MerchantSyncRun {
    id: ID!
    createdAt: DateTime!
    platform: String!
    trigger: String!
    status: String!
    jobId: String
    total: Int!
    succeeded: Int!
    failed: Int!
    errorSummary: String
    startedAt: DateTime
    finishedAt: DateTime
    items: [MerchantSyncItem!]!
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
    entries: [MerchantPlatformSettingInput!]!
  }

  extend type Mutation {
    sendAllProductsToMerchantPlatform(platform: String!): Boolean
    saveMerchantPlatformSettings(
      input: SaveMerchantPlatformSettingInput!
    ): MerchantPlatformSettingsEntity!
    removeOrphanItems(platform: String!): Boolean
  }

  extend type Query {
    getMerchantPlatformSettings(
      platform: String!
    ): MerchantPlatformSettingsEntity
    getMerchantPlatformInfo(platform: String!): [MerchantPlatformInfo!]
    getMerchantSyncHistory(
      platform: String!
      take: Int
    ): [MerchantSyncRun!]!
  }
`;
