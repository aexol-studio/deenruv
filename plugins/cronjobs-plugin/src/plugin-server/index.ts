import { PluginCommonModule, DeenruvPlugin, Injector } from "@deenruv/core";
import { CRONJOBS_PLUGIN_OPTIONS } from "./constants.js";
import { CronJobsPluginOptions } from "./types.js";
import { OnApplicationBootstrap } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { CronJobsService } from "./services/cronjobs.service.js";
import { CronJobsExecutorController } from "./controllers/cronjobs-executor.controller.js";
import { AdminAPIExtension } from "./extensions/admin-api.extension.js";
import { CronJobsAdminAPIResolver } from "./api/admin-api.resolver.js";
export { KubernetesCronJobExecutor } from "./strategies/kubernetes-cronjob-executor.strategy.js";

@DeenruvPlugin({
  compatibility: "^0.0.40",
  imports: [PluginCommonModule],
  controllers: [CronJobsExecutorController],
  providers: [
    {
      provide: CRONJOBS_PLUGIN_OPTIONS,
      useFactory: () => CronJobsPlugin.options,
    },
    CronJobsService,
  ],
  adminApiExtensions: {
    resolvers: [CronJobsAdminAPIResolver],
    schema: AdminAPIExtension,
  },
})
export class CronJobsPlugin implements OnApplicationBootstrap {
  private static options: CronJobsPluginOptions;
  constructor(private moduleRef: ModuleRef) {}

  static init(options: CronJobsPluginOptions) {
    this.options = options;
    return this;
  }

  async onApplicationBootstrap() {
    await this.initCronJobsExecutorStrategy();
  }

  async onApplicationShutdown() {
    await this.destroyCronJobsExecutorStrategy();
  }

  private async initCronJobsExecutorStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(CronJobsService);
    if (typeof service.executor.init === "function") {
      await service.executor.init(injector);
    }
  }

  private async destroyCronJobsExecutorStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(CronJobsService);
    if (typeof service.executor.destroy === "function") {
      await service.executor.destroy();
    }
  }
}
