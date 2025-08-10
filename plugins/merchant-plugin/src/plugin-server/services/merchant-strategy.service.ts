import { Inject, Injectable } from "@nestjs/common";
import {
  BaseData,
  BaseProductData,
  MerchantExportStrategy,
  MerchantPluginOptions,
} from "../types.js";
import { MERCHANT_PLUGIN_OPTIONS } from "../constants.js";
import { DefaultMerchantExportStrategy } from "../strategies/default-merchant-export-strategy.js";
import { Product, RequestContext } from "@deenruv/core";

@Injectable()
export class MerchantStrategyService {
  strategy: MerchantExportStrategy<BaseProductData<BaseData>>;

  constructor(
    @Inject(MERCHANT_PLUGIN_OPTIONS)
    private readonly options: MerchantPluginOptions,
  ) {
    this.strategy = options?.strategy || new DefaultMerchantExportStrategy();
  }

  async getBaseData(ctx: RequestContext, product: Product) {
    return this.strategy.getBaseData(ctx, product);
  }

  async prepareGoogleProductPayload(
    ctx: RequestContext,
    product: BaseProductData<BaseData>,
  ) {
    return this.strategy.prepareGoogleProductPayload(ctx, product);
  }

  async prepareFacebookProductPayload(
    ctx: RequestContext,
    product: BaseProductData<BaseData>,
  ) {
    return this.strategy.prepareFacebookProductPayload(ctx, product);
  }
}
