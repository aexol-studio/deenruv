import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  AssetService,
  ChannelService,
  EventBus,
  ID,
  LanguageCode,
  Order,
  OrderService,
  OrderStateTransitionEvent,
  Payment,
  PaymentMetadata,
  PaymentMethod,
  PaymentMethodService,
  RequestContext,
  TransactionalConnection,
} from "@deenruv/core";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
} from "../types.js";
import { verifyPrzelewy24Payment } from "../verify/index.js";
import {
  BLIK_METHOD_NAME,
  loggerCtx,
  PRZELEWY24_METHOD_NAME,
  PRZELEWY24_PLUGIN_OPTIONS,
} from "../constants.js";
import { przelewy24BlikPaymentMethodHandler } from "../handlers/przelewy24-blik.handler.js";
import { przelewy24PaymentMethodHandler } from "../handlers/przelewy24.handler.js";
import { ConfigArgValues } from "@deenruv/core/dist/common/configurable-operation.js";
import {
  getPrzelewy24SecretsByChannel,
  getAxios,
  getSessionId,
  generateSHA384Hash,
} from "../utils.js";
import { AxiosInstance } from "axios";
import { Przelewy24RegularPaymentEvent } from "../email-events.js";

@Injectable()
export class Przelewy24Service {
  constructor(
    @Inject(PRZELEWY24_PLUGIN_OPTIONS)
    private options: Przelewy24PluginConfiguration,
    public readonly orderService: OrderService,
    public readonly assetService: AssetService,
    public connection: TransactionalConnection,
    private readonly channelService: ChannelService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly eventBus: EventBus,
  ) {}

  async populateMethods() {
    const methods = [
      {
        name: BLIK_METHOD_NAME,
        code: przelewy24BlikPaymentMethodHandler.code,
      },
      {
        name: PRZELEWY24_METHOD_NAME,
        code: przelewy24PaymentMethodHandler.code,
      },
    ];
    const methodsPerChannel: Record<string, PaymentMethod[]> = {};
    for (const channelToken of Object.keys(this.options)) {
      const channel =
        await this.channelService.getChannelFromToken(channelToken);
      const ctx = new RequestContext({
        apiType: "admin",
        authorizedAsOwnerOnly: true,
        channel,
        isAuthorized: true,
      });
      for (const { name, code } of methods) {
        const exist = await this.paymentMethodService.findAll(ctx, {
          filter: { code: { eq: code } },
        });
        if (exist.totalItems > 0) {
          continue;
        }
        const method = await this.paymentMethodService.create(ctx, {
          code: PRZELEWY24_METHOD_NAME,
          translations: [LanguageCode.en, LanguageCode.pl].map(
            (languageCode) => ({
              languageCode,
              name: name.toUpperCase(),
            }),
          ),
          handler: { code, arguments: [] },
          enabled: true,
        });
        if (!methodsPerChannel[channelToken]) {
          methodsPerChannel[channelToken] = [];
        }
        methodsPerChannel[channelToken].push(method);
      }
    }
    if (Object.keys(methodsPerChannel).length === 0) {
      return;
    }
    Logger.log("Populated Przelewy24 payment methods", loggerCtx);
  }

  // onModuleInit() {
  //   this.populateMethods();
  // }

  async verifyPayment(body: Przelewy24NotificationBody) {
    return verifyPrzelewy24Payment(this.options, body);
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

  private async createBlikPayment(
    order: Order,
    metadata: PaymentMetadata,
    api: AxiosInstance,
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
    const blikResult = await api.post("/paymentMethod/blik/chargeByCode", {
      token,
      blikCode,
    });
    if (!blikResult || blikResult.data.responseCode !== 0) {
      if (
        "data" in blikResult &&
        blikResult.data &&
        "code" in blikResult.data &&
        "error" in blikResult.data
      ) {
        let errorMessage = "Unknown error during BLIK payment";
        switch (blikResult.data.code) {
          case 28:
            errorMessage = "INVALID_BLIK_CODE";
            break;
          default:
            break;
        }

        throw new Error(errorMessage);
      } else {
        throw new Error("Unknown error during BLIK payment");
      }
    }

    return {
      token,
      paymentMethod: "PRZELEWY24-BLIK",
    };
  }

  private async createRegularPayment(
    ctx: RequestContext,
    order: Order,
    token: string,
  ) {
    const paymentUrl = `${this.options.przelewy24Host}/trnRequest/${token}`;
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
    const api = getAxios(przelewy24Secrets);
    const sessionId = getSessionId(order);

    const secrets = {
      pos_id: przelewy24Secrets.PRZELEWY24_POS_ID,
      crc: przelewy24Secrets.PRZELEWY24_CRC,
    };

    const sum = `{"sessionId":"${sessionId}","merchantId":${
      secrets["pos_id"]
    },"amount":${
      order.subTotalWithTax + order.shippingWithTax
    },"currency":"PLN","crc":"${secrets["crc"]}"}`;

    try {
      const body = {
        description: `Zamówienie nr: ${order.id}, ${order.customer?.firstName} ${order.customer?.lastName}, #${order.code}`,
        language: "pl",
        country: "PL",
        currency: "PLN",
        merchantId: secrets["pos_id"],
        posId: secrets["pos_id"],
        sessionId,
        amount: order.subTotalWithTax + order.shippingWithTax,
        email: order.customer?.emailAddress,
        client: `${order.customer?.firstName} ${order.customer?.lastName}`,
        address: order.billingAddress.streetLine1,
        zip: order.billingAddress.postalCode,
        city: order.billingAddress.city,
        phone: order.customer?.phoneNumber,
        urlReturn: await returnUrl(ctx, { order }), // THIS IS FOR REDIRECT AFTER PAYMENT
        urlStatus: `${apiUrl}/przelewy24/settle`, // THIS IS FOR P24 NOTIFICATIONS
        urlCardPaymentNotification: `${apiUrl}/przelewy24/additional`, // THIS IS FOR BLIK NOTIFICATIONS
        timeLimit: 0,
        encoding: "UTF-8",
        sign: generateSHA384Hash(sum),
      };
      const result = await api.post("/transaction/register", body);
      const token = result.data.data.token;
      const pub =
        method.handler.code === "przelewy24BlikPaymentMethodHandler"
          ? await this.createBlikPayment(order, metadata, api, token)
          : await this.createRegularPayment(ctx, order, token);
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
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Logger.error(errorMessage, loggerCtx, errorMessage);
      throw err;
    }
  }
}
