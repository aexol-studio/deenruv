import {
  Logger,
  Product,
  RequestContext,
  TransactionalConnection,
  ProductVariant,
} from "@deenruv/core";
import { Injectable } from "@nestjs/common";
import { FacebookAdsApi, ProductCatalog } from "facebook-nodejs-business-sdk";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { BaseData, BaseProductData } from "../types.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { In } from "typeorm";

type FbMethod = "CREATE" | "UPDATE" | "DELETE";
type OpResult = { status: "success" | "error"; message?: string };

@Injectable()
export class FacebookPlatformIntegrationService {
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");
  private error = (message: string, err?: unknown) =>
    this.logger.error(
      message,
      err instanceof Error ? err.stack : String(err),
      "Merchant Platform Service",
    );

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly strategy: MerchantStrategyService,
  ) {}

  private async withCatalog(ctx: RequestContext): Promise<{
    catalog: ProductCatalog;
    brand: string;
  }> {
    const settings = await this.setFacebookSettings(ctx);
    if (!settings) {
      throw new Error("Facebook platform settings not found");
    }
    const { accessToken, catalogId, brand } = settings;
    FacebookAdsApi.init(accessToken);
    const catalog = new ProductCatalog(catalogId);
    return { catalog, brand };
  }

  private async sendBatch(opts: {
    ctx: RequestContext;
    method: FbMethod;
    data: BaseProductData<BaseData>;
  }): Promise<OpResult> {
    const { ctx, method, data } = opts;
    try {
      const { catalog, brand } = await this.withCatalog(ctx);
      const requests = await this.prepareFacebookProductPayload({
        ctx,
        method,
        data,
        brand,
      });

      if (!requests || requests.length === 0) {
        return { status: "success", message: "No products to process" };
      }
      const response = await catalog.createBatch([], { requests });
      const hasValidationErrors =
        Array.isArray(response?._data?.validation_status) &&
        response._data.validation_status.length > 0;

      if (hasValidationErrors) {
        this.error(`FB batch ${method} validation errors`);
        return {
          status: "error",
          message: JSON.stringify(response._data.validation_status),
        };
      }
      const items =
        response._data?.responses ??
        response._data?.results ??
        response._data?.handles ??
        response._data?.data ??
        null;
      if (Array.isArray(items)) {
        const errored = items.filter(
          (it) =>
            it?.error ||
            it?.error_message ||
            it?.code >= 400 ||
            (Array.isArray(it?.errors) && it.errors.length > 0),
        );
        if (errored.length > 0) {
          this.error(`FB batch ${method} per-item errors`, errored);
          return {
            status: "error",
            message: JSON.stringify(errored.slice(0, 3)),
          };
        }
      }
      if (method !== "DELETE") {
        const repo = this.connection.getRepository(ctx, ProductVariant);
        const items = data.filter((d) => d.variantID);
        const ids = [...new Set(items.map((i) => i.variantID as string))];
        if (ids.length) {
          const variants = await repo.find({ where: { id: In(ids) } });
          const variantMap = new Map(variants.map((v) => [v.id, v]));
          const toDelete: { communicateID: string; variantID: string }[] = [];
          for (const item of items) {
            const variant = variantMap.get(item.variantID as string);
            if (!variant) continue;
            const newCommId = item.communicateID;
            const prevCommId = variant.customFields?.communicateID;
            if (method === "UPDATE" && prevCommId && prevCommId !== newCommId) {
              toDelete.push({
                communicateID: prevCommId,
                variantID: variant.id as string,
              });
            }
            variant.customFields = {
              ...variant.customFields,
              communicateID: newCommId,
            };
          }
          if (toDelete.length)
            await this.sendBatch({ ctx, method: "DELETE", data: toDelete });
          if (variants.length) await repo.save(variants, { chunk: 100 });
        }
      }
      this.log(`FB batch ${method} done`);
      return { status: "success", message: "Products processed successfully" };
    } catch (e) {
      this.error(`FB batch ${method} failed`, e);
      return { status: "error", message: e instanceof Error ? e.message : "" };
    }
  }

  async createProduct({
    ctx,
    data,
  }: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity?: Product;
  }): Promise<OpResult> {
    return this.sendBatch({ ctx, method: "CREATE", data });
  }

  async updateProduct({
    ctx,
    data,
  }: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity?: Product;
  }): Promise<OpResult> {
    return this.sendBatch({ ctx, method: "UPDATE", data });
  }

  async deleteProduct({
    ctx,
    data,
  }: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity?: Product;
  }): Promise<OpResult> {
    return this.sendBatch({ ctx, method: "DELETE", data });
  }

  async batchProductsAction({
    ctx,
    products,
  }: {
    ctx: RequestContext;
    products: BaseProductData<BaseData>[];
    entity?: Product;
  }): Promise<OpResult> {
    for (const product of products) {
      await this.sendBatch({ ctx, method: "UPDATE", data: product });
    }
    return { status: "success", message: "Products processed successfully" };
  }

  async setFacebookSettings(
    ctx: RequestContext,
    rawSettings?: MerchantPlatformSettingsEntity,
  ) {
    let settings: MerchantPlatformSettingsEntity | null | undefined =
      rawSettings;

    if (!settings) {
      settings = await this.connection
        .getRepository(ctx, MerchantPlatformSettingsEntity)
        .findOne({ relations: ["entries"], where: { platform: "facebook" } });
    }
    if (!settings) return null;
    const getVal = (key: string) =>
      settings!.entries.find((e) => e.key === key)?.value;
    const autoUpdate = getVal("autoUpdate");
    const credentials = getVal("credentials");
    const merchantId = getVal("merchantId");
    const brand = getVal("brand") ?? "";
    if (!credentials || !merchantId) return null;
    return {
      autoUpdate: String(autoUpdate).toLowerCase() === "true",
      accessToken: credentials,
      catalogId: merchantId,
      brand,
    };
  }

  private async prepareFacebookProductPayload({
    ctx,
    method,
    data,
    brand,
  }: {
    ctx: RequestContext;
    method: FbMethod;
    data: BaseProductData<BaseData>;
    brand: string;
  }) {
    if (method === "DELETE") {
      return data.map(({ communicateID }) => ({
        retailer_id: `${communicateID}`,
        method,
        data: {},
      }));
    }
    const products = await this.strategy.prepareFacebookProductPayload(
      ctx,
      data,
    );
    return products?.map(({ communicateID, variantID, ...product }) => ({
      retailer_id: `${communicateID}`,
      method,
      data: { ...product, brand: product.brand ?? brand ?? "" },
    }));
  }
}
