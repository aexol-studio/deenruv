import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  AssetService,
  EventBus,
  ID,
  Order,
  OrderService,
  OrderStateTransitionEvent,
  Payment,
  PaymentMetadata,
  PaymentMethod,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
  BlikStatus,
} from "../types.js";
import { verifyPrzelewy24Payment } from "../verify/index.js";
import {
  loggerCtx,
  PRZELEWY24_METHOD_NAME,
  PRZELEWY24_PLUGIN_OPTIONS,
} from "../constants.js";
import { ConfigArgValues } from "@deenruv/core/dist/common/configurable-operation.js";
import {
  getPrzelewy24SecretsByChannel,
  getP24Client,
  getSessionId,
} from "../utils.js";
import { Przelewy24RegularPaymentEvent } from "../email-events.js";
import {
  P24Client,
  P24Error,
  verifyTransactionNotificationSign,
  TransactionNotification,
} from "@aexol/przelewy24-sdk";

@Injectable()
export class Przelewy24Service {
  constructor(
    @Inject(PRZELEWY24_PLUGIN_OPTIONS)
    private options: Przelewy24PluginConfiguration,
    public readonly orderService: OrderService,
    public readonly assetService: AssetService,
    public connection: TransactionalConnection,
    private readonly eventBus: EventBus,
  ) {}

  async verifyPayment(body: Przelewy24NotificationBody) {
    return verifyPrzelewy24Payment(this.options, body);
  }

  /**
   * Verify webhook signature using SDK's verifyTransactionNotificationSign.
   * Returns true if signature is valid, false otherwise.
   * Uses default channel (PLN) for CRC lookup.
   */
  verifyWebhookSignature(body: Przelewy24NotificationBody): boolean {
    try {
      // Get CRC from channel config (use currency to determine channel)
      const channel = this.options.currencyCodeToChannel
        ? this.options.currencyCodeToChannel(body.currency)
        : "pl-channel"; // Default for PLN

      const secrets = getPrzelewy24SecretsByChannel(this.options, channel);
      const crc = secrets.PRZELEWY24_CRC;

      // Convert our notification body to SDK's TransactionNotification type
      const notification: TransactionNotification = {
        merchantId: body.merchantId,
        posId: body.posId,
        sessionId: body.sessionId,
        amount: body.amount,
        originAmount: Number(body.originAmount),
        currency: body.currency,
        orderId: Number(body.orderId),
        methodId: body.methodId ?? 0,
        statement: body.statement,
        sign: body.sign,
      };

      const isValid = verifyTransactionNotificationSign(notification, crc);

      if (!isValid) {
        Logger.warn(
          `Webhook signature verification failed for sessionId: ${body.sessionId}`,
          loggerCtx,
        );
      }

      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Logger.error(
        `Error verifying webhook signature: ${errorMessage}`,
        loggerCtx,
      );
      // On error, still perform server-to-server verification as fallback
      // but log warning that signature check failed
      Logger.warn(
        "Webhook signature verification error - will rely on server-to-server verifyTransaction as fallback",
        loggerCtx,
      );
      return false;
    }
  }

  async settlePayment(ctx: RequestContext, paymentId: ID) {
    await this.orderService.settlePayment(ctx, paymentId);
  }

