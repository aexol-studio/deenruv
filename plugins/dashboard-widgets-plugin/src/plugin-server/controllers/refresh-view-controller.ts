import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { Controller, Get, Res } from "@nestjs/common";
import { BetterMetricsService } from "../services/metrics.service";
import { type Response } from "express";
@Controller("metrics")
export class RefreshViewController {
  constructor(private metricsService: BetterMetricsService) {}
  @Allow(Permission.ReadOrder)
  @Get("/refresh-view")
  async refreshView(@Ctx() ctx: RequestContext, @Res() res: Response) {
    await this.metricsService.refreshViews(ctx);
    res.status(200).send("OK");
  }
}
