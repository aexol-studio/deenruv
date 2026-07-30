import {
  Logger,
  Product,
  ProductVariant,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { Injectable } from "@nestjs/common";
import { In } from "typeorm";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import {
  BaseData,
  BaseProductData,
  GoogleProcessedProduct,
  GoogleProduct,
  RemoteProduct,
} from "../types.js";
import {
  buildGoogleProductName,
  collectGoogleProductsForDataSource,
  createGoogleDeleteOperation,
  diagnoseGoogleMerchantConnection,
  createGoogleInsertOperation,
  createGoogleMerchantClients,
  createGoogleUpdateOperation,
  executeGoogleWriteOperations,
  GoogleMerchantClients,
  GoogleMerchantSettings,
  GoogleWriteOperation,
  MerchantOperationResult,
  normalizeGoogleMerchantError,
  parseGoogleMerchantSettings,
  summarizeMerchantOperations,
  validateGoogleProductUrls,
} from "./google-merchant-api.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";

type GMethod = "insert" | "update" | "delete";
export type GoogleWriteResult = MerchantOperationResult<GoogleWriteOperation>;
export type GoogleOperationResult = {
  error?: unknown;
  results: GoogleWriteResult[];
  status: "success" | "error";
};

class GoogleMerchantOperationError extends Error {
  constructor(method: GMethod, results: GoogleWriteResult[]) {
    const failedIds = results
      .filter((result) => result.status === "error")
      .map((result) => result.item.communicateID)
      .join(", ");
    super(`Google ${method} failed for: ${failedIds || "unknown product"}`);
    this.name = "GoogleMerchantOperationError";
  }
}

@Injectable()
export class GooglePlatformIntegrationService {
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

  async removeOrphanItems(ctx: RequestContext, items: RemoteProduct[]) {
    if (items.length === 0) return;
    const authorization = await this.getAuthorization(ctx);
    try {
      const operations = items.map((item) =>
        createGoogleDeleteOperation(
          item.communicateID,
          authorization.settings,
        ),
      );
      const results = await executeGoogleWriteOperations(
        authorization.clients.productInputs,
        operations,
      );
      const summary = summarizeMerchantOperations(results);
      if (summary.status === "error") {
        throw new GoogleMerchantOperationError("delete", results);
      }
    } finally {
      await this.closeClients(authorization.clients);
    }
  }

  async getAllProducts(ctx: RequestContext): Promise<RemoteProduct[]> {
    const authorization = await this.getAuthorization(ctx);
    try {
      return await collectGoogleProductsForDataSource(
        authorization.clients.products,
        authorization.settings.accountId,
        authorization.settings.dataSource,
      );
    } catch (error) {
      this.error("Failed to retrieve products from Google", error);
      throw error;
    } finally {
      await this.closeClients(authorization.clients);
    }
  }

  async getConnectionDiagnostic(ctx: RequestContext) {
    const rawSettings = await this.connection
      .getRepository(ctx, MerchantPlatformSettingsEntity)
      .findOne({ relations: ["entries"], where: { platform: "google" } });
    const checkedAt = new Date().toISOString();
    const emptyDiagnostic = {
      checkedAt,
      dataSourceVerified: false,
      disapprovedProductsCount: 0,
      issues: [],
      issuesCount: 0,
      latencyMs: 0,
      productsCount: 0,
    };
    if (!rawSettings) {
      return {
        ...emptyDiagnostic,
        connectionStatus: "NOT_CONFIGURED" as const,
      };
    }

    let settings: GoogleMerchantSettings;
    try {
      settings = this.validateGoogleSettings(rawSettings);
    } catch (error) {
      const normalized = normalizeGoogleMerchantError(error);
      return {
        ...emptyDiagnostic,
        connectionStatus: "INVALID_CONFIGURATION" as const,
        lastError: {
          code: "INVALID_CONFIGURATION",
          message: normalized.message,
          retryable: false,
        },
      };
    }

    const clients = createGoogleMerchantClients(settings.credentials);
    try {
      return await diagnoseGoogleMerchantConnection(
        clients.products,
        settings,
        clients.dataSources,
      );
    } finally {
      await this.closeClients(clients);
    }
  }

  async getGoogleProduct(
    ctx: RequestContext,
    { communicateID }: { communicateID: string },
  ): Promise<GoogleProcessedProduct | null> {
    const authorization = await this.getAuthorization(ctx);
    try {
      const [product] = await authorization.clients.products.getProduct({
        name: buildGoogleProductName(
          authorization.settings.accountId,
          communicateID,
          authorization.settings.contentLanguage,
          authorization.settings.feedLabel,
        ),
      });
      return product ?? null;
    } catch (error) {
      if (this.isNotFoundError(error)) return null;
      throw error;
    } finally {
      await this.closeClients(authorization.clients);
    }
  }

  async insertProduct<T extends BaseData>(opts: {
    ctx: RequestContext;
    data: BaseProductData<T>;
    entity: Product;
  }): Promise<GoogleOperationResult> {
    return this.sendProducts({ ...opts, method: "insert" });
  }

  async updateProduct(opts: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity: Product;
  }): Promise<GoogleOperationResult> {
    return this.sendProducts({ ...opts, method: "update" });
  }

  async deleteProduct(opts: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    entity: Product;
  }): Promise<GoogleOperationResult> {
    return this.sendProducts({ ...opts, method: "delete" });
  }

  async deleteProductsByCommunicationIds(
    ctx: RequestContext,
    communicateIds: string[],
  ): Promise<GoogleOperationResult> {
    const uniqueIds = [...new Set(communicateIds.filter(Boolean))];
    if (uniqueIds.length === 0) return { results: [], status: "success" };
    let authorization:
      | Awaited<ReturnType<GooglePlatformIntegrationService["getAuthorization"]>>
      | undefined;
    let results: GoogleWriteResult[] = [];
    try {
      authorization = await this.getAuthorization(ctx);
      const operations = uniqueIds.map((communicateID) =>
        createGoogleDeleteOperation(communicateID, authorization!.settings),
      );
      results = await executeGoogleWriteOperations(
        authorization.clients.productInputs,
        operations,
      );
      const summary = summarizeMerchantOperations(results);
      if (summary.status === "error") {
        return {
          error: new GoogleMerchantOperationError("delete", results),
          results,
          status: "error",
        };
      }
      return { results, status: "success" };
    } catch (error) {
      this.error("Google delete failed", error);
      return { error, results, status: "error" };
    } finally {
      if (authorization) await this.closeClients(authorization.clients);
    }
  }

  async batchProductsAction(opts: {
    ctx: RequestContext;
    products: BaseProductData<BaseData>[];
  }): Promise<GoogleOperationResult> {
    const { ctx, products } = opts;
    try {
      const payload: GoogleProduct[] = [];
      for (const product of products) {
        payload.push(...(await this.buildPayload(ctx, product)));
      }
      return await this.sendPreparedProducts(ctx, "insert", payload);
    } catch (error) {
      this.error("Google bulk insert failed", error);
      return { error, results: [], status: "error" };
    }
  }

  private async sendProducts(opts: {
    ctx: RequestContext;
    data: BaseProductData<BaseData>;
    method: GMethod;
  }): Promise<GoogleOperationResult> {
    const { ctx, method, data } = opts;
    try {
      const payload = await this.buildPayload(ctx, data);
      return await this.sendPreparedProducts(ctx, method, payload);
    } catch (error) {
      this.error(`Google ${method} failed`, error);
      return { error, results: [], status: "error" };
    }
  }

  private async sendPreparedProducts(
    ctx: RequestContext,
    method: GMethod,
    payload: GoogleProduct[],
  ): Promise<GoogleOperationResult> {
    if (payload.length === 0) {
      return { results: [], status: "success" };
    }

    const authorization = await this.getAuthorization(ctx);
    let results: GoogleWriteResult[] = [];
    try {
      const operations = this.createOperations(
        method,
        payload,
        authorization.settings,
      );
      results = await executeGoogleWriteOperations(
        authorization.clients.productInputs,
        operations,
      );

      if (method !== "delete") {
        const successfulIds = new Set(
          results
            .filter((result) => result.status === "success")
            .map((result) => result.item.communicateID),
        );
        const successfulProducts = payload.filter((product) =>
          successfulIds.has(String(product.communicateID)),
        );
        const previousIds = await this.persistCommunicationIds(
          ctx,
          successfulProducts,
        );
        if (previousIds.length > 0) {
          const cleanupOperations = previousIds.map((communicateID) =>
            createGoogleDeleteOperation(
              communicateID,
              authorization.settings,
            ),
          );
          const cleanupResults = await executeGoogleWriteOperations(
            authorization.clients.productInputs,
            cleanupOperations,
          );
          results.push(...cleanupResults);
        }
      }

      const summary = summarizeMerchantOperations(results);
      const succeeded = results.length - summary.failures.length;
      this.log(
        `Google ${method} completed (${succeeded}/${results.length} successful)`,
      );
      if (summary.status === "error") {
        const error = new GoogleMerchantOperationError(method, results);
        this.error(error.message, error);
        return { error, results, status: "error" };
      }
      return { results, status: "success" };
    } catch (error) {
      this.error(`Google ${method} failed`, error);
      return { error, results, status: "error" };
    } finally {
      await this.closeClients(authorization.clients);
    }
  }

  private createOperations(
    method: GMethod,
    payload: GoogleProduct[],
    settings: GoogleMerchantSettings,
  ): GoogleWriteOperation[] {
    if (method === "insert") {
      return payload.map((product) =>
        createGoogleInsertOperation(product, settings),
      );
    }
    if (method === "update") {
      return payload.map((product) =>
        createGoogleUpdateOperation(product, settings),
      );
    }
    return payload.map((product) =>
      createGoogleDeleteOperation(String(product.communicateID), settings),
    );
  }

  private async persistCommunicationIds(
    ctx: RequestContext,
    products: GoogleProduct[],
  ): Promise<string[]> {
    const items = products.filter((product) => product.variantID !== undefined);
    const ids = [...new Set(items.map((item) => String(item.variantID)))];
    if (ids.length === 0) return [];

    const repository = this.connection.getRepository(ctx, ProductVariant);
    const variants = await repository.find({ where: { id: In(ids) } });
    const variantMap = new Map(
      variants.map((variant) => [String(variant.id), variant]),
    );
    const previousIds = new Set<string>();
    for (const item of items) {
      const variant = variantMap.get(String(item.variantID));
      if (!variant) continue;
      const nextId = String(item.communicateID);
      const previousId = variant.customFields?.communicateID;
      if (previousId && previousId !== nextId) {
        previousIds.add(previousId);
      }
      variant.customFields = {
        ...variant.customFields,
        communicateID: nextId,
      };
    }
    if (variants.length > 0) {
      await repository.save(variants, { chunk: 100 });
    }
    return [...previousIds];
  }

  private async buildPayload(
    ctx: RequestContext,
    data: BaseProductData<BaseData>,
  ): Promise<GoogleProduct[]> {
    const payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
    const validPayload = (payload ?? []).filter(
      (product): product is GoogleProduct =>
        Boolean(
          product &&
            String(product.communicateID).length > 0 &&
            product.productAttributes,
        ),
    );
    for (const product of validPayload) validateGoogleProductUrls(product);
    return validPayload;
  }

  validateGoogleSettings(
    rawSettings: MerchantPlatformSettingsEntity,
  ): GoogleMerchantSettings {
    return parseGoogleMerchantSettings(rawSettings.entries);
  }

  async setGoogleSettings(
    ctx: RequestContext,
    rawSettings?: MerchantPlatformSettingsEntity,
  ): Promise<GoogleMerchantSettings | null> {
    let settings: MerchantPlatformSettingsEntity | null | undefined =
      rawSettings;
    if (!settings) {
      settings = await this.connection
        .getRepository(ctx, MerchantPlatformSettingsEntity)
        .findOne({ relations: ["entries"], where: { platform: "google" } });
    }
    return settings ? this.validateGoogleSettings(settings) : null;
  }

  private async getAuthorization(ctx: RequestContext) {
    const settings = await this.setGoogleSettings(ctx);
    if (!settings) throw new Error("Google platform settings not found");
    return {
      clients: createGoogleMerchantClients(settings.credentials),
      settings,
    };
  }

  private async closeClients(clients: GoogleMerchantClients): Promise<void> {
    for (const client of [
      clients.products,
      clients.productInputs,
      clients.dataSources,
    ]) {
      try {
        await client.close();
      } catch (error) {
        this.error("Failed to close Google Merchant API client", error);
      }
    }
  }

  private isNotFoundError(error: unknown): boolean {
    if (typeof error !== "object" || error === null) return false;
    const candidate = error as {
      code?: number | string;
      response?: { status?: number };
    };
    return (
      candidate.code === 5 ||
      candidate.code === 404 ||
      candidate.code === "404" ||
      candidate.response?.status === 404
    );
  }
}
