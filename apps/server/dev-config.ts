/* eslint-disable no-console */
import { AdminUiPlugin } from '@deenruv/admin-ui-plugin';
import { AssetServerPlugin, configureS3AssetStorage } from '@deenruv/asset-server-plugin';
import { DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin';
// import { ContentManagementServerPlugin } from '@deenruv/content-management-plugin';
// import { RestPlugin } from './test-plugins/rest-plugin';
// import { MinkoCorePlugin } from '@deenruv/minko-core-plugin';

import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@deenruv/common/lib/shared-constants';
import {
    DefaultLogger,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    LogLevel,
    DeenruvConfig,
    DefaultAssetNamingStrategy,
} from '@deenruv/core';
import { BullMQJobQueuePlugin } from '@deenruv/job-queue-plugin/package/bullmq';
import 'dotenv/config';
import path from 'path';

// import { RestPlugin } from './test-plugins/rest-plugin';
import { s3Client } from './client-s3';
/**
 * Config settings used during development
 */

export const IS_DEV = process.env.APP_ENV === 'LOCAL';
export const HOST = process.env.APP_ENV === 'LOCAL' ? 'http://localhost:3000' : '';

export const devConfig: DeenruvConfig = {
    apiOptions: {
        port: API_PORT,
        adminApiPath: ADMIN_API_PATH,
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            },
        },
        adminApiDebug: true,
        shopApiPath: SHOP_API_PATH,
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            },
        },
        shopApiDebug: true,
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: ['bearer', 'cookie'] as const,
        requireVerification: true,
        customPermissions: [],
        cookieOptions: {
            secret: 'abc',
        },
    },
    dbConnectionOptions: {
        synchronize: true,
        logging: false,
        migrations: [path.join(__dirname, 'migrations/*.ts')],
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'deenruv',
        password: process.env.DB_PASSWORD || 'deenruv',
        database: process.env.DB_NAME || 'deenruv',
        schema: process.env.DB_SCHEMA || 'public',
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },

    logger: new DefaultLogger({ level: LogLevel.Verbose }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        DashboardWidgetsPlugin,
        // MultivendorPlugin.init({
        //     platformFeePercent: 10,
        //     platformFeeSKU: 'FEE',
        // }),
        // JobQueueTestPlugin.init({ queueCount: 10 }),
        // ElasticsearchPlugin.init({
        //     host: 'http://localhost',
        //     port: 9200,
        //     bufferUpdates: true,
        // }),
        // EmailPlugin.init({
        //     devMode: true,
        //     route: 'mailbox',
        //     handlers: defaultEmailHandlers,
        //     templatePath: path.join(__dirname, '../../packages/email-plugin/templates'),
        //     outputPath: path.join(__dirname, 'test-emails'),
        //     globalTemplateVars: {
        //         verifyEmailAddressUrl: 'http://localhost:4201/verify',
        //         passwordResetUrl: 'http://localhost:4201/reset-password',
        //         changeEmailAddressUrl: 'http://localhost:4201/change-email-address',
        //     },
        // }),
        // RestPlugin,
        AdminUiPlugin.init({
            route: 'admin',
            port: 5001,
            // Un-comment to compile a custom admin ui
            // app: compileUiExtensions({
            //     outputPath: path.join(__dirname, './custom-admin-ui'),
            //     extensions: [
            //         {
            //             id: 'ui-extensions-library',
            //             extensionPath: path.join(__dirname, 'example-plugins/ui-extensions-library/ui'),
            //             routes: [{ route: 'ui-library', filePath: 'routes.ts' }],
            //             providers: ['providers.ts'],
            //         },
            //         {
            //             globalStyles: path.join(
            //                 __dirname,
            //                 'test-plugins/with-ui-extension/ui/custom-theme.scss',
            //             ),
            //         },
            //     ],
            //     devMode: true,
            // }),
        }),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            namingStrategy: new DefaultAssetNamingStrategy(),
            assetUrlPrefix: `${HOST}/assets/`,
            storageStrategyFactory: configureS3AssetStorage({
                bucket: 'deenruv-asset-bucket',
                credentials: {
                    accessKeyId: 'root',
                    secretAccessKey: 'password',
                },
                nativeS3Configuration: {
                    signatureVersion: 'v4',
                    forcePathStyle: true,
                    region: 'local',
                    endpoint: 'http://localhost:9000',
                },
            }),
        }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: false }),
        BullMQJobQueuePlugin.init({
            connection: {
                host: 'localhost',
                ...(!IS_DEV && { password: process.env.REDIS_PASSWORD }),
                maxRetriesPerRequest: null,
                connectTimeout: 5000,
                port: 6379,
            },
            workerOptions: {
                concurrency: 10,
                removeOnComplete: { count: 500, age: 1000 * 60 * 60 * 24 * 7 },
                removeOnFail: { count: 1000, age: 1000 * 60 * 60 * 24 * 7 },
            },
        }),
        // ContentManagementServerPlugin,
        // MinkoCorePlugin.init({
        //     s3Client,
        //     expiresIn: 60 * 60 * 24 * 3,
        //     bucket: process.env.MINIO_INVOICES ?? 'invoices.dev.minko.aexol.work',
        // }),
    ],
};
