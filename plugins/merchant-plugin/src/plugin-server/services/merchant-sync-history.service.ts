import { RequestContext, TransactionalConnection } from "@deenruv/core";
import { Injectable } from "@nestjs/common";
import { MerchantSyncItem } from "../entities/merchant-sync-item.entity.js";
import {
  MerchantSyncRun,
  MerchantSyncRunStatus,
} from "../entities/merchant-sync-run.entity.js";
import {
  GoogleWriteOperation,
  MerchantOperationResult,
  normalizeGoogleMerchantError,
} from "./google-merchant-api.js";

export function summarizeGoogleSyncRun(input: {
  fallbackError?: unknown;
  requestedTotal: number;
  results: Array<MerchantOperationResult<GoogleWriteOperation>>;
}): {
  failed: number;
  status: MerchantSyncRunStatus;
  succeeded: number;
  total: number;
} {
  const resultFailures = input.results.filter(
    (result) => result.status === "error",
  ).length;
  const total = input.results.length || input.requestedTotal;
  const failed =
    input.results.length === 0 && input.fallbackError
      ? input.requestedTotal
      : resultFailures;
  const succeeded = Math.max(0, total - failed);
  const status: MerchantSyncRunStatus =
    failed === 0 && !input.fallbackError
      ? "SUCCESS"
      : succeeded > 0
        ? "PARTIAL"
        : "FAILED";
  return { failed, status, succeeded, total };
}

@Injectable()
export class MerchantSyncHistoryService {
  constructor(private readonly connection: TransactionalConnection) {}

  async start(
    ctx: RequestContext,
    input: {
      jobId?: string;
      platform: string;
      total?: number;
      trigger: string;
    },
  ): Promise<MerchantSyncRun> {
    return this.connection.getRepository(ctx, MerchantSyncRun).save(
      new MerchantSyncRun({
        errorSummary: null,
        failed: 0,
        finishedAt: null,
        items: [],
        jobId: input.jobId ?? null,
        platform: input.platform,
        startedAt: new Date(),
        status: "RUNNING",
        succeeded: 0,
        total: input.total ?? 0,
        trigger: input.trigger,
      }),
    );
  }

  async finishGoogleRun(
    ctx: RequestContext,
    run: MerchantSyncRun,
    results: Array<MerchantOperationResult<GoogleWriteOperation>>,
    fallbackError?: unknown,
  ): Promise<MerchantSyncRun> {
    const itemRepository = this.connection.getRepository(ctx, MerchantSyncItem);
    const items = results.map((result) => {
      const normalized =
        result.status === "error"
          ? normalizeGoogleMerchantError(result.error)
          : undefined;
      return new MerchantSyncItem({
        attempts: result.attempts,
        errorCode: normalized?.code ?? null,
        errorMessage: normalized?.message ?? null,
        offerId: result.item.communicateID,
        operation: result.item.method,
        run,
        status: result.status === "success" ? "SUCCESS" : "FAILED",
      });
    });
    if (items.length > 0) await itemRepository.save(items, { chunk: 100 });

    const summary = summarizeGoogleSyncRun({
      fallbackError,
      requestedTotal: run.total,
      results,
    });
    const fallback = fallbackError
      ? normalizeGoogleMerchantError(fallbackError)
      : undefined;
    const firstItemError = items.find((item) => item.errorMessage);
    return this.connection.getRepository(ctx, MerchantSyncRun).save({
      ...run,
      errorSummary: fallback?.message ?? firstItemError?.errorMessage ?? null,
      failed: summary.failed,
      finishedAt: new Date(),
      status: summary.status,
      succeeded: summary.succeeded,
      total: summary.total,
    });
  }

  async findLatest(
    ctx: RequestContext,
    platform: string,
    take = 20,
  ): Promise<MerchantSyncRun[]> {
    return this.connection.getRepository(ctx, MerchantSyncRun).find({
      order: { createdAt: "DESC" },
      relations: ["items"],
      take: Math.min(Math.max(take, 1), 100),
      where: { platform },
    });
  }
}
