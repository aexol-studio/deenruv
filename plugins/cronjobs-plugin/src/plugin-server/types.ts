import { InjectableStrategy, RequestContext } from "@deenruv/core";
import { ModelTypes } from "./zeus/index.js";

export type CronJobsPluginOptions = {
  executor?: CronJobsExecutorStrategy;
  controllerAuthToken: string;
  knownWorkerJobsToSuggest?: string[];
  presets?: {
    merge: boolean;
    values: { label: string; value: string }[];
  };
};

export interface CronJobsExecutorStrategy extends InjectableStrategy {
  listJobs: (
    ctx: RequestContext,
    args: ModelTypes["CronJobsListInput"],
  ) => Promise<ModelTypes["CronJobsList"]>;
  createJob: (
    ctx: RequestContext,
    args: ModelTypes["CronJobCreateInput"] & { controllerPath: string },
  ) => Promise<void>;
  updateJob: (ctx: RequestContext, job: ModelTypes["CronJob"]) => Promise<void>;
  removeJobs: (
    ctx: RequestContext,
    jobs: ModelTypes["CronJob"][],
  ) => Promise<void>;
}
