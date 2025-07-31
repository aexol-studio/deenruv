import { InjectableStrategy, Product, RequestContext } from "@deenruv/core";
import { content_v2_1 } from "googleapis";

export type BaseProductData<T extends { communicateID: string }> = T | Array<T>;

export type MerchantPluginOptions = {
  strategy?: MerchantExportStrategy<BaseProductData<{ communicateID: string }>>;
};

export type GoogleProduct = Omit<content_v2_1.Schema$Product, "brand"> & {
  communicateID?: string;
};

export type FacebookProduct = Record<string, any> & {
  communicateID?: string;
};

export interface MerchantExportStrategy<
  T extends BaseProductData<{ communicateID: string }>,
> extends InjectableStrategy {
  /**
   * Get base product data, this function should return object that contains productId and customFields
   * however you can extend this object with additional fields if needed and fetch as much data as you need
   * returned object will be passed to strategy functions.
   * @param ctx - RequestContext
   * @param product - Product
   * @returns T | undefined
   */
  getBaseData: (
    ctx: RequestContext,
    product: Product,
  ) => Promise<T | undefined>;
  /**
   * Prepare Google product payload, this function should return object/objects that are compatible with Google Merchant API
   * things like offerId, itemGroupId, channel, feedLabel, contentLanguage and brand will be provided by the strategy.
   * @param ctx - RequestContext
   * @param product - ProductData - this product comes from `getBaseProductData` function
   * @returns GoogleProduct[] | undefined
   */
  prepareGoogleProductPayload: (
    ctx: RequestContext,
    data: T,
  ) => Promise<Array<GoogleProduct> | undefined>;
  /**
   * Prepare Facebook product payload, this function should return object/objects that are compatible with Facebook Marketing API
   *
   * @param ctx - RequestContext
   * @param product - ProductData - this product comes from `getBaseProductData` function
   * @returns FacebookProduct[] | undefined
   */
  prepareFacebookProductPayload: (
    ctx: RequestContext,
    data: T,
  ) => Promise<Array<FacebookProduct> | undefined>;
}

declare module "@deenruv/core" {
  interface CustomProductFields {
    seoTitle: string | null;
    seoDescription: string | null;
  }
}
