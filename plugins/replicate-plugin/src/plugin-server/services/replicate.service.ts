import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { REPLICATE_PLUGIN_OPTIONS, LOGGER_CTX } from "../constants.js";
import {
  ReplicatePluginOptions,
  ModelTrainingQueueType,
  OrderExportQueueType,
} from "../types.js";
import {
  Job,
  JobQueue,
  JobQueueService,
  Logger,
  RequestContext,
  OrderService,
  PaginatedList,
  Order,
  CustomerService,
  TransactionalConnection,
  ID,
  Customer,
  ListQueryBuilder,
  ListQueryOptions,
} from "@deenruv/core";
import fs from "fs";
import path from "path";
import axios, { get } from "axios";
import {
  PredictionType,
  StartOrderExportToReplicateInput,
  StartModelTraningInput,
} from "../graphql/generated-admin-types.js";
import { SortOrder } from "@deenruv/common/lib/generated-types.js";
import { mkdtemp, rm } from "fs/promises";
import { ReplicateEntity } from "../entites/replicate.entity.js";
import { PredictionStatus } from "../zeus/index.js";
import { In } from "typeorm";

@Injectable()
export class ReplicateService implements OnModuleInit {
  private modelTrainingQueue: JobQueue<ModelTrainingQueueType>;
  private orderExportQueue: JobQueue<OrderExportQueueType>;

  constructor(
    @Inject(REPLICATE_PLUGIN_OPTIONS)
    private readonly options: ReplicatePluginOptions,
    @Inject(TransactionalConnection)
    private readonly connection: TransactionalConnection,
    @Inject(JobQueueService) private readonly jobQueueService: JobQueueService,
    @Inject(OrderService) private readonly orderService: OrderService,
    @Inject(CustomerService) private readonly customerService: CustomerService,
    @Inject(ListQueryBuilder)
    private readonly listQueryBuilder: ListQueryBuilder,
  ) {}

  async processModelTrainingJob(job: Job<ModelTrainingQueueType>) {
    Logger.info("initializing model training", LOGGER_CTX);
    const { serializedContext, startDate, endDate } = job.data;
    const ctx = RequestContext.deserialize(serializedContext);
    await this.startModelTraining(ctx, { startDate, endDate });
    this.jobQueueService.start();
  }

  async processOrderExportJob(job: Job<OrderExportQueueType>) {
    Logger.info("initializing order export", LOGGER_CTX);
    const {
      replicateEntityID,
      serializedContext,
      startDate,
      endDate,
      showMetrics,
    } = job.data;
    const ctx = RequestContext.deserialize(serializedContext);
    await this.startOrderExportJob(ctx, {
      replicateEntityID,
      startDate,
      endDate,
      showMetrics,
    });
    this.jobQueueService.start();
  }
  async modelTrainingJob(ctx: RequestContext, input: StartModelTraningInput) {
    const serializedContext = ctx.serialize();
    await this.modelTrainingQueue.add({
      serializedContext,
      numLastOrder: input.numLastOrder ?? 30000,
      startDate: input.startDate ?? "",
      endDate: input.endDate ?? "",
    });
  }

  async getPredictionID(ctx: RequestContext, prediction_id: string) {
    const entity = await this.connection
      .getRepository(ctx, ReplicateEntity)
      .findOne({
        where: { id: prediction_id },
      });
    return entity?.prediction_id;
  }

  async orderExportJob(
    ctx: RequestContext,
    input: StartOrderExportToReplicateInput,
  ) {
    const entity = await this.connection
      .getRepository(ctx, ReplicateEntity)
      .save({});
    const serializedContext = ctx.serialize();
    await this.orderExportQueue.add({
      replicateEntityID: entity.id,
      serializedContext,
      startDate: input.startDate ?? "",
      endDate: input.endDate ?? "",
      predictType: input.predictType ?? PredictionType.RFM_SCORE,
      showMetrics: input.showMetrics ?? false,
    });
    return entity.id;
  }

  async onModuleInit() {
    this.modelTrainingQueue = await this.jobQueueService.createQueue({
      name: "train-model",
      process: (job) => {
        return this.processModelTrainingJob(job as Job<ModelTrainingQueueType>);
      },
    });

    this.orderExportQueue = await this.jobQueueService.createQueue({
      name: "order-export",
      process: (job) => {
        return this.processOrderExportJob(job as Job<OrderExportQueueType>);
      },
    });
  }

