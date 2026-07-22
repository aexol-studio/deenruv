import { InjectableStrategy, Product, RequestContext } from "@deenruv/core";
import type { protos } from "@google-shopping/products";

export type BaseData = {
  communicateID: string;
  variantID: string | number;
};

export type BaseProductData<T extends BaseData> = Array<T>;

export type MerchantPluginOptions = {
  strategy?: MerchantExportStrategy<BaseProductData<BaseData>>;
};

export type GoogleProductInput =
  protos.google.shopping.merchant.products.v1.IProductInput;

export type GoogleProcessedProduct =
  protos.google.shopping.merchant.products.v1.IProduct;

export type GoogleProduct = BaseData & {
  productAttributes: NonNullable<GoogleProductInput["productAttributes"]>;
  customAttributes?: GoogleProductInput["customAttributes"];
  versionNumber?: GoogleProductInput["versionNumber"];
};

export type RemoteProduct = Pick<BaseData, "communicateID"> & {
  name?: string;
};

export type FacebookProduct = Record<string, unknown> & {
  communicateID: string;
  variantID: string | number;
};

export interface MerchantExportStrategy<
  T extends BaseProductData<BaseData>,
> extends InjectableStrategy {
  getBaseData(ctx: RequestContext, product: Product): Promise<T | undefined>;
  prepareGoogleProductPayload(
    ctx: RequestContext,
    data: T,
  ): Promise<Array<GoogleProduct> | undefined>;
  prepareFacebookProductPayload(
    ctx: RequestContext,
    data: T,
  ): Promise<Array<FacebookProduct> | undefined>;
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