  async cancelPayment(ctx: RequestContext, payment: Payment) {
    try {
      await this.connection.getRepository(ctx, Payment).update(payment.id, {
        state: "Cancelled",
      });
      await this.connection.getRepository(ctx, Order).update(payment.order.id, {
        state: "ArrangingAdditionalPayment",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Logger.error(
        `Can't cancel payment ${payment.id}`,
        loggerCtx,
        errorMessage,
      );
    }
  }

  async findPaymentByTransactionId(ctx: RequestContext, transactionId: string) {
    const payment = await this.connection.getRepository(ctx, Payment).findOne({
      where: { transactionId },
      relations: ["order"],
    });
    if (!payment) throw new NotFoundException();
    return payment;
  }

  async findBlikPaymentByOrderCode(
    ctx: RequestContext,
    orderCode: string,
  ): Promise<Payment | null> {
    const order = await this.orderService.findOneByCode(ctx, orderCode);
    if (!order) return null;

    // Find the latest BLIK payment for this order
    const payments = await this.connection.getRepository(ctx, Payment).find({
      where: { order: { id: order.id } },
      relations: ["order"],
      order: { createdAt: "DESC" },
    });

    const blikPayment = payments.find(
      (p) => p.metadata?.public?.paymentMethod === "PRZELEWY24-BLIK",
    );

    return blikPayment ?? null;
  }

  async updateBlikStatus(
    ctx: RequestContext,
    paymentId: ID,
    status: BlikStatus,
  ): Promise<void> {
    const payment = await this.connection.getRepository(ctx, Payment).findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      Logger.error(`Payment ${paymentId} not found for BLIK status update`, loggerCtx);
      return;
    }

    const existingMetadata = payment.metadata ?? {};
    const existingPublic = existingMetadata.public ?? {};

    await this.connection.getRepository(ctx, Payment).update(paymentId, {
      metadata: {
        ...existingMetadata,
        public: {
          ...existingPublic,
          blikStatus: status,
        },
      },
    });

    Logger.debug(`Updated BLIK status for payment ${paymentId} to ${status}`, loggerCtx);
  }

  private async createBlikPayment(
    order: Order,
    metadata: PaymentMetadata,
    client: P24Client,
    token: string,
  ) {
    const parsed = Object.keys(metadata ?? {}).length
      ? JSON.parse(metadata as unknown as string)
      : null;
    const blikCode = parsed?.blikCode || null;

    if (!blikCode || !token) {
      Logger.error(`BLIK code not provided for order ${order.id}`, loggerCtx);
      throw new BadRequestException();
    }

    try {
      await client.chargeByCode({ token, blikCode });
    } catch (err) {
      if (err instanceof P24Error) {
        if (err.code === 28) {
          throw new Error("INVALID_BLIK_CODE");
        }
        // Map other P24 error codes to specific error messages
        Logger.error(
          `P24 BLIK Error: ${err.message} (code: ${err.code})`,
          loggerCtx,
        );
        throw new Error(`P24_BLIK_ERROR_${err.code}`);
      }
      const msg = err instanceof Error ? err.message : "Unknown error";
      Logger.error(
        `Error during BLIK payment for order ${order.id}`,
        loggerCtx,
        msg,
      );
      throw new Error(msg);
    }

    return {
      token,
      paymentMethod: "PRZELEWY24-BLIK",
      blikStatus: "pending" as BlikStatus,
    };
  }

  private async createRegularPayment(
    ctx: RequestContext,
    order: Order,
    client: P24Client,
    token: string,
  ) {
    const paymentUrl = client.getPaywallUrl(token);

    const assigned = order.payments.find(
      (p) => p.method === PRZELEWY24_METHOD_NAME,
    )?.metadata?.public?.paymentUrl;

    if (token) {
      await this.eventBus.publish(
        new Przelewy24RegularPaymentEvent(ctx, order),
      );
    }
    if (token && assigned) {
      await this.eventBus.publish(
        new OrderStateTransitionEvent(
          "AddingItems",
          "ArrangingPayment",
          ctx,
          order,
        ),
      );
    }

    return {
      paymentUrl,
      paymentMethod: "PRZELEWY24",
    };
  }

  async createPayment(
    ctx: RequestContext,
    order: Order,
    _1: number,
    _2: ConfigArgValues<{}>,
    metadata: PaymentMetadata,
    method: PaymentMethod,
  ) {
    const { apiUrl, returnUrl } = this.options;

    const przelewy24Secrets = getPrzelewy24SecretsByChannel(
      this.options,
      ctx.channel.token,
    );
    const client = getP24Client(przelewy24Secrets);
    const sessionId = getSessionId(order);

    try {
      // Build PSU data with IP and userAgent
      const userAgent = ctx.req?.headers?.["user-agent"];
      const userAgentTruncated =
        typeof userAgent === "string" ? userAgent.slice(0, 255) : undefined;

      // Extract client IP: prefer x-forwarded-for (first entry), fallback to socket
      const xForwardedFor = ctx.req?.headers?.["x-forwarded-for"];
      let clientIp: string | undefined;
      if (typeof xForwardedFor === "string") {
        clientIp = xForwardedFor.split(",")[0].trim();
      } else if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
        clientIp = xForwardedFor[0].split(",")[0].trim();
      }
      if (!clientIp) {
        clientIp =
          (ctx.req as { ip?: string } | undefined)?.ip ||
          ctx.req?.socket?.remoteAddress;
      }

      // Build PSU object only when IP is available (SDK requires both IP and userAgent)
      // If no IP, omit PSU entirely to avoid sending empty/invalid data
      const additional =
        clientIp && userAgentTruncated
          ? {
              PSU: {
                IP: clientIp,
                userAgent: userAgentTruncated,
              },
            }
          : undefined;

      const result = await client.registerTransaction({
        sessionId,
        amount: order.subTotalWithTax + order.shippingWithTax,
        currency: "PLN",
        description: `Zamówienie nr: ${order.id}, ${order.customer?.firstName} ${order.customer?.lastName}, #${order.code}`,
        email: order.customer?.emailAddress || "",
        country: "PL",
        language: "pl",
        urlReturn: await returnUrl(ctx, { order }),
        urlStatus: `${apiUrl}/przelewy24/settle`,
        urlCardPaymentNotification: `${apiUrl}/przelewy24/additional`,
        client: `${order.customer?.firstName} ${order.customer?.lastName}`,
        address: order.billingAddress.streetLine1,
        zip: order.billingAddress.postalCode,
        city: order.billingAddress.city,
        phone: order.customer?.phoneNumber,
        timeLimit: 0,
        ...(additional && { additional }),
      });

      const token = result.data.token;

      const pub =
        method.handler.code === "przelewy24BlikPaymentMethodHandler"
          ? await this.createBlikPayment(order, metadata, client, token)
          : await this.createRegularPayment(ctx, order, client, token);

      Logger.log(
        `Payment created for order ${order.id} method ${method.code}, token ${token}`,
        loggerCtx,
      );

      return {
        amount: order.totalWithTax,
        state: "Authorized" as const,
        transactionId: sessionId,
        metadata: { public: pub },
      };
    } catch (err) {
      if (err instanceof P24Error) {
        Logger.error(
          `P24 Error: ${err.message} (code: ${err.code})`,
          loggerCtx,
        );
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        Logger.error(errorMessage, loggerCtx, errorMessage);
      }
      throw err;
    }
  }
}