  async startModelTraining(ctx: RequestContext, input: StartModelTraningInput) {
    try {
      const { numLastOrder } = input;

      const customerService = this.customerService;
      const orderService = this.orderService;

      for (let i = 0; i < (numLastOrder ?? 30000); i++) {
        const uniqueEmail = `test${i}_${Date.now()}@example.com`;
        const customer = await customerService.create(ctx, {
          emailAddress: uniqueEmail,
          firstName: "test",
          lastName: "replicatetest",
          phoneNumber: "123456789",
          title: "Mr",
        });

        if ("errorCode" in customer) {
          Logger.error(
            `Failed to create customer: ${customer.errorCode}`,
            LOGGER_CTX,
          );
          continue;
        }

        const randomNumber = Math.floor(Math.random() * 7) + 1;
        for (let j = 0; j < randomNumber; j++) {
          const order = await orderService.addCustomerToOrder(
            ctx,
            await orderService.create(ctx, 1),
            customer,
          );
          const itemsToAdd = Math.floor(Math.random() * 5) + 1;
          await orderService.addItemToOrder(ctx, order.id, 1, itemsToAdd);

          await orderService.transitionToState(ctx, order.id, "AddingItems");

          await orderService.setShippingAddress(ctx, order.id, {
            streetLine1: "test",
            countryCode: "PL",
          });

          await orderService.setShippingMethod(ctx, order.id, [1, 2]);

          await orderService.transitionToState(
            ctx,
            order.id,
            "ArrangingPayment",
          );

          await orderService.addPaymentToOrder(ctx, order.id, {
            method: "standard-payment",
            metadata: {
              transfer_group: "",
            },
          });

          await orderService.transitionToState(
            ctx,
            order.id,
            "PaymentAuthorized",
          );
        }
      }
    } catch (error) {
      Logger.error("model training failed", LOGGER_CTX);
      console.error("Error:", error);
    }
  }

  async startOrderExportJob(
    ctx: RequestContext,
    input: StartOrderExportToReplicateInput & { replicateEntityID: ID },
  ) {
    const { showMetrics, replicateEntityID } = input;
    let { startDate, endDate, predictType } = input;
    startDate = startDate || null;
    endDate = endDate || null;
    predictType = predictType ?? PredictionType.RFM_SCORE;
    Logger.info("starting order export", LOGGER_CTX);
    const columnNames = [
      "InvoiceNo",
      "InvoiceDate",
      "Total",
      "CustomerId",
      "Products",
    ];
    const csv = [columnNames.join(",")];

    const LatestOrders = await this.orderService.findAll(ctx, {
      filter: {
        orderPlacedAt:
          startDate && endDate
            ? {
                between: {
                  start: new Date(startDate),
                  end: new Date(endDate),
                },
              }
            : { isNull: false },
      },
    });

    const numLatestOrders = LatestOrders.totalItems;

    let batch = 1;
    if (numLatestOrders > 1000) {
      batch = Math.ceil(numLatestOrders / 1000);
    }

    for (let i = 0; i < batch; i++) {
      const orders = await this.orderService.findAll(ctx, {
        skip: i * 1000,
        take: 1000,
        filter: {
          orderPlacedAt:
            startDate && endDate
              ? {
                  between: {
                    start: new Date(startDate),
                    end: new Date(endDate),
                  },
                }
              : { isNull: false },
        },
        sort: {
          orderPlacedAt: SortOrder.DESC,
        },
      });

      if (!orders.items.length) break;
      await this.saveOrdersToCsv(csv, orders);
    }

    const csvString = csv.join("\n");
    const tmp = await mkdtemp("orders");
    const filePath = path.join(tmp, "./orders.csv");
    fs.writeFileSync(filePath, csvString);
    Logger.info("order export completed", LOGGER_CTX);

    const result = await this.triggerPredictApi(
      filePath,
      predictType,
      showMetrics || false,
    );
    if (!result) {
      throw new Error("Failed to trigger predict API");
    }
    const { prediction_id, status } = result;

    await this.connection
      .getRepository(ctx, ReplicateEntity)
      .update(
        { id: replicateEntityID, status: status },
        { prediction_id, status },
      );

    await rm(tmp, { recursive: true, force: true });
  }

  private async randomDate(
    start: Date,
    end: Date,
    startHour: number,
    endHour: number,
  ) {
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    const hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    date.setHours(hour);
    return date;
  }

  private async saveOrdersToCsv(csv: any, orders: PaginatedList<Order>) {
    const orderData = await Promise.all(
      orders.items.map(async (order) => {
        return [
          order.id,
          (
            order.orderPlacedAt ??
            (await this.randomDate(
              new Date(2024, 1, 1),
              new Date(2025, 1, 1),
              0,
              23,
            ))
          ).toISOString(),
          order.totalWithTax,
          order.customerId,
          "ALL",
        ].join(",");
      }),
    );
    csv.push(...orderData);
  }

