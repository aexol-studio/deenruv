import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";
import { CronJobsService } from "../services/cronjobs.service.js";

@Resolver()
export class CronJobsAdminAPIResolver {
  constructor(private readonly cronJobsService: CronJobsService) {}

  @Query()
  @Allow(Permission.SuperAdmin)
  async cronJobsConfig(@Ctx() ctx: RequestContext) {
    try {
      return this.cronJobsService.config(ctx);
    } catch (e) {
      console.error(e);
      return { suggestedJobs: [], presets: [] };
    }
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async cronJobs(
    @Ctx() ctx: RequestContext,
    @Args("input") input: ModelTypes["CronJobsListInput"],
  ): Promise<ModelTypes["CronJobsList"]> {
    try {
      const jobs = await this.cronJobsService.listJobs(ctx, input);
      return jobs;
    } catch (e) {
      console.error(e);
      return { items: [], totalItems: 0 };
    }
  }

  @Mutation()
  @Allow(Permission.SuperAdmin)
  async createCronJob(
    @Ctx() ctx: RequestContext,
    @Args("input") input: ModelTypes["CronJobCreateInput"],
  ) {
    try {
      await this.cronJobsService.createJob(ctx, input);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Mutation()
  @Allow(Permission.SuperAdmin)
  async updateCronJob(
    @Ctx() ctx: RequestContext,
    @Args("job") job: ModelTypes["CronJob"],
  ) {
    try {
      await this.cronJobsService.updateJob(ctx, job);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Mutation()
  @Allow(Permission.SuperAdmin)
  async removeCronJob(
    @Ctx() ctx: RequestContext,
    @Args("jobs") jobs: ModelTypes["CronJob"][],
  ) {
    try {
      await this.cronJobsService.removeJobs(ctx, jobs);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
