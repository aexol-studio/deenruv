import { Product, RequestContext } from "@deenruv/core";
import { BaseData, BaseProductData, MerchantExportStrategy } from "../types.js";

export class DefaultMerchantExportStrategy
  implements MerchantExportStrategy<BaseProductData<BaseData>>
{
  async prepareFacebookProductPayload(
    ctx: RequestContext,
    product: BaseProductData<BaseData>,
  ) {
    return undefined;
  }

  async prepareGoogleProductPayload(
    ctx: RequestContext,
    product: BaseProductData<BaseData>,
  ) {
    return undefined;
  }

  async getBaseData(ctx: RequestContext, product: Product) {
    return [
      {
        communicateID: product.id as string,
        variantID: product.variants?.[0]?.id,
        customFields: product.customFields,
        variants: undefined,
        title: product.name,
        description: product.description,
        slug: product.slug,
        asset:
          product.featuredAsset?.preview ?? product.assets?.[0]?.asset?.preview,
        price: product.variants?.[0]?.priceWithTax,
        currencyCode: product.variants?.[0]?.currencyCode,
        availability:
          product.variants?.[0]?.stockLevels?.[0].stockOnHand > 0
            ? "in stock"
            : "out of stock",
        colors: [],
        mpn: product.variants?.[0]?.sku,
      },
    ];
  }
}
