import { AssetServerPlugin } from "@deenruv/asset-server-plugin";
import { configureS3AssetStorage } from "@deenruv/asset-server-plugin";
import {
  ADMIN_API_PATH,
  API_PORT,
  SHOP_API_PATH,
} from "@deenruv/common/shared-constants";
import {
  DeenruvConfig,
  DefaultAssetNamingStrategy,
  DefaultLogger,
  DefaultSearchPlugin,
  LogLevel,
  TypeORMHealthCheckStrategy,
} from "@deenruv/core";
import { BullMQJobQueuePlugin } from "@deenruv/job-queue-plugin/src/bullmq/index";

import path from "path";

export const IS_DEV = process.env.APP_ENV === "LOCAL";
export const HOST =
  process.env.APP_ENV === "LOCAL" ? "http://localhost:3000" : "";

export const devConfig: DeenruvConfig = {
  systemOptions: {
    healthChecks: [new TypeORMHealthCheckStrategy()],
  },
  apiOptions: {
    port: API_PORT,
    adminApiPath: ADMIN_API_PATH,
    adminApiPlayground: {
      settings: {
        "request.credentials": "include",
      },
    },
    adminApiDebug: true,
    shopApiPath: SHOP_API_PATH,
    shopApiPlayground: {
      settings: {
        "request.credentials": "include",
      },
    },
    shopApiDebug: true,
  },
  authOptions: {
    disableAuth: false,
    tokenMethod: ["bearer", "cookie"] as const,
    requireVerification: true,
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_IDENTIFIER || "superadmin",
      password: process.env.SUPERADMIN_PASSWORD || "superpassword",
    },
    customPermissions: [],
    cookieOptions: {
      secret: "abc",
    },
  },
  dbConnectionOptions: {
    synchronize: true,
    logging: false,
    migrations: [path.join(__dirname, "migrations/*.ts")],
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "deenruv",
    password: process.env.DB_PASSWORD || "deenruv",
    database: process.env.DB_NAME || "deenruv",
    schema: process.env.DB_SCHEMA || "public",
  },
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  importExportOptions: {
    importAssetsDir: path.join(__dirname, "import-assets"),
  },
  shippingOptions: {},
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "assets"),
      namingStrategy: new DefaultAssetNamingStrategy(),
      assetUrlPrefix: `${HOST}/assets/`,
      storageStrategyFactory: configureS3AssetStorage({
        bucket: "deenruv-asset-bucket",
        credentials: {
          accessKeyId: "root",
          secretAccessKey: "password",
        },
        nativeS3Configuration: {
          signatureVersion: "v4",
          forcePathStyle: true,
          region: "local",
          endpoint: "http://localhost:9000",
        },
      }),
    }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: false }),
    BullMQJobQueuePlugin.init({
      connection: {
        host: "localhost",
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
  ],
};
