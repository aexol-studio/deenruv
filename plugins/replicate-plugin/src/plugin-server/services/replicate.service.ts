import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { REPLICATE_PLUGIN_OPTIONS, LOGGER_CTX } from '../constants.js';
import { ReplicatePluginOptions, ModelTrainingQueueType, OrderExportQueueType } from '../types.js';
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
} from '@deenruv/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import {
    PredictionType,
    StartOrderExportToReplicateInput,
    StartModelTraningInput,
} from '../graphql/generated-admin-types.js';
import { SortOrder } from '@deenruv/common/lib/generated-types.js';
import { mkdtemp, rm } from 'fs/promises';
import { ReplicateEntity } from '../entites/replicate.entity.js';
import { PredictionStatus } from '../zeus/index.js';
import { In } from 'typeorm';

@Injectable()
export class ReplicateService implements OnModuleInit {
    private modelTrainingQueue: JobQueue<ModelTrainingQueueType>;
    private orderExportQueue: JobQueue<OrderExportQueueType>;

    constructor(
        @Inject(REPLICATE_PLUGIN_OPTIONS) private readonly options: ReplicatePluginOptions,
        @Inject(TransactionalConnection) private readonly connection: TransactionalConnection,
        @Inject(JobQueueService) private readonly jobQueueService: JobQueueService,
        @Inject(OrderService) private readonly orderService: OrderService,
        @Inject(CustomerService) private readonly customerService: CustomerService,
    ) {}

    async processModelTrainingJob(job: Job<ModelTrainingQueueType>) {
        Logger.info('initializing model training', LOGGER_CTX);
        const { serializedContext, numLastOrder, startDate, endDate } = job.data;
        const ctx = RequestContext.deserialize(serializedContext);
        await this.startModelTraining(ctx, { numLastOrder, startDate, endDate });
        this.jobQueueService.start();
    }

    async processOrderExportJob(job: Job<OrderExportQueueType>) {
        Logger.info('initializing order export', LOGGER_CTX);
        const { replicateEntityID, serializedContext, numLastOrder, startDate, endDate, showMetrics } =
            job.data;
        const ctx = RequestContext.deserialize(serializedContext);
        await this.startOrderExportJob(ctx, {
            replicateEntityID,
            numLastOrder,
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
            startDate: input.startDate ?? '',
            endDate: input.endDate ?? '',
        });
    }

    async getPredictionID(ctx: RequestContext, prediction_id: string) {
        const entity = await this.connection.getRepository(ctx, ReplicateEntity).findOne({
            where: { id: prediction_id },
        });
        return entity?.prediction_id;
    }

    async orderExportJob(ctx: RequestContext, input: StartOrderExportToReplicateInput) {
        const entity = await this.connection.getRepository(ctx, ReplicateEntity).save({});
        const serializedContext = ctx.serialize();
        await this.orderExportQueue.add({
            replicateEntityID: entity.id,
            serializedContext,
            numLastOrder: input.numLastOrder ?? 30000,
            startDate: input.startDate ?? '',
            endDate: input.endDate ?? '',
            predictType: input.predictType ?? PredictionType.RFM_SCORE,
            showMetrics: input.showMetrics ?? false,
        });
        return entity.id;
    }

    async onModuleInit() {
        this.modelTrainingQueue = await this.jobQueueService.createQueue({
            name: 'train-model',
            process: job => {
                return this.processModelTrainingJob(job as Job<ModelTrainingQueueType>);
            },
        });

        this.orderExportQueue = await this.jobQueueService.createQueue({
            name: 'order-export',
            process: job => {
                return this.processOrderExportJob(job as Job<OrderExportQueueType>);
            },
        });
    }

    async startModelTraining(ctx: RequestContext, input: StartModelTraningInput) {
        try {
            const { numLastOrder, startDate, endDate } = input;

            const startDateObj = new Date(startDate) || new Date(2024, 1, 1);
            const endDateObj = new Date(endDate) || new Date(2025, 1, 1);

            const customerService = this.customerService;
            const orderService = this.orderService;

            for (let i = 0; i < (numLastOrder ?? 30000); i++) {
                const uniqueEmail = `test${i}_${Date.now()}@example.com`;
                const customer = await customerService.create(ctx, {
                    emailAddress: uniqueEmail,
                    firstName: 'test',
                    lastName: 'replicatetest',
                    phoneNumber: '123456789',
                    title: 'Mr',
                });

                if ('errorCode' in customer) {
                    Logger.error(`Failed to create customer: ${customer.errorCode}`, LOGGER_CTX);
                    continue;
                }

                const randomNumber = Math.floor(Math.random() * 7) + 1;
                for (let j = 0; j < randomNumber; j++) {
                    const order = await orderService.addCustomerToOrder(
                        ctx,
                        await orderService.create(ctx, 1),
                        customer,
                    );
                    for (let k = 0; k < Math.floor(Math.random() * 5) + 1; k++) {
                        await orderService.addItemToOrder(ctx, order.id, 1, 1);
                    }
                    const randomDate = await this.randomDate(startDateObj, endDateObj, 0, 23);
                    order.orderPlacedAt = randomDate;
                }
            }
        } catch (error) {
            Logger.error('model training failed', LOGGER_CTX);
            console.error('Error:', error);
        }
    }

