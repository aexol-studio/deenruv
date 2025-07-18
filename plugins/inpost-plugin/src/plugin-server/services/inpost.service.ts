import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  Asset,
  AssetService,
  CustomerService,
  Fulfillment,
  JobQueue,
  JobQueueService,
  Order,
  OrderLine,
  RequestContext,
  ShippingLine,
  TransactionalConnection,
  type ID,
  Logger,
  FulfillmentService,
  ProcessContext,
} from "@deenruv/core";
import { Client, CountryCode, Shipment } from "@deenruv/inpost";
import { InpostConfigEntity } from "../entities/inpost-config-entity.js";
import { InpostRefEntity } from "../entities/inpost-ref-entity.js";
import {
  InpostWebhookEvent,
  OrderProgressJob,
  SetInpostShippingMethodConfigInput,
} from "../types.js";
import { LOGGER_CTX } from "../constants.js";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "node:fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { Writable } from "node:stream";
import { randomBytes } from "crypto";

declare module "@deenruv/core/dist/entity/custom-entity-fields" {
  interface CustomFulfillmentFields {
    inpostLabel?: Asset;
  }
  interface CustomOrderFields {
    pickupPointId?: string;
  }
}

@Injectable()
export class InpostService implements OnModuleInit {
  private orderProgressJob!: JobQueue<OrderProgressJob>;
  constructor(
    private processContext: ProcessContext,
    private connection: TransactionalConnection,
    private jobQueueService: JobQueueService,
    private assetService: AssetService,
    private customerService: CustomerService,
    private fulfillmentService: FulfillmentService,
  ) {}

  async onModuleInit() {
    this.orderProgressJob =
      await this.jobQueueService.createQueue<OrderProgressJob>({
        name: "process-inpost-shipment",
        process: async (job) => {
          if (this.processContext.isServer) return;
          const ctx = RequestContext.deserialize(job.data.context);
          await this.processInpostShipment(
            ctx,
            job.data.shipmentId,
            job.data.inpostConfigId,
            {
              ...job.data,
              progress: job.setProgress,
            },
          );
        },
      });
  }

  async getConfig(
    ctx: RequestContext,
  ): Promise<InpostConfigEntity | undefined> {
    const configs = await this.connection
      .getRepository(ctx, InpostConfigEntity)
      .find({ take: 1, order: { createdAt: "DESC" } });
    if (configs.length === 0) {
      Logger.error(
        `No inpost config found, please set up inpost config first`,
        LOGGER_CTX,
      );
      return undefined;
    }
    const config = configs.at(0);
    if (!config?.host || !config?.apiKey || !config?.inpostOrganization) {
      Logger.error(
        `Misconfigured inpost config, host, apiKey and organization id are required`,
        LOGGER_CTX,
      );
      return undefined;
    }
    return config;
  }

  async getGeowidgetKey(ctx: RequestContext) {
    const config = await this.getConfig(ctx);
    if (!config?.host || !config?.apiKey || !config?.inpostOrganization) {
      Logger.error(
        `Misconfigured inpost config, host, apiKey and organization id are required`,
        LOGGER_CTX,
      );
      return null;
    }
    return config.geowidgetKey;
  }

  async isConnected(ctx: RequestContext): Promise<boolean> {
    const config = await this.getConfig(ctx);
    return !!(
      config?.host &&
      config?.apiKey &&
      config?.service &&
      config?.inpostOrganization
    );
  }

  private async buyShipment(
    ctx: RequestContext,
    shipment: Shipment,
    config: InpostConfigEntity,
    client: Client,
  ) {
    if (
      !shipment.status ||
      shipment.status === "created" ||
      shipment.status === "offer_selected" ||
      shipment.selected_offer.status !== "bought"
    ) {
      await this.orderProgressJob.add({
        context: ctx.serialize(),
        inpostConfigId: config.id,
        nextStep: "buy",
        shipmentId: shipment.id || 0,
        delay: 1000,
      });
      return;
    }
    await client
      .shipments()
      .get(shipment.id || 0)
      .buy({
        offer_id: shipment.offers?.[0].id || 0,
      });
    await this.orderProgressJob.add({
      context: ctx.serialize(),
      inpostConfigId: config.id,
      nextStep: "label",
      shipmentId: shipment.id || 0,
      delay: 1000,
    });
  }

