import { RequestContext } from "@deenruv/core";
import { CronJobsExecutorStrategy } from "../types.js";
import { ModelTypes } from "../zeus/index.js";

export class DefaultExecutorStrategy implements CronJobsExecutorStrategy {
  async listJobs(ctx: RequestContext, args: ModelTypes["CronJobsListInput"]) {
    console.log("Listing jobs", args);
    return { items: [], totalItems: 0 };
  }
  async createJob(
    ctx: RequestContext,
    args: { jobQueueName: string; controllerPath: string },
  ) {
    console.log("Creating job", args);
  }
  async updateJob(ctx: RequestContext, job: ModelTypes["CronJob"]) {
    console.log("Updating job", job);
  }
  async removeJobs(ctx: RequestContext, jobs: ModelTypes["CronJob"][]) {
    console.log("Removing jobs", jobs);
  }
}
