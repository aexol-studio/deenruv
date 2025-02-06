import { ID, SerializedRequestContext } from '@deenruv/core';
import { ReplicateEntity } from './entites/replicate.entity.js';

export interface ReplicatePluginOptions {
    deploymentName: string;
    url: string;
    login: string;
    password: string;
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
    numLastOrder: number;
    startDate: string;
    endDate: string;
    predictType: string;
    showMetrics: boolean;
    replicateEntityID: ID;
}
