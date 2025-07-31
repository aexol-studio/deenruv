import { Injectable } from "@nestjs/common";
import {
  RequestContext,
  ID,
  TransactionalConnection,
  Logger,
  Product,
} from "@deenruv/core";
import { google } from "googleapis";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { BaseProductData, GoogleProduct } from "../types.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";

@Injectable()
export class GooglePlatformIntegrationService {
  private readonly SCOPES = ["https://www.googleapis.com/auth/content"];
  private readonly google_content_api_version = "v2.1";
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");

  private googleContext = {
    channel: "online",
    contentLanguage: "pl",
    feedLabel: "PL",
  };

  private googleContextString = (id: string) =>
    Object.values(this.googleContext)
      .map((value) => value)
      .join(":") + `:${id}`;

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly strategy: MerchantStrategyService,
  ) {}

  private async getAuthorization() {
    const settings = await this.setGoogleSettings();
    if (!settings) {
      throw new Error("Google platform settings not found");
    }
    const { accountId, credentials } = settings;
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: this.SCOPES,
    });
    const client = google.content({
      version: this.google_content_api_version,
      auth,
    });
    if (!client) {
      throw new Error("Content API client not found");
    }
    if (!accountId) {
      throw new Error("Merchant ID not found");
    }
    return { client, ...settings };
  }

  async getGoogleProduct({ communicateID }: { communicateID: string }) {
    const { accountId, client } = await this.getAuthorization();
    try {
      const response = await client.products.get({
        merchantId: accountId,
        productId: this.googleContextString(communicateID),
      });
      if (!response.data) return null;
      return response.data;
    } catch (e) {
      const error = e as { response: { status: number } } | Error;
      if ("response" in error && error.response.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async getProductCount(
    previousResult = 0,
    pageToken = "0",
  ): Promise<number | null> {
    try {
      const { accountId, client } = await this.getAuthorization();
      const response = await client.products.list({
        merchantId: accountId,
        maxResults: 250,
        pageToken,
      });
      if (!response.data) return null;
      if (response.data.nextPageToken) {
        return this.getProductCount(
          previousResult + (response.data.resources?.length ?? 0),
          response.data.nextPageToken,
        );
      }
      return previousResult + (response.data.resources?.length ?? 0);
    } catch {
      return null;
    }
  }

  async insertProduct<T extends { communicateID: string }>({
    ctx,
    data,
    entity,
    skipCheck,
  }: {
    ctx: RequestContext;
    data: BaseProductData<T>;
    entity: Product;
    skipCheck?: boolean;
  }): Promise<{
    status: "success" | "error";
    error?: unknown;
  }> {
    let payload: GoogleProduct[] | undefined;
    if (Array.isArray(data)) {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.flat().filter((item): item is GoogleProduct => !!item);
    } else {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.filter((item): item is GoogleProduct => !!item);
    }
    try {
      const { accountId, brand, client } = await this.getAuthorization();
      for (const item of payload || []) {
        if (!item.communicateID) continue;
        try {
          if (!skipCheck) {
            const product = await this.getGoogleProduct({
              communicateID: item.communicateID,
            });
            if (product) continue;
          }
          const productInput = await this.createProductInsertPayload({
            ctx,
            data,
            brand,
          });
          const batchResponse = await client.products.custombatch({
            requestBody: {
              entries: productInput?.map((input, index) => ({
                batchId: index + 1,
                merchantId: accountId,
                method: "insert",
                product: input,
              })),
            },
          });
          if (batchResponse.status !== 200) {
            throw new Error(
              "Error inserting product in Google Merchant Center",
            );
          }
          this.log(
            `Product inserted to Google Merchant Center, ID: ${item.communicateID}`,
          );
        } catch (error) {
          this.log("Error inserting product in Google Merchant Center" + error);
        }
      }
      return { status: "success" };
    } catch (error) {
      return { status: "error", error };
    }
  }

  async updateProduct({
    ctx,
    data,
    entity,
  }: {
    ctx: RequestContext;
    data: BaseProductData<{ communicateID: string }>;
    entity: Product;
  }) {
    let payload: GoogleProduct[] | undefined;
    if (Array.isArray(data)) {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.flat().filter((item): item is GoogleProduct => !!item);
    } else {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.filter((item): item is GoogleProduct => !!item);
    }
    const { accountId, brand, client } = await this.getAuthorization();
    for (const item of payload || []) {
      if (!item.communicateID) continue;
      try {
        const product = await this.getGoogleProduct({
          communicateID: item.communicateID,
        });
        if (!product) {
          await this.insertProduct({ ctx, data, entity, skipCheck: true });
          return { status: "success", ids: [] };
        }
        const productInput = await this.createProductUpdatePayload({
          ctx,
          data,
          brand,
        });
        const batchResponse = await client.products.custombatch({
          requestBody: {
            entries: productInput?.map(({ communicateID, ...rest }, index) => {
              return {
                batchId: index + 1,
                merchantId: accountId,
                method: "update",
                product: rest,
                productId: communicateID,
              };
            }),
          },
        });
        if (batchResponse.status !== 200) {
          throw new Error("Error updating product in Google Merchant Center");
        }
        this.log(`Product updated on Google Merchant Center.`);
        const haveErrors = batchResponse.data?.entries?.some(
          (entry) => entry.errors,
        );
        if (haveErrors) {
          this.log(`Error updating product in Google Merchant Center`);
          return { status: "error", ids: [] };
        }
        return { status: "success", ids: [] };
      } catch (error) {
        this.log("Error updating product in Google Merchant Center" + error);
        return { status: "error", productId: `data.communicateID`, error };
      }
    }
  }

  async deleteProduct({
    ctx,
    data,
    entity,
  }: {
    ctx: RequestContext;
    data: BaseProductData<{ communicateID: string }>;
    entity: Product;
  }) {
    let payload: GoogleProduct[] | undefined;
    if (Array.isArray(data)) {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.flat().filter((item): item is GoogleProduct => !!item);
    } else {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.filter((item): item is GoogleProduct => !!item);
    }
    try {
      const { accountId, client } = await this.getAuthorization();
      const batchResponse = await client.products.custombatch({
        requestBody: {
          entries: payload?.map(({ communicateID }, index) => ({
            batchId: index + 1,
            merchantId: accountId,
            method: "delete",
            productId: communicateID,
          })),
        },
      });
      if (batchResponse.status !== 200) {
        throw new Error("Error deleting product in Google Merchant Center");
      }
      this.log("Product deleted from Google Merchant Center");
      return { status: "success" };
    } catch (error) {
      return { status: "error", error };
    }
  }

  async batchProductsAction({
    ctx,
    products,
  }: {
    ctx: RequestContext;
    products: BaseProductData<{ communicateID: string }>[];
  }) {
    try {
      const { accountId, brand, client } = await this.getAuthorization();
      const batchProductsPayload = await Promise.all(
        products.map((data) =>
          this.createProductInsertPayload({ ctx, data, brand }),
        ),
      ).then((data) => data.flat());
      const batchResponse = await client.products.custombatch({
        requestBody: {
          entries: batchProductsPayload
            .filter((item) => !!item)
            .map((input, index) => ({
              batchId: index + 1,
              merchantId: accountId,
              method: "insert",
              product: input,
            })),
        },
      });
      if (batchResponse.status !== 200) {
        throw new Error(`Error inserting product in Google Merchant Center`);
      }

      this.log(
        `Products (${batchResponse.data?.entries?.length}) sended to Google Merchant Center with batch method`,
      );
      return { status: "success" };
    } catch (e) {
      this.log("Error inserting products in Google Merchant Center");
      return { status: "error" };
    }
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
    const autoUpdate = settings.entries.find(
      (entry) => entry.key === "autoUpdate",
    )?.value;
    const accountId = settings.entries.find(
      (entry) => entry.key === "merchantId",
    )?.value;
    const brand =
      settings.entries.find((entry) => entry.key === "brand")?.value ?? "";

    let credentials = null;
    try {
      credentials = JSON.parse(
        settings.entries.find((entry) => entry.key === "credentials")?.value ??
          "null",
      );
    } catch (e) {
      this.log("Error parsing credentials");
      return null;
    }

    if (!accountId || !credentials || !brand) return null;
    return {
      autoUpdate: autoUpdate === "true",
      accountId,
      credentials,
      brand,
    };
  }

  private async createProductInsertPayload({
    ctx,
    data,
    brand,
  }: {
    ctx: RequestContext;
    data: BaseProductData<{ communicateID: string }>;
    brand: string;
  }) {
    let payload: GoogleProduct[] | undefined;
    if (Array.isArray(data)) {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.flat().filter((item): item is GoogleProduct => !!item);
    } else {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.filter((item): item is GoogleProduct => !!item);
    }
    return payload?.map(({ communicateID, ...item }) => {
      return {
        offerId: communicateID?.toString(),
        ...item,
        ...this.googleContext,
        brand,
      };
    });
  }

  private async createProductUpdatePayload({
    ctx,
    data,
    brand,
  }: {
    ctx: RequestContext;
    data: BaseProductData<{ communicateID: string }>;
    brand: string;
  }) {
    let payload: GoogleProduct[] | undefined;
    if (Array.isArray(data)) {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.flat().filter((item): item is GoogleProduct => !!item);
    } else {
      payload = await this.strategy.prepareGoogleProductPayload(ctx, data);
      payload = payload?.filter((item): item is GoogleProduct => !!item);
    }

    const items = [];
    for (const item of payload || []) {
      if (!item.communicateID) continue;
      if (item?.offerId) delete item.offerId;
      if (item?.feedLabel) delete item.feedLabel;
      if (item?.contentLanguage) delete item.contentLanguage;
      if (item?.channel) delete item.channel;
      if ("productId" in item) delete item.productId;
      items.push({
        ...item,
        brand,
        communicateID: this.googleContextString(item.communicateID),
      });
    }
    return items;
  }
}
