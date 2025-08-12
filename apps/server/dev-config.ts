import { AdminUiPlugin } from "@deenruv/admin-ui-plugin";
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from "@deenruv/asset-server-plugin";
import {
  ADMIN_API_PATH,
  API_PORT,
  SHOP_API_PATH,
} from "@deenruv/common/lib/shared-constants";
import {
  DeenruvConfig,
  DefaultAssetNamingStrategy,
  DefaultLogger,
  DefaultSearchPlugin,
  dummyPaymentHandler,
  LogLevel,
  TypeORMHealthCheckStrategy,
} from "@deenruv/core";
import { InpostPlugin } from "@deenruv/inpost-plugin";
import { BullMQJobQueuePlugin } from "@deenruv/job-queue-plugin/package/bullmq";
import {
  MerchantExportStrategy as DefaultStrategy,
  FacebookProduct,
  GoogleProduct,
  MerchantPlugin,
} from "@deenruv/merchant-plugin";
import path from "path";
import {
  CurrencyCode,
  EntityHydrator,
  Injector,
  Product,
  ProductVariant,
  RequestContext,
  TranslatorService,
} from "@deenruv/core";
import { customAdminUi } from "compile-admin-ui.js";

interface ProductData extends ProductVariant {
  communicateID: string;
  product: Product;
  price: number;
  priceWithTax: number;
  currencyCode: CurrencyCode;
}

export class MerchantExportStrategy
  implements DefaultStrategy<Array<ProductData>>
{
  private HOST_URL: string;
  private toAbsoluteUrl: (url?: string) => string;
  private translator: TranslatorService;
  private entityHydrator: EntityHydrator;

  constructor({ host_url }: { host_url: string }) {
    this.HOST_URL = host_url;
    this.toAbsoluteUrl = (url?: string) => {
      if (!url) return "";
      return [host_url, "assets", url].join("/");
    };
  }

  init(injector: Injector) {
    this.translator = injector.get(TranslatorService);
    this.entityHydrator = injector.get(EntityHydrator);
  }

  private getSharedData(
    ctx: RequestContext,
    product: ProductData["product"],
    variant: Omit<ProductData, "product">,
  ) {
    const title = variant?.name || product?.name;
    const description = product.description;
    const stockLevel = variant.stockLevels
      .map((stockLevel) => stockLevel.stockOnHand)
      .reduce((a, b) => a + b, 0);
    const asset = variant.featuredAsset?.source
      ? variant.featuredAsset
      : product.featuredAsset;
    const manufacturer = product.facetValues.find(
      (facetValue) => facetValue.facet?.code === "manufacturer",
    )?.name;
    const weight = variant.facetValues.find(
      (facetValue) => facetValue.facet?.code === "weight",
    )?.name;
    const nutritions =
      product.customFields && "nutritions" in product.customFields
        ? (product.customFields.nutritions as string)
        : undefined;
    const price = variant.priceWithTax;
    const currency = variant.currencyCode;
    return {
      title,
      description,
      stockLevel,
      asset,
      manufacturer,
      weight,
      nutritions,
      price,
      currency,
    };
  }

  async prepareFacebookProductPayload(
    ctx: RequestContext,
    variants: ProductData[],
  ) {
    const result: FacebookProduct[] = [];
    for (const { product, ...variant } of variants) {
      const {
        title,
        description,
        stockLevel,
        asset,
        manufacturer,
        weight,
        nutritions,
        price,
        currency,
      } = this.getSharedData(ctx, product, variant);
      result.push({
        communicateID: variant.sku,
        variantID: variant.id,
        retailer_product_group_id: product.id,
        name: title,
        description: description,
        price,
        condition: "new",
        currency,
        image_url: this.toAbsoluteUrl(asset?.source || asset?.preview),
        availability: stockLevel > 0 ? "in stock" : "out of stock",
        url: [this.HOST_URL, "products", product.slug, variant.id].join("/"),
        size: weight,
        ...(manufacturer && { brand: manufacturer }),
        ...(nutritions && { custom_label_0: nutritions }),
      });
    }
    return result;
  }

  async prepareGoogleProductPayload(
    ctx: RequestContext,
    variants: Array<ProductData>,
  ) {
    const result: GoogleProduct[] = [];
    for (const { product, ...variant } of variants) {
      const {
        title,
        description,
        stockLevel,
        asset,
        manufacturer,
        weight,
        nutritions,
        currency,
        price,
      } = this.getSharedData(ctx, product, variant);
      result.push({
        variantID: variant.id,
        communicateID: variant.sku,
        offerId: String(variant.sku),
        mpn: variant.sku,
        itemGroupId: String(product.id),
        title,
        description,
        link: [this.HOST_URL, "products", product.slug, variant.id].join("/"),
        imageLink: this.toAbsoluteUrl(asset?.source || asset?.preview),
        availability: stockLevel > 0 ? "in_stock" : "out_of_stock",
        productWeight: weight
          ? {
              unit: "GRAMS",
              value: parseFloat(weight?.replace(/[^0-9.]/g, "")),
            }
          : undefined,
        price: { value: (price / 100).toFixed(2), currency },
        ...(manufacturer && { customLabel0: manufacturer }),
        ...(nutritions && { customLabel1: nutritions }),
      });
    }
    return result;
  }

  async getBaseData(ctx: RequestContext, product: Product) {
    if (!product || !product.enabled) return [];
    await this.entityHydrator.hydrate(ctx, product, {
      relations: [
        "variants",
        "assets",
        "featuredAsset",
        "optionGroups",
        "optionGroups.options",
      ],
      applyProductVariantPrices: true,
    });
    if (!product || !product.featuredAsset || !product.variants?.length) {
      return undefined;
    }
    const variants = product.variants.filter(
      (v) => v?.enabled && v?.sku && !v.deletedAt,
    );
    const hydrated = await Promise.all(
      variants?.map(async (v) => {
        await this.entityHydrator.hydrate(ctx, v, {
          relations: [
            "stockLevels",
            "stockLevels.productVariant",
            "assets",
            "featuredAsset",
            "options",
            "options.group",
            "facetValues",
            "facetValues.facet",
          ],
        });
        if (!v?.enabled) return undefined;
        const variant = this.translator.translate(v, ctx);
        return {
          variantID: variant.id,
          communicateID: variant.sku,
          ...variant,
          price: variant.priceWithTax,
          priceWithTax: variant.priceWithTax,
          product: this.translator.translate(product, ctx),
        };
      }),
    );
    return hydrated.filter((item): item is NonNullable<typeof item> => !!item);
  }
}

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
    username: process.env.DB_USERNAME || "liogalaktyka-shop",
    password: process.env.DB_PASSWORD || "liogalaktyka-shop",
    database: process.env.DB_NAME || "liogalaktyka-shop",
    schema: process.env.DB_SCHEMA || "public",
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  importExportOptions: {
    importAssetsDir: path.join(__dirname, "import-assets"),
  },
  shippingOptions: {},
  customFields: {},
  plugins: [
    MerchantPlugin.init({
      strategy: new MerchantExportStrategy({
        host_url: HOST,
      }),
    }),
    InpostPlugin.init({}),
    // Przelewy24Plugin.init({}),
    AdminUiPlugin.init({
      route: "admin",
      port: 5001,
      app: customAdminUi({ devMode: true, recompile: true }),
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
  ],
};
