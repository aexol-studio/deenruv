import { Ctx, RequestContext, Logger } from "@deenruv/core";
import { Get, Inject, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Przelewy24Service } from "../services/przelewy24.service";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
} from "../types";
import { PLUGIN_INIT_OPTIONS } from "../constants";

@Controller("przelewy24")
export class Przelewy24Controller {
  constructor(
    private readonly przelewy24Service: Przelewy24Service,
    @Inject(PLUGIN_INIT_OPTIONS) private config: Przelewy24PluginConfiguration
  ) {}

  @Post("settle")
  @HttpCode(200)
  async settle(
    @Ctx() ctx: RequestContext,
    @Body() body: Przelewy24NotificationBody
  ) {
    const status = await this.przelewy24Service.verifyPayment(body);
    if (status === "success") {
      try {
        const payment = await this.przelewy24Service.findPaymentByTransactionId(
          ctx,
          body.sessionId
        );
        await this.przelewy24Service.settlePayment(ctx, payment.id);
      } catch (err) {
        Logger.error(
          `Can't find order id ${body.sessionId}`,
          "Przelewy24Controller - Settle"
        );
        throw err;
      }
    }
  }
}
