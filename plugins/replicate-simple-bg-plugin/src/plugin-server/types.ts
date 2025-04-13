import { ID, SerializedRequestContext } from "@deenruv/core";

export interface ReplicateSimpleBGOptions {
  envs: {
    deploymentName: string;
    apiToken: string;
    assetPrefix: string;
  };
  prompts?: { positive?: string; negative?: string };
  seed?: number;
  roomType?: Array<{ value: string; label: string }>;
  roomTheme?: Array<{ value: string; label: string; image: string }>;
}

export interface ModelRunQueueType {
  serializedContext: SerializedRequestContext;
  assetId: string;
  roomType: string;
  roomStyle: string;
  replicateSimpleBGEntityID: ID;
}
