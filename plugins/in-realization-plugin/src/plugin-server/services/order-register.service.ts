import { Injectable } from '@nestjs/common';
import {
    Order,
    OrderService,
    ProductService,
    TransactionalConnection,
    UserInputError,
    RequestContext,
    ShippingMethod,
} from '@deenruv/core';
import { PDFService } from './pdf.service.js';
import { OrderRealizationEntity } from '../entities/order-realization.entity.js';
import { ModelTypes } from '../zeus/index.js';

@Injectable()
export class OrderRegisterService {
    constructor(
        private connection: TransactionalConnection,
        private pdfService: PDFService,
        private orderService: OrderService,
        private productService: ProductService,
    ) {}

    private hydrateOrderLines = async (ctx: RequestContext, order: Order) => {
        const lines = await Promise.all(
            order.lines.map(async line => {
                const product = await this.productService.findOne(ctx, line.productVariant.productId);
                return { ...line, product };
            }),
        );
        const payments = await this.orderService.getOrderPayments(ctx, order.id);
        const shippings = await this.orderService.getEligibleShippingMethods(ctx, order.id);
        const shippingMethod = shippings.find(s => s.id === order.shippingLines[0].shippingMethodId);
        return { ...order, lines, payments, shippingMethod };
    };

    private getOrder = async (ctx: RequestContext, orderID: string) => {
        const order = await this.orderService.findOne(ctx, orderID);
        if (!order) throw new UserInputError('Order not found');
        return await this.hydrateOrderLines(ctx, order);
    };

    async getRealization(ctx: RequestContext, orderID: string) {
        return await this.connection.getRepository(ctx, OrderRealizationEntity).findOne({
            where: { orderID },
            order: { createdAt: 'DESC' },
        });
    }

    async registerRealization(ctx: RequestContext, options: ModelTypes['OrderRealizationInput']) {
        const order = (await this.getOrder(ctx, options.orderID)) as unknown as Order & {
            shippingMethod: ShippingMethod;
        };
        const response = await this.pdfService.generateRealizationPDF(ctx, {
            order,
            options,
        });
        if (!response) {
            throw new UserInputError('PDF generation failed');
        }
        const entity = await this.connection.getRepository(ctx, OrderRealizationEntity).save({
            orderID: options.orderID,
            customerID: order.customer?.id as string,
            assetID: options.assets.map(a => a.id).join(','),
            plannedAt: options.plannedAt,
            color: options.color,
            finalPlannedAt: options.finalPlannedAt,
            note: options.note,
            key: response.key,
        });
        const firstRealization = await this.getRealization(ctx, options.orderID);
        const note = firstRealization
            ? `[REALIZACJA] Zmiana realizacji, planowana data: ${options.plannedAt}, finalna data: ${options.finalPlannedAt}.\nNotatka: ${options.note}, kolor kartki: ${options.color}`
            : `[REALIZACJA] Realizacja zarejestrowana, planowana data: ${options.plannedAt}, finalna data: ${options.finalPlannedAt}.\nNotatka: ${options.note}, kolor kartki: ${options.color}`;
        await this.orderService.addNoteToOrder(ctx, {
            id: options.orderID,
            note,
            isPublic: false,
        });
        return { ...entity, url: response.url };
    }
}
