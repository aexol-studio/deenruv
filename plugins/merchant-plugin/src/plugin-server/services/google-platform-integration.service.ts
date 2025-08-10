import {
  Logger,
  Product,
  ProductVariant,
  ProductVariantService,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { BaseData, BaseProductData, GoogleProduct } from "../types.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { In } from "typeorm";

type GMethod = "insert" | "update" | "delete";
type OpResult = { status: "success" } | { status: "error"; error?: unknown };

@Injectable()
export class GooglePlatformIntegrationService {
  private readonly SCOPES = ["https://www.googleapis.com/auth/content"];
  private readonly google_content_api_version = "v2.1";
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");
  private error = (message: string, err?: unknown) =>
    this.logger.error(
      message,
      err instanceof Error ? err.stack : String(err),
      "Merchant Platform Service",
    );

  private googleContext = {
    channel: "online",
    contentLanguage: "pl",
    feedLabel: "PL",
  };

  private googleContextString = (id: string) =>
    Object.values(this.googleContext).join(":") + `:${id}`;

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly strategy: MerchantStrategyService,
  ) {}

  private async getAuthorization() {
    const settings = await this.setGoogleSettings();
    if (!settings) throw new Error("Google platform settings not found");
    const { accountId, credentials } = settings;
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: this.SCOPES,
    });
    const client = google.content({
      version: this.google_content_api_version,
      auth,
    });
    if (!client) throw new Error("Content API client not found");
    if (!accountId) throw new Error("Merchant ID not found");
    return { client, ...settings };
  }

  async getGoogleProduct({ communicateID }: { communicateID: string }) {
    const { accountId, client } = await this.getAuthorization();
    try {
      const response = await client.products.get({
        merchantId: accountId,
        productId: this.googleContextString(communicateID),
      });
      return response.data ?? null;
    } catch (e) {
      const err = e as { response?: { status: number } };
      if (err.response?.status === 404) return null;
      throw e;
    }
  }

  async insertProduct<T extends BaseData>(opts: {
    ctx: RequestContext;
    data: BaseProductData<T>;
    entity: Product;
    skipCheck?: boolean;
  }): Promise<OpResult> {
    return this.sendBatch({ ...opts, method: "insert" });
  }

  async updateProduct(opts: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity: Product;
  }): Promise<OpResult> {
    return this.sendBatch({ ...opts, method: "update" });
  }

  async deleteProduct(opts: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity: Product;
  }): Promise<OpResult> {
    return this.sendBatch({ ...opts, method: "delete" });
  }

  async batchProductsAction(opts: {
    ctx: RequestContext;
    products: BaseProductData<BaseData>[];
  }): Promise<OpResult> {
    const { ctx, products } = opts;
    try {
      const { accountId, brand, client } = await this.getAuthorization();
      const allPayloads = await Promise.all(
        products.map((p) => this.buildPayload(ctx, p)),
      ).then((arr) => arr.flat());
      if (allPayloads.length === 0) return { status: "success" };

      const insertProducts = this.mapInsertProducts(allPayloads, brand);
      const entries = insertProducts.map((product, i) => ({
        batchId: i + 1,
        merchantId: accountId,
        method: "insert" as const,
        product,
      }));

      const resp = await client.products.custombatch({
        requestBody: { entries },
      });
      if (resp.status !== 200) throw new Error("Batch insert failed");
      const hasErrors = resp.data?.entries?.some((e) => e.errors);
      if (hasErrors) throw new Error("Per-item insert errors");
      this.log(
        `Batch inserted ${resp.data?.entries?.length ?? insertProducts.length} product(s)`,
      );

      for (const product of products) {
        for (const item of product) {
          await this.connection
            .getRepository(ctx, ProductVariant)
            .update(
              { id: item.variantID },
              { customFields: { communicateID: item.communicateID } },
            );
        }
      }

      return { status: "success" };
    } catch (e) {
      this.error("Batch products action failed", e);
      return { status: "error", error: e };
    }
  }

  private async sendBatch(opts: {
    ctx: RequestContext;
    method: GMethod;
    data: BaseProductData<BaseData>;
    skipCheck?: boolean;
  }): Promise<OpResult> {
    const { ctx, method, data, skipCheck } = opts;
    try {
      const basePayload = await this.buildPayload(ctx, data);
      if (basePayload.length === 0) return { status: "success" };

      const { accountId, brand, client } = await this.getAuthorization();

      let working = basePayload;

      if (method === "insert" && !skipCheck) {
        const filtered: GoogleProduct[] = [];
        for (const item of working) {
          if (!item.communicateID) continue;
          try {
            const exists = await this.getGoogleProduct({
              communicateID: item.communicateID,
            });
            if (!exists) filtered.push(item);
          } catch (e) {
            this.log(
              `Lookup failed for ${item.communicateID}, attempting insert. ${e}`,
            );
            filtered.push(item);
          }
        }
        working = filtered;
        if (working.length === 0) return { status: "success" };
      }

      let entries: Array<Record<string, unknown>> = [];

      if (method === "insert") {
        const products = this.mapInsertProducts(working, brand);
        entries = products.map((product, i) => ({
          batchId: i + 1,
          merchantId: accountId,
          method,
          product,
        }));
      } else if (method === "update") {
        const products = this.mapUpdateProducts(working, brand);
        if (products.length === 0) return { status: "success" };
        entries = products.map(({ communicateID, product }, i) => ({
          batchId: i + 1,
          merchantId: accountId,
          method,
          productId: communicateID,
          product,
        }));
      } else if (method === "delete") {
        entries = working
          .filter((p) => !!p.communicateID)
          .map((p, i) => ({
            batchId: i + 1,
            merchantId: accountId,
            method,
            productId: this.googleContextString(p.communicateID),
          }));
      }

      if (entries.length === 0) return { status: "success" };

      const resp = await client.products.custombatch({
        requestBody: { entries },
      });

      if (resp.status !== 200)
        throw new Error(`Batch ${method} HTTP status ${resp.status}`);

      const perItemErrors = resp.data?.entries?.filter((e) => e.errors);
      if (perItemErrors && perItemErrors.length > 0) {
        this.error(
          `Google batch ${method} per-item errors`,
          perItemErrors.slice(0, 3),
        );
        return { status: "error", error: perItemErrors };
      }

      if (method !== "delete") {
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
            if (method === "update" && prevCommId && prevCommId !== newCommId) {
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
            await this.sendBatch({ ctx, method: "delete", data: toDelete });
          if (variants.length) await repo.save(variants, { chunk: 100 });
        }
      }
      this.log(
        `Google batch ${method} done (${resp.data?.entries?.length ?? entries.length} items)`,
      );
      return { status: "success" };
    } catch (e) {
      this.error(`Google batch ${method} failed`, e);
      return { status: "error", error: e };
    }
  }

  private async buildPayload(
    ctx: RequestContext,
    data: BaseProductData<BaseData>,
  ): Promise<GoogleProduct[]> {
    const payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
    return (payload ?? []).filter(
      (p): p is GoogleProduct => !!p && !!p.communicateID,
    );
  }

  private mapInsertProducts(payload: GoogleProduct[], brand: string) {
    return payload.map(({ communicateID, ...rest }) => ({
      offerId: communicateID.toString(),
      ...rest,
      ...this.googleContext,
      brand,
    }));
  }

  private mapUpdateProducts(
    payload: GoogleProduct[],
    brand: string,
  ): Array<{
    communicateID: string;
    product: Record<string, unknown>;
  }> {
    return payload
      .filter((p) => !!p.communicateID)
      .map(({ communicateID, ...rest }) => {
        delete rest.offerId;
        delete rest.feedLabel;
        delete rest.contentLanguage;
        delete rest.channel;
        delete (rest as any).variantID;
        const product = {
          ...rest,
          brand,
        };
        return {
          communicateID: this.googleContextString(communicateID),
          product,
        };
      });
  }

  async setGoogleSettings(rawSettings?: MerchantPlatformSettingsEntity) {
    let settings: MerchantPlatformSettingsEntity | null | undefined =
      rawSettings;
    if (!settings) {
      settings = await this.connection
        .getRepository(RequestContext.empty(), MerchantPlatformSettingsEntity)
        .findOne({ relations: ["entries"], where: { platform: "google" } });
    }
    if (!settings) return null;
    const getVal = (k: string) =>
      settings!.entries.find((e) => e.key === k)?.value;

    const autoUpdate = getVal("autoUpdate");
    const accountId = getVal("merchantId");
    const brand = getVal("brand") ?? "";
    let credentials = null;
    try {
      credentials = JSON.parse(getVal("credentials") ?? "null");
    } catch {
      this.log("Error parsing credentials");
      return null;
    }
    if (!accountId || !credentials || !brand) return null;
    return {
      autoUpdate: String(autoUpdate).toLowerCase() === "true",
      accountId,
      credentials,
      brand,
    };
  }
}