  private async labelShipment(
    ctx: RequestContext,
    shipment: Shipment,
    config: InpostConfigEntity,
    client: Client,
  ) {
    if (!shipment.status || shipment.status === "created") {
      await this.orderProgressJob.add({
        context: ctx.serialize(),
        inpostConfigId: config.id,
        nextStep: "label",
        shipmentId: shipment.id || 0,
        delay: 1000,
      });
      return;
    }
    const label = await client
      .shipments()
      .get(shipment.id || 0)
      .label();
    const tmp = await mkdtemp(join(tmpdir(), "label-gen"));
    const labelFile = join(tmp, `${randomBytes(24).toString("hex")}.pdf`);
    await label?.pipeTo(
      Writable.toWeb(
        createWriteStream(labelFile),
      ) as WritableStream<Uint8Array>,
    );
    const asset = await this.assetService.createFromFileStream(
      createReadStream(labelFile),
      ctx,
    );
    if (asset instanceof Asset) {
      await this.connection.getRepository(ctx, Fulfillment).update(
        { trackingCode: `${shipment.id}` },
        {
          customFields: {
            inpostLabel: asset,
          },
        },
      );
    }
    await rm(tmp, { force: true, recursive: true });
  }

  private async processInpostShipment(
    ctx: RequestContext,
    shipmentId: number,
    inpostConfigId: ID,
    {
      delay,
      nextStep,
    }: {
      progress?: (pct: number) => void;
    } & Omit<OrderProgressJob, "context" | "inpostConfigId" | "shipmentId">,
  ) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const config = await this.connection
      .getRepository(ctx, InpostConfigEntity)
      .findOneOrFail({ where: { id: inpostConfigId } });
    const client = new Client({ host: config.host, apiKey: config.apiKey });
    const shipment = await client.shipments().get(shipmentId).fetch();
    switch (nextStep) {
      case "buy":
        await this.buyShipment(ctx, shipment, config, client);
        break;
      case "label":
        await this.labelShipment(ctx, shipment, config, client);
        break;
    }
  }

  async createShipmentForOrders(
    ctx: RequestContext,
    orders: Order[],
    lines: { orderLineId: ID }[],
    size: "small" | "medium" | "large" | "xlarge",
  ) {
    const shippingLines = (
      await Promise.all(
        orders.map(async (o) =>
          this.connection
            .getRepository(ctx, ShippingLine)
            .find({ where: { order: { id: o.id } } }),
        ),
      )
    ).flat();
    const shippingMethodId = shippingLines[0]?.shippingMethodId;
    if (
      !shippingMethodId ||
      shippingLines.find((el) => el.shippingMethodId !== shippingMethodId)
    ) {
      Logger.error(
        `Mismatch on shipping method, multiplie shipping methods for fulfillment not supported`,
        LOGGER_CTX,
      );
      throw new Error(
        "all orders must use same shipping method to dispatch create inpost fulfillment",
      );
    }
    const config = await this.connection
      .getRepository(ctx, InpostConfigEntity)
      .findOne({
        where: {
          shippingMethod: { id: shippingMethodId },
        },
      });
    if (
      !config?.host ||
      !config?.apiKey ||
      !config?.service ||
      !config?.inpostOrganization
    ) {
      Logger.error(
        `Misconfigured inpost config for shipping method ${shippingMethodId}`,
        LOGGER_CTX,
      );
      throw new Error(
        "misconfigured inpost shipping method, host, apiKey, service and organization id are required",
      );
    }
    const { shippingAddress, billingAddress } = orders[0];
    const customerId = orders[0].customerId;
    if (!customerId) {
      Logger.error(`Order ${orders[0].id} customer is missing id`, LOGGER_CTX);
      throw new Error("missing cutomser id");
    }
    const customer =
      orders[0]?.customer ||
      (await this.customerService.findOne(ctx, customerId));
    if (!customer) {
      Logger.error(
        `Could not find customer for order ${orders[0].id}`,
        LOGGER_CTX,
      );
      throw new Error("missing customer");
    }
    const address = shippingAddress || billingAddress;
    const targetPoint = orders[0].customFields.pickupPointId;
    const client = new Client({ host: config.host, apiKey: config.apiKey });
    const refRepo = this.connection.getRepository(ctx, InpostRefEntity);
    const ref = await refRepo.insert({
      orderLines: lines.map(({ orderLineId: id }) => new OrderLine({ id })),
      inpostConfig: config,
    });
    const phone =
      shippingAddress?.phoneNumber ||
      billingAddress?.phoneNumber ||
      customer?.phoneNumber;
    if (!phone) {
      Logger.error(
        `Could not find customer phone number for order ${orders[0].id}`,
        LOGGER_CTX,
      );
      throw new Error("phone number is required");
    }
    const email = customer.emailAddress;
    if (!email) {
      Logger.error(
        `Could not find customer email for order ${orders[0].id}`,
        LOGGER_CTX,
      );
      throw new Error("email is required");
    }
    const shipment = await client
      .organizations()
      .get(config.inpostOrganization)
      .shipments()
      .create({
        receiver: {
          first_name: address.fullName?.split(" ")[0],
          last_name: address.fullName?.split(" ").at(-1),
          company_name: address.company,
          email,
          phone,
          address: {
            line1: address.streetLine1 || "",
            line2: address.streetLine1 || "",
            city: address.city || "",
            country_code:
              (address.countryCode as CountryCode | undefined) ||
              CountryCode.pl,
            post_code: address.postalCode || "",
          },
        },
        parcels: [{ template: size }],
        service: config.service,
        ...(typeof targetPoint === "string" && {
          custom_attributes: { target_point: targetPoint },
        }),
        reference: `INP${ref.identifiers[0]["id"]}`,
      });
    await refRepo.update(ref.identifiers[0], { inpostShipmentId: shipment.id });
    await this.orderProgressJob.add(
      {
        context: ctx.serialize(),
        inpostConfigId: config.id,
        nextStep: "buy",
        shipmentId: shipment.id || 0,
        delay: 300,
      },
      { retries: 3 },
    );
    return shipment;
  }
  async handleUpdateEvent(ctx: RequestContext, body: InpostWebhookEvent) {
    if (
      !body ||
      !body.payload ||
      !("status" in body.payload) ||
      !body.payload.status ||
      !body.payload.shipment_id
    ) {
      Logger.error(
        `Invalid inpost webhook event received: ${JSON.stringify(body)}`,
        LOGGER_CTX,
      );
      return;
    }

    const shipment = await this.connection
      .getRepository(ctx, InpostRefEntity)
      .findOne({
        where: { inpostShipmentId: body.payload.shipment_id },
        relations: ["inpostConfig", "orderLines"],
      });
    if (!shipment) {
      Logger.error(
        `Could not find inpost shipment with id ${body.payload.shipment_id}`,
        LOGGER_CTX,
      );
      return;
    }

    const fulfillment = await this.connection
      .getRepository(ctx, Fulfillment)
      .findOne({ where: { trackingCode: `${shipment.inpostShipmentId}` } });
    if (!fulfillment) {
      Logger.error(
        `Could not find fulfillment with tracking code ${shipment.inpostShipmentId}`,
        LOGGER_CTX,
      );
      return;
    }

    switch (body.payload.status) {
      case "delivered":
        await this.fulfillmentService.transitionToState(
          ctx,
          fulfillment?.id,
          "Delivered",
        );
        break;
      case "taken_by_courier":
      case "taken_by_courier_from_pok":
        await this.fulfillmentService.transitionToState(
          ctx,
          fulfillment?.id,
          "Shipped",
        );
        break;
      case "canceled":
        await this.fulfillmentService.transitionToState(
          ctx,
          fulfillment?.id,
          "Cancelled",
        );
        break;
    }
  }

  async setInpostConfig(
    ctx: RequestContext,
    { shippingMethodId, ...rest }: SetInpostShippingMethodConfigInput,
  ) {
    await this.connection.getRepository(ctx, InpostConfigEntity).insert(
      new InpostConfigEntity({
        ...rest,
        shippingMethod: { id: shippingMethodId },
      }),
    );
  }
}
