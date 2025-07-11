import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { MerchantPluginOptions } from "../types.js";
import { MERCHANT_PLUGIN_OPTIONS } from "../constants.js";
import {
  EventBus,
  Product,
  ProductEvent,
  ProductService,
  ProductVariantEvent,
  RequestContext,
} from "@deenruv/core";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { PlatformIntegrationService } from "./platform-integration.service.js";

@Injectable()
export class SubscriberService implements OnApplicationBootstrap {
  constructor(
    @Inject(MERCHANT_PLUGIN_OPTIONS)
    private readonly options: MerchantPluginOptions,
    private readonly eventBus: EventBus,
    private readonly integrationService: PlatformIntegrationService,
    private readonly googleService: GooglePlatformIntegrationService,
    private readonly facebookService: FacebookPlatformIntegrationService,
    private readonly strategy: MerchantStrategyService,
    private readonly productService: ProductService
  ) {}

  async onApplicationBootstrap() {
    this.eventBus.ofType(ProductEvent).subscribe(async (props) => {
      await this.event(props);
    });
    this.eventBus
      .ofType(ProductVariantEvent)
      .subscribe(async ({ ctx, entity, type }) => {
        if (!entity || !entity.length) return;
        const product = await this.productService.findOne(
          ctx,
          entity[0].productId
        );
        if (!product) return;
        await this.event({ ctx, entity: product, type });
      });
  }

  async event({
    ctx,
    entity,
    type,
  }: {
    ctx: RequestContext;
    entity: Product;
    type: "created" | "updated" | "deleted";
  }) {
    if (!ctx || !entity || !(entity instanceof Product)) return;
    const { googleAutoUpdate, facebookAutoUpdate } =
      await this.integrationService.getPlatformAutoUpdateSettings(ctx);
    if (googleAutoUpdate || facebookAutoUpdate) {
      const data = await this.strategy.getBaseData(ctx, entity);
      if (!data) return;
      switch (type) {
        case "created":
          // * Google create
          if (googleAutoUpdate) {
            this.googleService.insertProduct({
              ctx,
              data,
              entity,
            });
          }
          // * Facebook create
          if (facebookAutoUpdate) {
            this.facebookService.createProduct({
              ctx,
              products: [data],
              entity,
            });
          }
          break;
        case "updated":
          if (googleAutoUpdate) {
            // * Google update if exists
            this.googleService.updateProduct({
              ctx,
              data,
              entity,
            });
          }

          // * Facebook update
          if (facebookAutoUpdate) {
            this.facebookService.updateProduct({
              ctx,
              productData: [data],
              entity,
            });
          }
          break;
        case "deleted":
          // * Google delete
          if (googleAutoUpdate) {
            this.googleService.deleteProduct({
              ctx,
              data,
              entity,
            });
          }

          // * Facebook delete
          if (facebookAutoUpdate) {
            this.facebookService.deleteProduct({
              ctx,
              productData: [data],
              entity,
            });
          }
          break;
      }
    }
  }
}
