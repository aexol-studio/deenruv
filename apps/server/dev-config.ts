import { AdminUiPlugin } from "@deenruv/admin-ui-plugin";
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from "@deenruv/asset-server-plugin";
// import { DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin';
// import { RestPlugin } from './test-plugins/rest-plugin';
// import { MinkoCorePlugin } from '@deenruv/minko-core-plugin';
// import { DeenruvExamplesServerPlugin } from '@deenruv/deenruv-examples-plugin';
import { ReplicatePlugin } from "@deenruv/replicate-plugin";
import { FacetHarmonicaServerPlugin } from "@deenruv/facet-harmonica-plugin";
import { InRealizationPlugin } from "@deenruv/in-realization-plugin";
import { CopyOrderPlugin } from "@deenruv/copy-order-plugin";
import { Przelewy24Plugin } from "@deenruv/przelewy24-plugin";
import {
  ADMIN_API_PATH,
  API_PORT,
  SHOP_API_PATH,
} from "@deenruv/common/lib/shared-constants";
import {
  DefaultLogger,
  DefaultSearchPlugin,
  dummyPaymentHandler,
  LogLevel,
  DeenruvConfig,
  DefaultAssetNamingStrategy,
  LanguageCode,
  FulfillmentHandler,
  Asset,
} from "@deenruv/core";
import { BullMQJobQueuePlugin } from "@deenruv/job-queue-plugin/package/bullmq";
import "dotenv/config";
import path from "path";
import { s3Client } from "client-s3.js";
import { OrderLineAttributesServerPlugin } from "@deenruv/order-line-attributes-plugin";
import { WFirmaPlugin } from "@deenruv/wfirma-plugin";

// import { RestPlugin } from './test-plugins/rest-plugin';
// import { s3Client } from './client-s3';
/**
 * Config settings used during development
 */

export const IS_DEV = process.env.APP_ENV === "LOCAL";
export const HOST =
  process.env.APP_ENV === "LOCAL" ? "http://localhost:3000" : "";

const handler = new FulfillmentHandler({
  code: "dpd-fulfillment-handler",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Dpd courier",
    },
  ],
  args: {
    width: {
      type: "int",
      required: true,
      label: [
        { languageCode: LanguageCode.pl, value: "Szerokość(cm)* max 80" },
      ],
      ui: {
        component: "DUPA",
      },
    },
    height: {
      type: "int",
      required: true,
      label: [
        { languageCode: LanguageCode.pl, value: "Wysokość(cm)* max 120" },
      ],
    },
    depth: {
      type: "int",
      required: true,
      label: [
        { languageCode: LanguageCode.pl, value: "Głebokość(cm)* max 180" },
      ],
    },
    weight: {
      type: "float",
      required: true,
      label: [{ languageCode: LanguageCode.pl, value: "Waga*" }],
    },
    isInsured: {
      type: "boolean",
      required: true,
      defaultValue: true,
      label: [
        {
          languageCode: LanguageCode.pl,
          value: "Ubezpiecz paczkę na wartość przesyłki",
        },
      ],
    },
  },
  init() {},
  createFulfillment: async () => {
    return {};
  },
});

const empty = {
  label: [
    { languageCode: LanguageCode.en, value: "" },
    { languageCode: LanguageCode.pl, value: "" },
  ],
  description: [
    { languageCode: LanguageCode.en, value: "" },
    { languageCode: LanguageCode.pl, value: "" },
  ],
};