  private async triggerPredictApi(
    filePath: string,
    predictType: PredictionType,
    showMetrics: boolean,
  ) {
    try {
      const fileData = await fs.promises.readFile(filePath);
      const base64Data = fileData.toString("base64");
      const fileInput = `data:text/csv;base64,${base64Data}`;

      let replicatePredictType: string = "";
      if (predictType === PredictionType.RFM_SCORE)
        replicatePredictType = "rfm-score";
      if (predictType === PredictionType.SEGMENTATION)
        replicatePredictType = "segmentation";

      if (!this.options.deploymentName === undefined) {
        throw new Error("Replicate: deployment name token not set");
      }

      if (!this.options.apiToken === undefined) {
        throw new Error("Replicate: API token not set");
      }

      const response = await axios.post(
        `https://api.replicate.com/v1/deployments/aexol-studio/${this.options.deploymentName}/predictions`,
        {
          input: {
            data_path: fileInput,
            predict_type: replicatePredictType,
            show_metrics: showMetrics,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            "Content-Type": `application/json`,
          },
        },
      );

      return { prediction_id: response.data.id, status: response.data.status };
    } catch (error) {
      Logger.error("API call to replicate failed", LOGGER_CTX);
      console.error("Error:", error);
    }
  }

  async checkAndUpdatePredictionStatus(
    ctx: RequestContext,
    prediction_id: string,
  ) {
    try {
      const response = await axios.get<{
        status: string;
        output: string;
        completed_at: string;
        error: string;
      }>(`https://api.replicate.com/v1/predictions/${prediction_id}`, {
        headers: {
          Authorization: `Bearer ${this.options.apiToken}`,
          "Content-Type": "application/json",
        },
      });

      const status = response.data.status;
      let outputDict: { [key: string]: number } = {};

      if (response?.data?.error) {
        await this.connection.getRepository(ctx, ReplicateEntity).update(
          { prediction_id },
          {
            status: PredictionStatus.failed,
            finishedAt: response.data.completed_at,
          },
        );
        return { predictions: [], status: PredictionStatus.failed };
      }

      try {
        outputDict = JSON.parse(response?.data?.output || "{}") as Record<
          string,
          number
        >;
      } catch (error) {
        Logger.error("Failed to parse output", LOGGER_CTX);
      }

      const data: [string, number][] = [];

      for (const key in outputDict) {
        data.push([key, outputDict[key]]);
      }
      data.sort(([_1, ascore], [_2, bscore]) => bscore - ascore);

      const predictions: {
        customer: Customer | undefined;
        id: string;
        score: number;
      }[] = [];
      for (let i = 0; i < data.length; i += 100) {
        const view = data.slice(i, Math.max(i + 100, data.length));
        const res = await this.connection.getRepository(ctx, Customer).find({
          where: {
            id: In(view.map(([id]) => parseInt(id))),
          },
        });

        predictions.push(
          ...view
            .map(([id, score]) => {
              const customer = res.find((r) => +r.id === +id);
              if (!customer?.emailAddress) {
                return null;
              }
              return {
                id,
                score,
                customer: res.find((r) => +r.id === +id),
              };
            })
            .filter(
              (x): x is { customer: Customer; id: string; score: number } =>
                !!x,
            ),
        );
      }

      const output = predictions.map(({ customer, score }) => ({
        customerId: customer?.id,
        score,
        customer,
      }));

      if (status !== "starting" && response.data.output) {
        await this.connection.getRepository(ctx, ReplicateEntity).update(
          { prediction_id },
          {
            output: output,
            status: status,
            finishedAt: response.data.completed_at,
          },
        );
      }
    } catch (error) {
      Logger.error(
        "API call to check and update prediction status failed",
        LOGGER_CTX,
      );
      console.error("Error:", error);
    }
  }

  async getPredictionItems(
    ctx: RequestContext,
    options?: ListQueryOptions<ReplicateEntity>,
  ): Promise<PaginatedList<ReplicateEntity>> {
    const qb = this.listQueryBuilder.build(ReplicateEntity, options, { ctx });
    const [items, totalItems] = await qb.getManyAndCount();
    return { items, totalItems };
  }

  async getPredictionItem(ctx: RequestContext, id: string) {
    const prediction = await this.connection
      .getRepository(ctx, ReplicateEntity)
      .findOne({ where: { id } });
    if (!prediction) {
      throw new Error("Prediction not found");
    }

    if (prediction.status === PredictionStatus.starting) {
      await this.checkAndUpdatePredictionStatus(
        ctx,
        prediction.prediction_id.toString(),
      );
    }

    if (prediction.output) {
      const output = await Promise.all(
        prediction.output.map(async ({ customerId, score }) => {
          const customer = await this.connection
            .getRepository(ctx, Customer)
            .findOne({ where: { id: customerId } });
          return {
            id: customerId,
            score,
            customer,
          };
        }),
      );

      return { status: prediction.status, predictions: output };
    }
    return { status: prediction.status, predictions: [] };
  }
}
