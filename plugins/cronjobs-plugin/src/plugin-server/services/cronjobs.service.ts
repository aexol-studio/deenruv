import { Inject, Injectable } from "@nestjs/common";
import { CONTROLLER_PATH, CRONJOBS_PLUGIN_OPTIONS } from "../constants.js";
import { CronJobsExecutorStrategy, CronJobsPluginOptions } from "../types.js";
import { DefaultExecutorStrategy } from "../strategies/default-executor.strategy.js";
import { RequestContext } from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";

const DEFAULT_CRON_PRESETS = [
  { label: "every-minute", value: "* * * * *" },
  { label: "every-hour", value: "0 * * * *" },
  { label: "every-day-at-midnight", value: "0 0 * * *" },
  { label: "every-week-on-sunday", value: "0 0 * * 0" },
  { label: "every-month-first-day", value: "0 0 1 * *" },
];
@Injectable()
export class CronJobsService {
  executor: CronJobsExecutorStrategy;

  constructor(
    @Inject(CRONJOBS_PLUGIN_OPTIONS)
    private options: CronJobsPluginOptions,
  ) {
    this.executor = options?.executor || new DefaultExecutorStrategy();
  }

  async config(ctx: RequestContext) {
    const { knownWorkerJobsToSuggest = [], presets } = this.options ?? {};
    let finalPresets = DEFAULT_CRON_PRESETS.map((preset) => ({
      ...preset,
      default: true,
    }));

    if (presets?.values) {
      if (presets.merge) {
        const existingValues = presets.values.map((p) => p.value);
        finalPresets = [
          ...presets.values.map((preset) => ({ ...preset, default: false })),
          ...DEFAULT_CRON_PRESETS.filter(
            (preset) => !existingValues.includes(preset.value),
          ).map((preset) => ({ ...preset, default: true })),
        ];
      } else {
        finalPresets = presets.values.map((preset) => ({
          ...preset,
          default: false,
        }));
      }
    }

    return {
      suggestedJobs: knownWorkerJobsToSuggest,
      presets: finalPresets,
    };
  }
  async listJobs(
    ctx: RequestContext,
    args: ModelTypes["CronJobsListInput"],
  ): Promise<ModelTypes["CronJobsList"]> {
    return this.executor.listJobs(ctx, args);
  }
  async createJob(
    ctx: RequestContext,
    input: ModelTypes["CronJobCreateInput"],
  ) {
    try {
      await this.executor.createJob(ctx, {
        ...input,
        controllerPath: ["", CONTROLLER_PATH, input.jobQueueName].join("/"),
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async updateJob(ctx: RequestContext, job: ModelTypes["CronJob"]) {
    try {
      await this.executor.updateJob(ctx, job);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async removeJobs(ctx: RequestContext, jobs: ModelTypes["CronJob"][]) {
    try {
      await this.executor.removeJobs(ctx, jobs);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