    async startOrderExportJob(
        ctx: RequestContext,
        input: StartOrderExportToReplicateInput & { replicateEntityID: ID },
    ) {
        let { numLastOrder, startDate, endDate, predictType, showMetrics, replicateEntityID } = input;
        numLastOrder = numLastOrder || 30000;
        startDate = startDate || null;
        endDate = endDate || null;
        predictType = predictType ?? PredictionType.RFM_SCORE;
        Logger.info('starting order export', LOGGER_CTX);
        const columnNames = ['InvoiceNo', 'InvoiceDate', 'Total', 'CustomerId', 'Products'];
        const csv = [columnNames.join(',')];

        let batch = 1;
        if (numLastOrder > 1000) {
            batch = Math.ceil(numLastOrder / 1000);
        }

        for (let i = 0; i < batch; i++) {
            const orders = await this.orderService.findAll(ctx, {
                skip: i * 1000,
                take: 1000,
                filter: {
                    orderPlacedAt: startDate && endDate 
                      ? {
                            between: {
                                start: new Date(startDate),
                                end: new Date(endDate),
                            },
                        }
                      : { isNull: false }
                },
                sort: {
                    orderPlacedAt: SortOrder.DESC,
                },
            });

            if (!orders.items.length) break;
            await this.saveOrdersToCsv(csv, orders);
        }

        const csvString = csv.join('\n');
        const tmp = await mkdtemp('orders');
        const filePath = path.join(tmp, './orders.csv');
        fs.writeFileSync(filePath, csvString);

        Logger.info(`Orders saved to ${filePath}`, LOGGER_CTX);
        Logger.info('order export completed', LOGGER_CTX);

        const prediction_id = await this.triggerPredictApi(filePath, predictType, showMetrics || false);
        await rm(tmp, { recursive: true, force: true });

        await this.connection
            .getRepository(ctx, ReplicateEntity)
            .update({ id: replicateEntityID }, { prediction_id });
    }

    private async randomDate(start: Date, end: Date, startHour: number, endHour: number) {
        var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
        date.setHours(hour);
        return date;
    }

    private async saveOrdersToCsv(csv: any, orders: PaginatedList<Order>) {
        const orderData = await Promise.all(
            orders.items.map(async order => {
                return [
                    order.id,
                    (
                        order.orderPlacedAt ??
                        (await this.randomDate(new Date(2024, 1, 1), new Date(2025, 1, 1), 0, 23))
                    ).toISOString(),
                    order.totalWithTax,
                    order.customerId,
                    'ALL',
                ].join(',');
            }),
        );
        csv.push(...orderData);
    }

    private async triggerPredictApi(filePath: string, predictType: PredictionType, showMetrics: boolean) {
        try {
            const fileData = await fs.promises.readFile(filePath);
            const base64Data = fileData.toString('base64');
            const fileInput = `data:text/csv;base64,${base64Data}`;

            let replicatePredictType: string = '';
            if (predictType === PredictionType.RFM_SCORE) replicatePredictType = 'rfm-score';
            if (predictType === PredictionType.SEGMENTATION) replicatePredictType = 'segmentation';

            if (!this.options.deploymentName === undefined) {
                throw new Error('Replicate: deployment name token not set');
            }

            if (!this.options.apiToken === undefined) {
                throw new Error('Replicate: API token not set');
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
                        'Content-Type': `application/json`,
                    },
                },
            );

            return response.data.id;
        } catch (error) {
            Logger.error('API call to replicate failed', LOGGER_CTX);
            console.error('Error:', error);
        }
    }

    async getPrediction(ctx: RequestContext, prediction_id: string) {
        try {
            const response = await axios.get<{ status: string; output: string }>(`https://api.replicate.com/v1/predictions/${prediction_id}`, {
                headers: {
                    Authorization: `Bearer ${this.options.apiToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const status = response.data.status;
            let outputDict: { [key: string]: number } = {};
            if (!response?.data?.output) {
                return { predictions: [], status };
            }

            try {
                outputDict = JSON.parse(response?.data?.output || '{}') as Record<string, number>;
            } catch (error) {
                Logger.error('Failed to parse output', LOGGER_CTX);
            }

            const data: [string, number][] = [];

            for (const key in outputDict) {
                data.push([key, outputDict[key]]);
            }
            data.sort(([_1, ascore], [_2, bscore]) => bscore - ascore);

            const predictions: {
                email: string;
                id: string;
                score: number;
            }[] = [];
            for (let i = 0; i < data.length; i+=100) {
                const view = data.slice(i, Math.max(i+100, data.length));
                const res = (await this
                    .connection
                    .getRepository(ctx, Order)
                    .createQueryBuilder('o')
                    .leftJoin('o.customer', 'c')
                    .select(['o.id', 'c.emailAddress'])
                    .where({
                        id: In(view.map((v) => parseInt(v[0])))
                    })
                    .getRawMany()) as {id: string, emailAddress: string}[];
                console.log(res);

                predictions.push(...view.map(([id, score]) => ({
                    id,
                    score,
                    email: res.find((r) => r.id === id)?.emailAddress || '',
                })));
            }

            return { predictions, status };
        } catch (error) {
            Logger.error('API call to get prediction failed', LOGGER_CTX);
            console.error('Error:', error);
            return { predictions: [], status: PredictionStatus.failed };
        }
    }
}
