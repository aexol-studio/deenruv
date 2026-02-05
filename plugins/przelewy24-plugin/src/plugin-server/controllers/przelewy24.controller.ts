import { Ctx, RequestContext, Logger } from "@deenruv/core";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { Przelewy24Service } from "../services/przelewy24.service.js";
import { Przelewy24NotificationBody } from "../types.js";
import { loggerCtx } from "../constants.js";

const BLIK_PAYMENT_METHOD = "PRZELEWY24-BLIK";

/** Payment states considered final - no further webhook processing needed */
const FINAL_PAYMENT_STATES = ["Settled", "Failed", "Cancelled", "Error"];

@Controller("przelewy24")
export class Przelewy24Controller {
  constructor(private readonly przelewy24Service: Przelewy24Service) {}

  @Post("additional")
  @HttpCode(200)
  async blikVerify(
    @Ctx() ctx: RequestContext,
    @Body() body: Przelewy24NotificationBody,
  ): Promise<void> {
    Logger.debug(
      `BLIK additional notification received: ${JSON.stringify(body)}`,
      loggerCtx,
    );

    // Verify webhook signature
    if (!this.przelewy24Service.verifyWebhookSignature(body)) {
      Logger.warn(
        `Invalid webhook signature for sessionId: ${body.sessionId}`,
        loggerCtx,
      );
      throw new UnauthorizedException("Invalid webhook signature");
    }

    try {
      const payment = await this.przelewy24Service.findPaymentByTransactionId(
        ctx,
        body.sessionId,
      );

      // Idempotency: If payment is already in a final state, return early
      if (FINAL_PAYMENT_STATES.includes(payment.state)) {
        Logger.debug(
          `Payment ${payment.id} already in final state ${payment.state}, skipping`,
          loggerCtx,
        );
        return;
      }

      const isBlikPayment =
        payment.metadata?.public?.paymentMethod === BLIK_PAYMENT_METHOD;

      // Check if BLIK status is already final
      const currentBlikStatus = payment.metadata?.public?.blikStatus;
      if (
        isBlikPayment &&
        currentBlikStatus &&
        ["success", "failed", "timeout"].includes(currentBlikStatus)
      ) {
        Logger.debug(
          `BLIK payment ${payment.id} already has final status ${currentBlikStatus}, skipping`,
          loggerCtx,
        );
        return;
      }

      const status = await this.przelewy24Service.verifyPayment(body);

      if (status === "success") {
        // Update BLIK status before settling
        if (isBlikPayment) {
          await this.przelewy24Service.updateBlikStatus(
            ctx,
            payment.id,
            "success",
          );
        }
        await this.przelewy24Service.settlePayment(ctx, payment.id);
      } else {
        if (isBlikPayment) {
          await this.przelewy24Service.updateBlikStatus(
            ctx,
            payment.id,
            "failed",
          );
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Logger.error(
        `Error processing BLIK additional notification: ${errorMessage}`,
        loggerCtx,
      );

      // Try to mark BLIK payment as failed if we can extract payment info
      try {
        const payment = await this.przelewy24Service.findPaymentByTransactionId(
          ctx,
          body.sessionId,
        );
        const isBlikPayment =
          payment.metadata?.public?.paymentMethod === BLIK_PAYMENT_METHOD;
        const currentBlikStatus = payment.metadata?.public?.blikStatus;

        // Only update if not already in final status
        if (
          isBlikPayment &&
          (!currentBlikStatus ||
            !["success", "failed", "timeout"].includes(currentBlikStatus))
        ) {
          await this.przelewy24Service.updateBlikStatus(
            ctx,
            payment.id,
            "failed",
          );
        }
      } catch {
        // Ignore - we already logged the main error
      }

      throw err;
    }
  }

  @Post("settle")
  @HttpCode(200)
  async settle(
    @Ctx() ctx: RequestContext,
    @Body() body: Przelewy24NotificationBody,
  ): Promise<void> {
    // Verify webhook signature
    if (!this.przelewy24Service.verifyWebhookSignature(body)) {
      Logger.warn(
        `Invalid webhook signature for sessionId: ${body.sessionId}`,
        loggerCtx,
      );
      throw new UnauthorizedException("Invalid webhook signature");
    }

    try {
      const payment = await this.przelewy24Service.findPaymentByTransactionId(
        ctx,
        body.sessionId,
      );

      // Idempotency: If payment is already in a final state, return early
      if (FINAL_PAYMENT_STATES.includes(payment.state)) {
        Logger.debug(
          `Payment ${payment.id} already in final state ${payment.state}, skipping settle`,
          loggerCtx,
        );
        return;
      }

      const isBlikPayment =
        payment.metadata?.public?.paymentMethod === BLIK_PAYMENT_METHOD;

      // Check if BLIK status is already final (for BLIK payments)
      const currentBlikStatus = payment.metadata?.public?.blikStatus;
      if (
        isBlikPayment &&
        currentBlikStatus &&
        ["success", "failed", "timeout"].includes(currentBlikStatus)
      ) {
        // For BLIK, if status is already success/failed/timeout, skip
        // (the additional endpoint already handled this)
        Logger.debug(
          `BLIK payment ${payment.id} already has final status ${currentBlikStatus}, checking if needs settle`,
          loggerCtx,
        );
        // If status is success but payment not settled, proceed to settle
        if (currentBlikStatus !== "success") {
          return;
        }
      }

      const status = await this.przelewy24Service.verifyPayment(body);
      if (status === "success") {
        // Update BLIK status before settling (defensive - in case additional wasn't called)
        if (isBlikPayment && currentBlikStatus !== "success") {
          await this.przelewy24Service.updateBlikStatus(
            ctx,
            payment.id,
            "success",
          );
        }

        await this.przelewy24Service.settlePayment(ctx, payment.id);
      }
    } catch (err) {
      Logger.error(`Can't find order id ${body.sessionId}`, loggerCtx);
      throw err;
    }
  }
}
