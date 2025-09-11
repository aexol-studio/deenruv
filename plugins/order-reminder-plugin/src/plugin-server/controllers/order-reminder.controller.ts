import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import type { Response } from "express";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { OrderReminderService } from "../services/order-reminder.service.js";

@Controller("order-reminder")
export class OrderReminderController {
  constructor(private service: OrderReminderService) {}

  @Allow(Permission.UpdateOrder)
  @Get("")
  async run(@Ctx() ctx: RequestContext, @Res() res: Response) {
    const result = await this.service.run(ctx);
    res.status(HttpStatus.OK).json({ status: "OK", ...result });
  }
}