export const devConfig: DeenruvConfig = {
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
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  importExportOptions: {
    importAssetsDir: path.join(__dirname, "import-assets"),
  },
  shippingOptions: { fulfillmentHandlers: [handler] },
  customFields: {
    Administrator: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Asset: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Channel: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Collection: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    CustomerGroup: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Facet: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    FacetValue: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Fulfillment: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    GlobalSettings: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    PaymentMethod: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    ProductOption: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    ProductOptionGroup: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    ProductVariantPrice: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Promotion: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Region: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Seller: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    ShippingMethod: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    StockLocation: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    TaxCategory: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    TaxRate: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    User: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Zone: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Order: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Product: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
      {
        name: "sizes",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Wymiary" },
        ...empty,
      },
      {
        name: "finish",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Wypos." },
        ...empty,
      },
      {
        name: "materials",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Kolory" },
        ...empty,
      },
      {
        name: "payment",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Płatność" },
        ...empty,
      },
      {
        name: "delivery",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Dostawa" },
        ...empty,
      },
      {
        name: "realization",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Termin realizacji" },
        ...empty,
      },
      {
        name: "safety",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Bezpieczeństwo" },
        ...empty,
      },
      {
        name: "manuals",
        type: "localeText",
        defaultValue: "",
        ui: { tab: "Instrukcje" },
        ...empty,
      },
      {
        name: "mainProductImage",
        type: "relation",
        graphQLType: "Asset",
        entity: Asset,
        public: true,
        nullable: true,
        eager: true,
        label: [{ languageCode: LanguageCode.en, value: "Main Product Image" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Recommended size: 1200x630px",
          },
        ],
      },
      {
        name: "hoverProductImage",
        type: "relation",
        graphQLType: "Asset",
        entity: Asset,
        public: true,
        eager: true,
        nullable: true,
        label: [
          { languageCode: LanguageCode.en, value: "Hover Product Image" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Recommended size: 1200x630px",
          },
        ],
      },
    ],
    ProductVariant: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    OrderLine: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Customer: [
      {
        name: "TEST",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "TEST" },
          { languageCode: LanguageCode.pl, value: "TEST" },
        ],
      },
    ],
    Address: [
      {
        name: "companyName",
        type: "string",
        label: [
          {
            languageCode: LanguageCode.en,
            value: "Company Name",
          },
          {
            languageCode: LanguageCode.pl,
            value: "Nazwa firmy",
          },
        ],
      },
      {
        name: "companyTaxId",
        type: "string",
        label: [
          {
            languageCode: LanguageCode.en,
            value: "Company Tax ID",
          },
          {
            languageCode: LanguageCode.pl,
            value: "NIP",
          },
        ],
      },
    ],
  },
  plugins: [
    // DashboardWidgetsPlugin,
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
      route: "admin",
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
    Przelewy24Plugin.init({
      "pl-channel": {
        PRZELEWY24_CLIENT_SECRET: "6e780d6c4af9ff9efa1f426297ad0bf2",
        PRZELEWY24_CRC: "63e53dd6d1cc4dd5",
        PRZELEWY24_POS_ID: "268888",
      },
    }),
    // FacetHarmonicaServerPlugin.init({
    //     s3: { bucket: 'deenruv-asset-bucket', client: s3Client, expiresIn: 60 * 60 * 24 * 3 },
    // }),
    CopyOrderPlugin,
    InRealizationPlugin.init({
      s3: {
        client: s3Client,
        bucket: "deenruv-asset-bucket",
        expiresIn: 60 * 60 * 24 * 3,
      },
    }),
    FacetHarmonicaServerPlugin,
    OrderLineAttributesServerPlugin,
    WFirmaPlugin.init({
      authorization: {
        accessKey: "0b835d398cfd8078c76e756ac89e08ed",
        appKey: "7ee060de3fa24b643e3143763d700682",
        secretKey: "a8e42a73cd1d9a44e7e9c0c9a9772fdd",
      },
    }),
    // DeenruvExamplesServerPlugin,
    // ContentManagementServerPlugin,
    // MinkoCorePlugin.init({
    //     s3Client,
    //     expiresIn: 60 * 60 * 24 * 3,
    //     bucket: process.env.MINIO_INVOICES ?? 'invoices.dev.minko.aexol.work',
    // }),
    ReplicatePlugin.init({
      deploymentName: process.env.REPLICATE_DEPLOYMENT_NAME || "",
      // url: process.env.REPLICATE_URL || '',
      // login: process.env.REPLICATE_LOGIN || '',
      // password: process.env.REPLICATE_PASSWORD || '',
      apiToken: process.env.REPLICATE_API_TOKEN || "",
    }),
  ],
};
