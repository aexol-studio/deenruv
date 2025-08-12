import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { Ctx, JobQueueService, Logger, RequestContext } from "@deenruv/core";
import { CONTROLLER_PATH } from "../constants.js";
import { ControllersGuard } from "../guards/controllers.guard.js";

@Controller(CONTROLLER_PATH)
@UseGuards(ControllersGuard)
export class CronJobsExecutorController {
  logger: Logger;
  constructor(private readonly jobQueueService: JobQueueService) {
    this.logger = new Logger();
  }

  @Get(":name")
  async synchronize(
    @Ctx() ctx: RequestContext,
    @Res() res: Response,
    @Param("name") name: string,
  ) {
    try {
      const jobQueue = this.jobQueueService
        .getJobQueues()
        .find((q) => q.name === name);
      if (!jobQueue) {
        this.logger.log(
          `Job queue ${name} not found`,
          "CronJobsExecutorController",
        );
        res.status(404).send("Job queue not found");
        return;
      }
      await jobQueue.add({ serializedContext: ctx.serialize() });
    } catch (e) {
      this.logger.log(
        `Error starting job queue ${name}: ${e}`,
        "CronJobsExecutorController",
      );
      res.status(500).send("Error starting job queue");
    }
    res.send("OK !");
  }
}
