import { S3Client } from '@aws-sdk/client-s3';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

export const region = process.env.AWS_REGION || 'eu-central-1';

export const credentials = fromNodeProviderChain({
    ...(process.env.AWS_PROFILE && { profile: process.env.AWS_PROFILE }),
    clientConfig: { region },
});

export const s3Client = new S3Client({
    forcePathStyle: true,
    region: 'local',
    endpoint: 'http://localhost:9000',
    credentials: { accessKeyId: 'root', secretAccessKey: 'password' },
});
