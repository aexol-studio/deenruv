import { Ctx, RequestContext, Logger } from "@deenruv/core";
import { Inject, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Przelewy24Service } from "../services/przelewy24.service.js";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
} from "../types.js";
import { loggerCtx, PRZELEWY24_PLUGIN_OPTIONS } from "../constants.js";

@Controller("przelewy24")
export class Przelewy24Controller {
  constructor(
    private readonly przelewy24Service: Przelewy24Service,
    @Inject(PRZELEWY24_PLUGIN_OPTIONS)
    private config: Przelewy24PluginConfiguration,
  ) {}

  @Post("additional")
  @HttpCode(200)
  async blikVerify(@Ctx() ctx: RequestContext, @Body() body: unknown) {
    console.log("BLIK VERIFY body", body);
  }

  @Post("settle")
  @HttpCode(200)
  async settle(
    @Ctx() ctx: RequestContext,
    @Body() body: Przelewy24NotificationBody,
  ) {
    const status = await this.przelewy24Service.verifyPayment(body);
    if (status === "success") {
      try {
        const payment = await this.przelewy24Service.findPaymentByTransactionId(
          ctx,
          body.sessionId,
        );
        await this.przelewy24Service.settlePayment(ctx, payment.id);
      } catch (err) {
        Logger.error(`Can't find order id ${body.sessionId}`, loggerCtx);
        throw err;
      }
    }
  }
}
