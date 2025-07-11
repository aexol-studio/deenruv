import { Injectable } from "@nestjs/common";
import {
  RequestContext,
  CustomerService,
  TransactionalConnection,
  Logger,
} from "@deenruv/core";
import { ProductCatalog, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { BaseProductData } from "../types.js";
import { Product } from "@deenruv/core";

@Injectable()
export class FacebookPlatformIntegrationService {
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");

  constructor(
    readonly customerService: CustomerService,
    private connection: TransactionalConnection,
  ) {
    this.setFacebookSettings();
  }

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

      const bathPayload = products.flatMap((product) => {
        return this.prepareFacebookProductPayload({
          method: "CREATE",
          productData: product,
          brand,
        });
      });

      const bathResult = await productCatalog.createBatch([], {
        requests: bathPayload,
      });

      this.log("Product created on Facebook");
      return { status: "success" };
    } catch (error) {
      // console.log("error", error);
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

      const bathPayload = productData.flatMap((product) => {
        return this.prepareFacebookProductPayload({
          method: "UPDATE",
          productData: product,
          brand,
        });
      });

      const bathResult = await productCatalog.createBatch([], {
        requests: bathPayload,
      });

      this.log("Product updated to Facebook");
      return { status: "success" };
    } catch (error) {
      // console.log("error", error);
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

      const bathPayload = productData.flatMap((product) => {
        return this.prepareFacebookProductPayload({
          method: "DELETE",
          productData: product,
          brand,
        });
      });

      const bathResult = await productCatalog.createBatch([], {
        requests: bathPayload,
      });

      this.log("Product deleted from Facebook");
      return { status: "success" };
    } catch (error) {
      // console.log("error", error);
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
      // console.log("error on get facebook product counts", error);
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

    const accessToken = settings.entries.find(
      (entry) => entry.key === "accessToken",
    )?.value;

    const catalogId = settings.entries.find(
      (entry) => entry.key === "catalogId",
    )?.value;

    const brand =
      settings.entries.find((entry) => entry.key === "brand")?.value ?? "";

    if (!accessToken || !catalogId || !brand) return null;

    return {
      autoUpdate: autoUpdate === "true",
      accessToken,
      catalogId,
      brand,
    };
  }

  private prepareFacebookProductPayload({
    method,
    productData,
    brand,
  }: {
    method: "CREATE" | "UPDATE" | "DELETE";
    productData: BaseProductData<{ communicateID: string }>;
    brand: string;
  }) {
    if (Array.isArray(productData)) {
      return [];
    } else {
      const { communicateID } = productData;

      return [
        {
          retailer_id: `${communicateID}`,
          method,
          data:
            method === "DELETE"
              ? {}
              : JSON.stringify({
                  retailer_product_group_id: communicateID,
                  brand,
                }),
        },
      ];
    }
  }
}
