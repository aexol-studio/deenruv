import { type ID, SerializedRequestContext } from "@deenruv/core";

export interface ReplicatePluginOptions {
  deploymentName: string;
  apiToken: string;
}

export interface ModelTrainingQueueType {
  serializedContext: SerializedRequestContext;
  numLastOrder: number;
  startDate: string;
  endDate: string;
}

export interface OrderExportQueueType {
  serializedContext: SerializedRequestContext;
  startDate: string;
  endDate: string;
  predictType: string;
  showMetrics: boolean;
  replicateEntityID: ID;
}
