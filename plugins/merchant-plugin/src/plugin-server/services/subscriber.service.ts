import {
  CreateProductInput,
  CreateProductVariantInput,
  UpdateProductInput,
  UpdateProductVariantInput,
} from "@deenruv/common/lib/generated-types.js";
import {
  EventBus,
  ID,
  JobQueue,
  JobQueueService,
  Logger,
  Product,
  ProductEvent,
  ProductService,
  ProductVariant,
  ProductVariantEvent,
  RequestContext,
  SerializedRequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { MERCHANT_PLUGIN_OPTIONS } from "../constants.js";
import { MerchantPluginOptions } from "../types.js";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { MerchantSyncHistoryService } from "./merchant-sync-history.service.js";
import { PlatformIntegrationService } from "./platform-integration.service.js";

type ProductInputTypes = CreateProductInput | UpdateProductInput | ID;
type ProductVariantInputTypes =
  | CreateProductVariantInput[]
  | UpdateProductVariantInput[]
  | ID
  | ID[];
type MerchantProductEventJob = {
  ctx: SerializedRequestContext;
  deleteIds: string[];
  productId: ID;
  type: "created" | "updated" | "deleted";
};

export function getMerchantOperationsForEvent(
  type: "created" | "updated" | "deleted",
) {
  const operationMap = {
    created: { google: "insertProduct", facebook: "createProduct" },
    updated: { google: "insertProduct", facebook: "updateProduct" },
    deleted: { google: "deleteProduct", facebook: "deleteProduct" },
  } as const;

  return operationMap[type];
}

export function getGoogleDeleteIds(
  product: {
    variants?: Array<{
      customFields?: { communicateID?: string | null };
      sku?: string;
    }>;
  },
  data?: Array<{ communicateID: string }>,
): string[] {
  const ids = new Set<string>();
  for (const variant of product.variants ?? []) {
    const id = variant.customFields?.communicateID ?? variant.sku;
    if (id) ids.add(String(id));
  }
  for (const item of data ?? []) {
    if (item.communicateID) ids.add(String(item.communicateID));
  }
  return [...ids];
}

@Injectable()
export class SubscriberService implements OnApplicationBootstrap {
  private readonly logger = new Logger();
  private productEventQueue: JobQueue<MerchantProductEventJob>;

  constructor(
    @Inject(MERCHANT_PLUGIN_OPTIONS)
    private readonly options: MerchantPluginOptions,
    private readonly eventBus: EventBus,
    private readonly integrationService: PlatformIntegrationService,
    private readonly googleService: GooglePlatformIntegrationService,
    private readonly facebookService: FacebookPlatformIntegrationService,
    private readonly strategy: MerchantStrategyService,
    private readonly productService: ProductService,
    private readonly jobQueueService: JobQueueService,
    private readonly syncHistory: MerchantSyncHistoryService,
    private readonly connection: TransactionalConnection,
  ) {}

  async onApplicationBootstrap() {
    this.productEventQueue = await this.jobQueueService.createQueue({
      name: "MerchantProductEventQueue",
      process: async (job) => {
        const ctx = RequestContext.deserialize(job.data.ctx);
        const product = await this.productService.findOne(
          ctx,
          job.data.productId,
        );
        await this.processEvent(
          ctx,
          product ?? undefined,
          job.data.type,
          job.data.deleteIds,
          job.id == null ? undefined : String(job.id),
        );
      },
    });
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
        await this.event({
          ctx,
          deleteIds: getGoogleDeleteIds({ variants: entity }),
          entity: product,
          type,
          input,
        });
      });
  }

  async event({
    ctx,
    entity,
    type,
    input,
    deleteIds,
  }: {
    ctx: RequestContext;
    entity: Product;
    type: "created" | "updated" | "deleted";
    input?: ProductInputTypes | ProductVariantInputTypes;
    deleteIds?: string[];
  }) {
    if (!this.isValidEventData(ctx, entity)) return;
    const resolvedDeleteIds = new Set(
      deleteIds ?? getGoogleDeleteIds(entity),
    );
    if (type === "deleted" || resolvedDeleteIds.size === 0) {
      const variants = await this.connection
        .getRepository(ctx, ProductVariant)
        .find({
          relations: { product: true },
          where: { product: { id: entity.id } },
          withDeleted: true,
        });
      for (const id of getGoogleDeleteIds({ variants })) {
        resolvedDeleteIds.add(id);
      }
    }
    await this.productEventQueue.add(
      {
        ctx: ctx.serialize(),
        deleteIds: [...resolvedDeleteIds],
        productId: entity.id,
        type,
      },
      { retries: 3 },
    );
  }

  private async processEvent(
    ctx: RequestContext,
    entity: Product | undefined,
    type: "created" | "updated" | "deleted",
    persistedDeleteIds: string[],
    jobId?: string,
  ) {
    const { googleAutoUpdate, facebookAutoUpdate } =
      await this.integrationService.getPlatformAutoUpdateSettings(ctx);
    if (!googleAutoUpdate && !facebookAutoUpdate) return;
    const data =
      entity && type !== "deleted"
        ? await this.strategy.getBaseData(ctx, entity)
        : undefined;
    const hasExportableData = Boolean(data?.length);
    if (type === "deleted" || !hasExportableData) {
      if (googleAutoUpdate) {
        const deleteIds = [
          ...new Set([
            ...persistedDeleteIds,
            ...(entity ? getGoogleDeleteIds(entity, data) : []),
          ]),
        ];
        const run = await this.syncHistory.start(ctx, {
          jobId,
          platform: "google",
          total: deleteIds.length,
          trigger: "PRODUCT_EVENT",
        });
        const response =
          await this.googleService.deleteProductsByCommunicationIds(
            ctx,
            deleteIds,
          );
        await this.syncHistory.finishGoogleRun(
          ctx,
          run,
          response.results,
          response.error,
        );
        if (response.status === "error") {
          throw response.error instanceof Error
            ? response.error
            : new Error("Google product deletion failed");
        }
      }
      if (facebookAutoUpdate && data?.length && entity) {
        await this.facebookService.deleteProduct({ ctx, data, entity });
      }
      return;
    }
    if (!data || !entity) return;
    const operations = getMerchantOperationsForEvent(type);
    const eventPayload = { ctx, data, entity };
    if (googleAutoUpdate) {
      const run = await this.syncHistory.start(ctx, {
        jobId,
        platform: "google",
        total: data.length,
        trigger: "PRODUCT_EVENT",
      });
      const response = await this.googleService[operations.google](eventPayload);
      await this.syncHistory.finishGoogleRun(
        ctx,
        run,
        response.results,
        response.error,
      );
      if (response.status === "error") {
        throw response.error instanceof Error
          ? response.error
          : new Error("Google product synchronization failed");
      }
    }
    if (facebookAutoUpdate) {
      await this.observeOperations(
        [this.facebookService[operations.facebook](eventPayload)],
        type,
      );
    }
  }

  private isValidEventData(ctx: RequestContext, entity: Product): boolean {
    return Boolean(ctx && entity && entity instanceof Product);
  }

  private async observeOperations(
    operations: Array<Promise<unknown>>,
    eventType: string,
  ): Promise<void> {
    const results = await Promise.allSettled(operations);
    for (const result of results) {
      if (result.status === "rejected") {
        this.logger.error(
          `Merchant ${eventType} operation rejected`,
          result.reason instanceof Error
            ? result.reason.stack
            : String(result.reason),
          "Merchant Product Subscriber",
        );
        continue;
      }
      const value = result.value;
      if (
        typeof value === "object" &&
        value !== null &&
        "status" in value &&
        value.status === "error"
      ) {
        const error = "error" in value ? value.error : undefined;
        this.logger.error(
          `Merchant ${eventType} operation failed`,
          error instanceof Error ? error.stack : String(error),
          "Merchant Product Subscriber",
        );
      }
    }
  }
}
