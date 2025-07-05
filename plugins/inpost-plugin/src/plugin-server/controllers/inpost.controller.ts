import { Controller, Post, Get, Res, Req } from "@nestjs/common";
import { Ctx, RequestContext } from "@deenruv/core";
import { Response, Request } from "express";
import { InpostService } from "../services/inpost.service.js";

@Controller("inpost")
export class InpostController {
  constructor(private inpostService: InpostService) {}

  @Get("status")
  health(@Res() response: Response) {
    response.sendStatus(200);
  }

  @Post("status")
  async status(
    @Ctx() ctx: RequestContext,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.inpostService.handleUpdateEvent(ctx, request.body);
    response.sendStatus(200);
  }
}
