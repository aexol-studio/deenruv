import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@deenruv/core";
import { Przelewy24Service } from "../services/przelewy24.service.js";
import { BlikStatus, BlikStatusResponse } from "../types.js";

const BLIK_TIMEOUT_MS = 120_000;

@Resolver()
export class Przelewy24ShopResolver {
  constructor(private readonly przelewy24Service: Przelewy24Service) {}

  @Query()
  async przelewy24BlikStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string; blik?: string },
  ): Promise<BlikStatusResponse> {
    const payment = await this.przelewy24Service.findBlikPaymentByOrderCode(
      ctx,
      args.code,
    );

    if (!payment) {
      return {
        status: "failed",
        message: "BLIK_PAYMENT_NOT_FOUND",
      };
    }

    // Validate BLIK token matches the payment metadata
    if (args.blik) {
      const storedToken = payment.metadata?.public?.token;
      if (storedToken && storedToken !== args.blik) {
        return {
          status: "failed",
          message: "INVALID_BLIK_TOKEN",
        };
      }
    }

    // Get order state for response
    const orderState = payment.order?.state;

    // If order is cancelled, return failed
    if (orderState === "Cancelled") {
      return {
        status: "failed",
        orderState,
        message: "Payment failed",
      };
    }

    // Get stored BLIK status from metadata
    const storedStatus: BlikStatus =
      payment.metadata?.public?.blikStatus ?? "pending";

    // If already resolved (success/failed/timeout), return immediately
    if (storedStatus !== "pending") {
      return {
        status: storedStatus,
        orderState,
        message:
          storedStatus === "success"
            ? "Payment confirmed"
            : storedStatus === "failed"
              ? "Payment failed"
              : "Payment timeout",
      };
    }

    // Check for timeout: pending status older than 120s
    const paymentCreatedAt = payment.createdAt?.getTime?.() ?? Date.now();
    const elapsed = Date.now() - paymentCreatedAt;

    if (elapsed >= BLIK_TIMEOUT_MS) {
      // Persist timeout status
      await this.przelewy24Service.updateBlikStatus(ctx, payment.id, "timeout");
      return {
        status: "timeout",
        orderState,
        message: "Payment timeout",
      };
    }

    // Still pending and within timeout window
    return {
      status: "pending",
      orderState,
      message: "Waiting for BLIK confirmation",
    };
  }

  @Mutation()
  async przelewy24BlikFail(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string; blik?: string },
  ): Promise<BlikStatusResponse> {
    const payment = await this.przelewy24Service.findBlikPaymentByOrderCode(
      ctx,
      args.code,
    );

    if (!payment) {
      return {
        status: "failed",
        message: "BLIK_PAYMENT_NOT_FOUND",
      };
    }

    // Validate BLIK token matches the payment metadata
    if (args.blik) {
      const storedToken = payment.metadata?.public?.token;
      if (storedToken && storedToken !== args.blik) {
        return {
          status: "failed",
          message: "INVALID_BLIK_TOKEN",
        };
      }
    }

    // Get order state for response
    const orderState = payment.order?.state;

    // Get current BLIK status
    const currentStatus: BlikStatus =
      payment.metadata?.public?.blikStatus ?? "pending";

    // If already in final status (success/failed/timeout), just return current state
    if (["success", "failed", "timeout"].includes(currentStatus)) {
      return {
        status: currentStatus,
        orderState,
        message:
          currentStatus === "success"
            ? "Payment already confirmed"
            : currentStatus === "failed"
              ? "Payment already failed"
              : "Payment already timed out",
      };
    }

    // Mark BLIK payment as failed
    await this.przelewy24Service.updateBlikStatus(ctx, payment.id, "failed");

    // Cancel payment if it's in Authorized state
    if (payment.state === "Authorized") {
      await this.przelewy24Service.cancelPayment(ctx, payment);
    }

    return {
      status: "failed",
      orderState: payment.order?.state,
      message: "BLIK payment marked as failed",
    };
  }
}
