import {
  CreateProductInput,
  CreateProductVariantInput,
  UpdateProductInput,
  UpdateProductVariantInput,
} from "@deenruv/common/src/generated-types.js";
import {
  EventBus,
  ID,
  Product,
  ProductEvent,
  ProductService,
  ProductVariantEvent,
  RequestContext,
} from "@deenruv/core";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { MERCHANT_PLUGIN_OPTIONS } from "../constants.js";
import { MerchantPluginOptions } from "../types.js";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { PlatformIntegrationService } from "./platform-integration.service.js";

type ProductInputTypes = CreateProductInput | UpdateProductInput | ID;
type ProductVariantInputTypes =
  | CreateProductVariantInput[]
  | UpdateProductVariantInput[]
  | ID
  | ID[];

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
    private readonly productService: ProductService,
  ) {}

  async onApplicationBootstrap() {
    this.eventBus.ofType(ProductEvent).subscribe(async (props) => {
      await this.event(props);
    });
    this.eventBus
      .ofType(ProductVariantEvent)
      .subscribe(async ({ ctx, entity, type, input }) => {
        if (!entity || !entity.length) return;
        const product = await this.productService.findOne(
          ctx,
          entity[0].productId,
        );
        if (!product) return;
        await this.event({ ctx, entity: product, type, input });
      });
  }

  async event({
    ctx,
    entity,
    type,
    input,
  }: {
    ctx: RequestContext;
    entity: Product;
    type: "created" | "updated" | "deleted";
    input?: ProductInputTypes | ProductVariantInputTypes;
  }) {
    if (!this.isValidEventData(ctx, entity)) return;
    const { googleAutoUpdate, facebookAutoUpdate } =
      await this.integrationService.getPlatformAutoUpdateSettings(ctx);
    if (!googleAutoUpdate && !facebookAutoUpdate) return;
    const data = await this.strategy.getBaseData(ctx, entity);
    if (!data) return;
    const operations = this.getOperationsForType(type);
    const eventPayload = { ctx, data, entity };
    await Promise.allSettled([
      ...(googleAutoUpdate
        ? [this.googleService[operations.google](eventPayload)]
        : []),
      ...(facebookAutoUpdate
        ? [this.facebookService[operations.facebook](eventPayload)]
        : []),
    ]);
  }

  private isValidEventData(ctx: RequestContext, entity: Product): boolean {
    return Boolean(ctx && entity && entity instanceof Product);
  }

  private getOperationsForType(type: "created" | "updated" | "deleted") {
    const operationMap = {
      created: { google: "insertProduct", facebook: "createProduct" },
      updated: { google: "updateProduct", facebook: "updateProduct" },
      deleted: { google: "deleteProduct", facebook: "deleteProduct" },
    } as const;

    return operationMap[type];
  }
}
