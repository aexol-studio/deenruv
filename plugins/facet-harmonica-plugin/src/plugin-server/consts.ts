export const PLUGIN_INIT_OPTIONS = Symbol('FacetHarmonicaPluginOptions');
import { S3Client } from '@aws-sdk/client-s3';
export type FacetHarmonicaPluginOptions = {
    s3: {
        client: S3Client;
        bucket: string;
        expiresIn: number;
    };
};
