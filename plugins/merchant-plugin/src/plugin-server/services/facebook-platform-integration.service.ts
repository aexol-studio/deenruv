import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection, Logger } from "@deenruv/core";
import { ProductCatalog, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { BaseProductData } from "../types.js";
import { Product } from "@deenruv/core";
import { MerchantStrategyService } from "./merchant-strategy.service.js";

@Injectable()
export class FacebookPlatformIntegrationService {
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly strategy: MerchantStrategyService,
  ) {}

  async createProduct({
    ctx,
    products,
    entity,
  }: {
    ctx: RequestContext;
    products: BaseProductData<{ communicateID: string }>[];
    entity?: Product;
  }): Promise<{
    status: "success" | "error";
  }> {
    try {
      const settings = await this.setFacebookSettings();
      if (!settings) throw new Error("Facebook platform settings not found");
      const { accessToken, catalogId, brand } = settings;
      FacebookAdsApi.init(accessToken);
      const productCatalog = new ProductCatalog(catalogId);
      const requests = await Promise.all(
        products.map((productData) =>
          this.prepareFacebookProductPayload({
            ctx,
            method: "CREATE",
            productData,
            brand,
          }),
        ),
      );
      const response = await productCatalog.createBatch([], {
        requests: requests.flat(),
      });
      this.log("Product created on Facebook");
      console.dir(response, { depth: null });
      return { status: "success" };
    } catch (error) {
      this.log("Error creating product on Facebook");
      return { status: "error" };
    }
  }

  async updateProduct({
    ctx,
    productData,
    entity,
  }: {
    ctx: RequestContext;
    productData: BaseProductData<{ communicateID: string }>[];
    entity?: Product;
  }): Promise<{
    status: "success" | "error";
  }> {
    try {
      const settings = await this.setFacebookSettings();
      if (!settings) throw new Error("Facebook platform settings not found");
      const { accessToken, catalogId, brand } = settings;
      FacebookAdsApi.init(accessToken);
      const productCatalog = new ProductCatalog(catalogId);
      const requests = await Promise.all(
        productData.map((product) =>
          this.prepareFacebookProductPayload({
            ctx,
            method: "UPDATE",
            productData: product,
            brand,
          }),
        ),
      );
      const response = await productCatalog.createBatch([], {
        requests: requests.flat(),
      });
      this.log("Product updated to Facebook");
      console.dir(response, { depth: null });
      return { status: "success" };
    } catch (error) {
      this.log("Error updating product to Facebook");
      return { status: "error" };
    }
  }

  async deleteProduct({
    ctx,
    productData,
    entity,
  }: {
    ctx: RequestContext;
    productData: BaseProductData<{ communicateID: string }>[];
    entity?: Product;
  }): Promise<{
    status: "success" | "error";
  }> {
    try {
      const settings = await this.setFacebookSettings();
      if (!settings) throw new Error("Facebook platform settings not found");
      const { accessToken, catalogId, brand } = settings;
      FacebookAdsApi.init(accessToken);
      const productCatalog = new ProductCatalog(catalogId);
      const requests = await Promise.all(
        productData.flatMap((product) =>
          this.prepareFacebookProductPayload({
            ctx,
            method: "DELETE",
            productData: product,
            brand,
          }),
        ),
      );
      await productCatalog.createBatch([], { requests });
      this.log("Product deleted from Facebook");
      return { status: "success" };
    } catch (error) {
      this.log("Error deleting product from Facebook");
      return { status: "error" };
    }
  }

  async getProductsCount(): Promise<number | null> {
    try {
      const settings = await this.setFacebookSettings();
      if (!settings) throw new Error("Facebook platform settings not found");
      const { accessToken, catalogId } = settings;
      FacebookAdsApi.init(accessToken);
      const productCatalog = new ProductCatalog(catalogId);
      const groupsData = await productCatalog.getProductGroups(
        [ProductCatalog.Fields.product_count, ProductCatalog.Fields.name],
        { summary: true },
      );
      return groupsData?.summary?.total_count ?? 0;
    } catch (error) {
      this.log("Error getting Facebook product counts");
      return null;
    }
  }

  async setFacebookSettings(rawSettings?: MerchantPlatformSettingsEntity) {
    let settings: MerchantPlatformSettingsEntity | null | undefined =
      rawSettings;
    if (!settings) {
      settings = await this.connection
        .getRepository(RequestContext.empty(), MerchantPlatformSettingsEntity)
        .findOne({
          relations: ["entries"],
          where: { platform: "facebook" },
        });
    }
    if (!settings) return null;
    const autoUpdate = settings.entries.find(
      (entry) => entry.key === "autoUpdate",
    )?.value;
    const credentials = settings.entries.find(
      (entry) => entry.key === "credentials",
    )?.value;
    const merchantId = settings.entries.find(
      (entry) => entry.key === "merchantId",
    )?.value;
    const brand =
      settings.entries.find((entry) => entry.key === "brand")?.value ?? "";
    if (!credentials || !merchantId || !brand) return null;
    return {
      autoUpdate: autoUpdate === "true",
      accessToken: credentials,
      catalogId: merchantId,
      brand,
    };
  }

  private async prepareFacebookProductPayload({
    ctx,
    method,
    productData,
    brand,
  }: {
    ctx: RequestContext;
    method: string;
    productData: BaseProductData<{ communicateID: string }>;
    brand: string;
  }) {
    if (method === "DELETE") {
      if (Array.isArray(productData)) {
        return productData.map(({ communicateID }) => ({
          retailer_id: `${communicateID}`,
          method,
          data: {},
        }));
      } else {
        const { communicateID } = productData;
        return [{ retailer_id: `${communicateID}`, method, data: {} }];
      }
    }

    const products = await this.strategy.prepareFacebookProductPayload(
      ctx,
      productData,
    );
    return products?.map(({ communicateID, ...product }) => ({
      retailer_id: `${communicateID}`,
      method,
      data: {
        ...product,
        brand: "brand" in product && product.brand ? product.brand : brand,
      },
    }));
  }
}
