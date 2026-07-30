import { JobState, SortOrder } from "@deenruv/admin-types";
import {
  Channel,
  JobQueue,
  JobQueueService,
  Logger,
  ProductService,
  RequestContext,
  SerializedRequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { selectRemoteOrphanProducts } from "./google-merchant-api.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";
import { MerchantSyncHistoryService } from "./merchant-sync-history.service.js";

type JOB_PAYLOAD = {
  platform: string;
  action: "SEND_ALL_PRODUCTS";
};

const BATCH_SIZE = 200;
const WORKER_THRESHOLD = 5000;
@Injectable()
export class PlatformIntegrationService implements OnModuleInit {
  MerchantPlatformQueue: JobQueue<{
    payload: JOB_PAYLOAD;
    worker: number;
  }>;
  OrphanItemsQueue: JobQueue<{
    platform: string;
  }>;
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Merchant Platform Service");

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly jobQueueService: JobQueueService,
    private readonly googleService: GooglePlatformIntegrationService,
    private readonly facebookService: FacebookPlatformIntegrationService,
    private readonly productService: ProductService,
    private readonly strategy: MerchantStrategyService,
    private readonly syncHistory: MerchantSyncHistoryService,
  ) {}

  async removeOrphanItems(
    ctx: RequestContext,
    platform: string,
  ): Promise<boolean> {
    if (["facebook", "google"].includes(platform)) {
      await this.OrphanItemsQueue.add({ platform }, { retries: 3 });
      return true;
    }
    return false;
  }

  async *fetchProducts(
    input: { ctx: RequestContext; worker: number },
    callback?: (progress: number) => void,
  ) {
    const { ctx, worker } = input;
    const totalToFetch = (worker + 1) * WORKER_THRESHOLD;
    const start = worker * WORKER_THRESHOLD;
    for (let i = start; i < totalToFetch; i += BATCH_SIZE) {
      const { items } = await this.productService.findAll(ctx, {
        sort: { id: SortOrder.ASC },
        take: BATCH_SIZE,
        skip: i,
      });
      if (items.length === 0) break;
      for (const product of items) {
        const baseProduct = await this.strategy.getBaseData(ctx, product);
        if (callback) {
          const progress = Math.min(
            100,
            Math.floor(
              ((i - start + items.indexOf(product) + 1) / WORKER_THRESHOLD) *
                100,
            ),
          );
          callback(progress);
        }
        if (!baseProduct) continue;
        yield baseProduct;
      }
    }
  }

  async onModuleInit() {
    this.MerchantPlatformQueue = await this.jobQueueService.createQueue({
      name: "MerchantPlatformEventQueue",
      process: async (job) => {
        try {
          const {
            payload: { action, platform },
            worker,
          } = job.data;
          if (action === "SEND_ALL_PRODUCTS") {
            const ctx = await this.createContext();
            if (!ctx) return { status: "CONTEXT_ERROR" };
            const products = [];
            for await (const product of this.fetchProducts(
              { ctx, worker },
              (progress) => {
                if (job.state === JobState.CANCELLED) {
                  throw new Error("Job was cancelled");
                } else job.setProgress(progress);
              },
            )) {
              products.push(product);
            }
            let googleResponse = false;
            let facebookResponse = false;
            if (platform === "google") {
              const run = await this.syncHistory.start(ctx, {
                jobId: job.id == null ? undefined : String(job.id),
                platform,
                total: products.length,
                trigger: "FULL_SYNC",
              });
              const response = await this.googleService.batchProductsAction({
                ctx,
                products,
              });
              await this.syncHistory.finishGoogleRun(
                ctx,
                run,
                response.results,
                response.error,
              );
              if (response.status === "success") {
                this.log("Products sent to google");
                googleResponse = true;
              } else {
                this.log("Error sending products to google");
                googleResponse = false;
                throw response.error instanceof Error
                  ? response.error
                  : new Error("Google product sync failed");
              }
            }
            if (platform === "facebook") {
              const response = await this.facebookService.batchProductsAction({
                ctx,
                products,
              });
              if (response.status === "success") {
                this.log("Products sent to facebook");
                facebookResponse = true;
              } else {
                this.log("Error sending products to facebook");
                facebookResponse = false;
                throw new Error(response.message || "Facebook product sync failed");
              }
            }

            return { status: "SUCCESS", facebookResponse, googleResponse };
          }
        } catch (e) {
          const status = e instanceof Error ? e.message : "Unknown error";
          this.log(`Error processing job: ${status}`);
          throw new Error(status);
        }
      },
    });
    this.OrphanItemsQueue = await this.jobQueueService.createQueue({
      name: "MerchantPlatformOrphanItemsQueue",
      process: async (job) => {
        const { platform } = job.data;
        const ctx = await this.createContext();
        const map = {
          google: this.googleService,
          facebook: this.facebookService,
        };
        const service = map[platform as keyof typeof map];
        if (!service) throw new Error("Unknown platform");
        const remoteProducts = await service.getAllProducts(ctx);
        const products = [];
        const { totalItems } = await this.productService.findAll(ctx, {
          take: 1,
          skip: 0,
        });
        const workers = Math.ceil(totalItems / WORKER_THRESHOLD);
        for (let worker = 0; worker < workers; worker++) {
          for await (const product of this.fetchProducts(
            { ctx, worker },
            (progress) => {
              if (job.state === JobState.CANCELLED) {
                throw new Error("Job was cancelled");
              } else job.setProgress(progress);
            },
          )) {
            products.push(...product);
          }
        }
        const orphanProducts = selectRemoteOrphanProducts(
          remoteProducts,
          products,
        );
        if (orphanProducts.length > 0) {
          this.log(
            `Found ${orphanProducts.length} orphan items for platform ${platform}`,
          );
          await service.removeOrphanItems(ctx, orphanProducts);
        } else {
          this.log(`No orphan items found for platform ${platform}`);
        }
      },
    });
  }

  async createContext() {
    const channel = await this.connection.rawConnection
      .getRepository(Channel)
      .findOne({
        where: { token: "pl-channel" }, // TODO: We should take default channel code, and allow to map other channels
        relations: { defaultTaxZone: true },
      });
    if (!channel)
      throw new Error("Cannot create context, default channel not found");
    return new RequestContext({
      apiType: "admin",
      channel,
      isAuthorized: true,
      authorizedAsOwnerOnly: true,
    });
  }

  async savePlatformIntegrationSettings(
    ctx: RequestContext,
    settings: MerchantPlatformSettingsEntity,
  ) {
    const [isFirstSync, isAutoUpdate] = [
      this.lookup(settings, "firstSync") === "true",
      this.lookup(settings, "autoUpdate") === "true",
    ];
    const shouldStartFullSync = isFirstSync && isAutoUpdate;
    const settingsToSave = new MerchantPlatformSettingsEntity({
      ...settings,
      entries: settings.entries.map((entry) =>
        shouldStartFullSync && entry.key === "firstSync"
          ? { ...entry, value: "false" }
          : entry,
      ),
    });
    const response = await this.connection.withTransaction(
      ctx,
      async (transactionCtx) => {
        const repository = this.connection.getRepository(
          transactionCtx,
          MerchantPlatformSettingsEntity,
        );
        const existing = await repository.findOne({
          where: { platform: settings.platform },
        });
        if (existing) await repository.delete(existing.id);
        return repository.save(settingsToSave);
      },
    );
    if (response.id && shouldStartFullSync) {
      await this.enqueueFullSync(ctx, response.platform);
    }
    return response;
  }

  async getBaseSettings(ctx: RequestContext, platform: string) {
    return this.connection
      .getRepository(ctx, MerchantPlatformSettingsEntity)
      .findOne({ relations: ["entries"], where: { platform } });
  }

  async enqueueFullSync(ctx: RequestContext, platform: string) {
    if (!["google", "facebook"].includes(platform)) return false;
    const { totalItems } = await this.productService.findAll(ctx, {
      take: 1,
      skip: 0,
    });
    const workers = Math.max(1, Math.ceil(totalItems / WORKER_THRESHOLD));
    for (let worker = 0; worker < workers; worker += 1) {
      await this.MerchantPlatformQueue.add(
        {
          worker,
          payload: {
            platform,
            action: "SEND_ALL_PRODUCTS",
          },
        },
        { retries: 3 },
      );
    }
    return true;
  }

  getSyncHistory(ctx: RequestContext, platform: string, take?: number) {
    return this.syncHistory.findLatest(ctx, platform, take);
  }
  async getPlatformAutoUpdateSettings(ctx: RequestContext) {
    const [googlePlatformSettings, facebookPlatformSettings] =
      await Promise.all([
        this.getBaseSettings(ctx, "google"),
        this.getBaseSettings(ctx, "facebook"),
      ]);
    return {
      googleAutoUpdate:
        this.lookup(googlePlatformSettings, "autoUpdate") === "true",
      facebookAutoUpdate:
        this.lookup(facebookPlatformSettings, "autoUpdate") === "true",
    };
  }

  private lookup(settings: MerchantPlatformSettingsEntity | null, key: string) {
    return settings?.entries.find((entry) => entry.key === key)?.value;
  }
}
