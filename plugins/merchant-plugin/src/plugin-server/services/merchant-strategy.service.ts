import { Inject, Injectable } from "@nestjs/common";
import {
  BaseProductData,
  MerchantExportStrategy,
  MerchantPluginOptions,
} from "../types.js";
import { MERCHANT_PLUGIN_OPTIONS } from "../constants.js";
import { DefaultMerchantExportStrategy } from "../strategies/default-merchant-export-strategy.js";
import {
  Product,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";

@Injectable()
export class MerchantStrategyService {
  strategy: MerchantExportStrategy<BaseProductData<{ communicateID: string }>>;

  constructor(
    @Inject(MERCHANT_PLUGIN_OPTIONS)
    private readonly options: MerchantPluginOptions,
    private readonly connection: TransactionalConnection,
  ) {
    this.strategy = options?.strategy || new DefaultMerchantExportStrategy();
  }

  async getBaseData(ctx: RequestContext, product: Product) {
    return this.strategy.getBaseData(ctx, product);
  }

  async prepareGoogleProductPayload(
    ctx: RequestContext,
    product: BaseProductData<{ communicateID: string }>,
  ) {
    return this.strategy.prepareGoogleProductPayload(ctx, product);
  }

  async prepareFacebookProductPayload(
    ctx: RequestContext,
    product: BaseProductData<{ communicateID: string }>,
  ) {
    return this.strategy.prepareFacebookProductPayload(ctx, product);
  }
}
