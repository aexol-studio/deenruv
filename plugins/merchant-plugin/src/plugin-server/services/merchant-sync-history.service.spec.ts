import {
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { describe, expect, it, vi } from "vitest";
import { MerchantSyncItem } from "../entities/merchant-sync-item.entity.js";
import { MerchantSyncRun } from "../entities/merchant-sync-run.entity.js";
import {
  MerchantSyncHistoryService,
  summarizeGoogleSyncRun,
} from "./merchant-sync-history.service.js";

describe("merchant synchronization history", () => {
  it("marks the entire requested batch as failed when payload preparation fails", () => {
    expect(
      summarizeGoogleSyncRun({
        fallbackError: new Error("Invalid product URL"),
        requestedTotal: 200,
        results: [],
      }),
    ).toMatchObject({
      failed: 200,
      status: "FAILED",
      succeeded: 0,
      total: 200,
    });
  });

  it("reports a partially successful batch without hiding failed items", () => {
    expect(
      summarizeGoogleSyncRun({
        requestedTotal: 2,
        results: [
          {
            attempts: 1,
            index: 0,
            item: {
              communicateID: "ok",
              method: "delete",
              request: { dataSource: "source", name: "ok" },
            },
            status: "success",
          },
          {
            attempts: 3,
            error: { code: 14 },
            index: 1,
            item: {
              communicateID: "failed",
              method: "delete",
              request: { dataSource: "source", name: "failed" },
            },
            status: "error",
          },
        ],
      }),
    ).toEqual({
      failed: 1,
      status: "PARTIAL",
      succeeded: 1,
      total: 2,
    });
  });

  it("persists normalized per-product failures for later debugging", async () => {
    const savedItems: MerchantSyncItem[] = [];
    const runRepository = {
      save: vi.fn(async (run: MerchantSyncRun) => run),
    };
    const itemRepository = {
      save: vi.fn(async (items: MerchantSyncItem[]) => {
        savedItems.push(...items);
        return items;
      }),
    };
    const connection = {
      getRepository: (
        _ctx: RequestContext,
        entity: typeof MerchantSyncRun | typeof MerchantSyncItem,
      ) => (entity === MerchantSyncRun ? runRepository : itemRepository),
    } as unknown as TransactionalConnection;
    const service = new MerchantSyncHistoryService(connection);
    const run = new MerchantSyncRun({
      failed: 0,
      platform: "google",
      status: "RUNNING",
      succeeded: 0,
      total: 1,
      trigger: "FULL_SYNC",
    });

    const completed = await service.finishGoogleRun(
      RequestContext.empty(),
      run,
      [
        {
          attempts: 3,
          error: { code: 14, details: "Backend unavailable" },
          index: 0,
          item: {
            communicateID: "sku-failed",
            method: "delete",
            request: { dataSource: "source", name: "sku-failed" },
          },
          status: "error",
        },
      ],
    );

    expect(completed).toMatchObject({
      errorSummary: "Backend unavailable",
      failed: 1,
      status: "FAILED",
    });
    expect(savedItems).toHaveLength(1);
    expect(savedItems[0]).toMatchObject({
      attempts: 3,
      errorCode: "UNAVAILABLE",
      errorMessage: "Backend unavailable",
      offerId: "sku-failed",
      status: "FAILED",
    });
  });
});
