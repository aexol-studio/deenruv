import { InjectableStrategy, Product, RequestContext } from "@deenruv/core";
import { content_v2_1 } from "googleapis";

export type BaseData = {
  communicateID: string;
  variantID: string | number;
};

export type BaseProductData<T extends BaseData> = Array<T>;

export type MerchantPluginOptions = {
  strategy?: MerchantExportStrategy<BaseProductData<any>>;
};

export type GoogleProduct = Omit<content_v2_1.Schema$Product, "brand"> &
  BaseData;

export type FacebookProduct = Record<string, unknown> & {
  communicateID: string;
  variantID: string | number;
};

export interface MerchantExportStrategy<T extends BaseProductData<any>>
  extends InjectableStrategy {
  getBaseData: (
    ctx: RequestContext,
    product: Product,
  ) => Promise<T | undefined>;
  prepareGoogleProductPayload: (
    ctx: RequestContext,
    data: T,
  ) => Promise<Array<GoogleProduct> | undefined>;
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

  interface CustomProductVariantFields {
    communicateID: string | null;
  }
}
