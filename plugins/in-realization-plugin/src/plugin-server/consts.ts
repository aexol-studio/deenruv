import { S3Client } from "@aws-sdk/client-s3";
export const PLUGIN_INIT_OPTIONS = Symbol("InRealizationPluginOptions");
export type InRealizationPluginOptions = {
  s3: {
    client: S3Client;
    bucket: string;
    expiresIn: number;
  };
};
