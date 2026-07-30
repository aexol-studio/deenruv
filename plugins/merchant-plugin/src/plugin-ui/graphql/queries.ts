import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";
import { merchantPlatformSettingsSelector } from "./mutations";
import { $ } from "../zeus/index";
import { gql } from "graphql-tag";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

const query = typedGql("query", { scalars });
export const getMerchantPlatformSettings = query({
  getMerchantPlatformSettings: [
    { platform: $("platform", "String!") },
    merchantPlatformSettingsSelector,
  ],
});
export const getMerchantPlatformInfo = query({
  getMerchantPlatformInfo: [
    { platform: $("platform", "String!") },
    { isValidConnection: true, productsCount: true },
  ],
});

export type GoogleMerchantDiagnostic = {
  checkedAt?: string;
  connectionStatus?: string;
  dataSourceVerified?: boolean;
  disapprovedProductsCount?: number;
  isValidConnection: boolean;
  issues?: Array<{
    code: string;
    description: string;
    offerId: string;
    severity: string;
  }>;
  issuesCount?: number;
  lastError?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  latencyMs?: number;
  productsCount: number;
};

export type MerchantSyncRunSummary = {
  createdAt: string;
  errorSummary?: string;
  failed: number;
  finishedAt?: string;
  id: string;
  items: Array<{
    attempts: number;
    errorCode?: string;
    errorMessage?: string;
    offerId: string;
    operation: string;
    status: string;
  }>;
  status: string;
  succeeded: number;
  total: number;
  trigger: string;
};

export const getGoogleMerchantDiagnostic = gql`
  query GetGoogleMerchantDiagnostic {
    getMerchantPlatformInfo(platform: "google") {
      isValidConnection
      productsCount
      connectionStatus
      dataSourceVerified
      checkedAt
      latencyMs
      disapprovedProductsCount
      issuesCount
      lastError {
        code
        message
        retryable
      }
      issues {
        offerId
        code
        description
        severity
      }
    }
  }
` as TypedDocumentNode<{
  getMerchantPlatformInfo?: GoogleMerchantDiagnostic[];
}>;

export const getGoogleMerchantSyncHistory = gql`
  query GetGoogleMerchantSyncHistory($take: Int) {
    getMerchantSyncHistory(platform: "google", take: $take) {
      id
      createdAt
      trigger
      status
      total
      succeeded
      failed
      errorSummary
      finishedAt
      items {
        offerId
        operation
        status
        errorCode
        errorMessage
        attempts
      }
    }
  }
` as TypedDocumentNode<
  { getMerchantSyncHistory: MerchantSyncRunSummary[] },
  { take?: number }
>;
