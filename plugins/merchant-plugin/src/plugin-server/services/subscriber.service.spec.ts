import {
  EventBus,
  JobQueueService,
  Product,
  ProductService,
  ProductVariant,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { describe, expect, it, vi } from "vitest";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { MerchantSyncHistoryService } from "./merchant-sync-history.service.js";
import { PlatformIntegrationService } from "./platform-integration.service.js";
import {
  getGoogleDeleteIds,
  getMerchantOperationsForEvent,
  SubscriberService,
} from "./subscriber.service.js";

describe("merchant product event routing", () => {
  it("uses an idempotent Google upsert for product updates", () => {
    expect(getMerchantOperationsForEvent("updated")).toEqual({
      facebook: "updateProduct",
      google: "insertProduct",
    });
  });

  it("keeps explicit delete operations for deleted products", () => {
    expect(getMerchantOperationsForEvent("deleted")).toEqual({
      facebook: "deleteProduct",
      google: "deleteProduct",
    });
  });

  it("uses the previously persisted Google ID when an exported variant disappears", () => {
    expect(
      getGoogleDeleteIds({
        variants: [
          {
            customFields: { communicateID: "old-sku" },
            sku: "new-sku",
          },
        ],
      }),
    ).toEqual(["old-sku"]);
  });

  it("queues product changes with retries instead of calling Google in the event handler", async () => {
    const add = vi.fn(async () => undefined);
    const createQueue = vi.fn(async () => ({ add }));
    const subscribe = vi.fn();
    const service = new SubscriberService(
      {},
      {
        ofType: vi.fn(() => ({ subscribe })),
      } as unknown as EventBus,
      {} as PlatformIntegrationService,
      {} as GooglePlatformIntegrationService,
      {} as FacebookPlatformIntegrationService,
      {} as MerchantStrategyService,
      {} as ProductService,
      { createQueue } as unknown as JobQueueService,
      {} as MerchantSyncHistoryService,
      {} as TransactionalConnection,
    );
    await service.onApplicationBootstrap();
    const product = new Product({
      id: "product-1",
      variants: [
        new ProductVariant({
          customFields: { communicateID: "sku-1" },
          sku: "sku-1",
        }),
      ],
    });

    await service.event({
      ctx: RequestContext.empty(),
      entity: product,
      type: "updated",
    });

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        deleteIds: ["sku-1"],
        productId: "product-1",
        type: "updated",
      }),
      { retries: 3 },
    );
  });
});
