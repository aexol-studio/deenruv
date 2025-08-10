import { JobState } from "@deenruv/admin-types";
import {
  Channel,
  JobQueue,
  JobQueueService,
  Logger,
  ProductService,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";
import { FacebookPlatformIntegrationService } from "./facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./google-platform-integration.service.js";
import { MerchantStrategyService } from "./merchant-strategy.service.js";

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
  ) {}

  async *fetchProducts(
    input: { ctx: RequestContext; worker: number },
    callback?: (progress: number) => void,
  ) {
    const { ctx, worker } = input;
    const totalToFetch = (worker + 1) * WORKER_THRESHOLD;
    const start = worker * WORKER_THRESHOLD;
    for (let i = start; i < totalToFetch; i += BATCH_SIZE) {
      const { items } = await this.productService.findAll(ctx, {
        take: BATCH_SIZE,
        skip: i,
      });
      for (const product of items) {
        const baseProduct = await this.strategy.getBaseData(ctx, product);
        if (callback) {
          const progress = Math.floor((i / totalToFetch) * 100);
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
              const response = await this.googleService.batchProductsAction({
                ctx,
                products,
              });
              if (response.status === "success") {
                this.log("Products sent to google");
                googleResponse = true;
              } else {
                this.log("Error sending products to google");
                googleResponse = false;
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
    const repository = this.connection.getRepository(
      ctx,
      MerchantPlatformSettingsEntity,
    );
    const existing = await repository.findOne({
      where: { platform: settings.platform },
    });
    if (existing) await repository.delete(existing.id);
    let response = await repository.save(settings);
    if (!response.id) return;
    const [isFirstSync, isAutoUpdate] = [
      this.lookup(settings, "firstSync") === "true",
      this.lookup(settings, "autoUpdate") === "true",
    ];
    if (isFirstSync && isAutoUpdate) {
      const products = await this.productService.findAll(ctx, {
        take: 1,
        skip: 0,
      });
      const total = products.totalItems;
      const workers = Math.ceil(total / WORKER_THRESHOLD);
      for (let worker = 0; worker < workers; worker++) {
        await this.MerchantPlatformQueue.add({
          worker,
          payload: {
            platform: response.platform,
            action: "SEND_ALL_PRODUCTS",
          },
        });
      }
      response = await repository.save({
        ...settings,
        entries: settings.entries.map((entry) =>
          entry.key === "firstSync" ? { ...entry, value: "false" } : entry,
        ),
      });
    }
    return response;
  }

  async getBaseSettings(ctx: RequestContext, platform: string) {
    return this.connection
      .getRepository(ctx, MerchantPlatformSettingsEntity)
      .findOne({ relations: ["entries"], where: { platform } });
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
