import { Injectable } from '@nestjs/common';
import {
    Order,
    OrderService,
    ProductService,
    TransactionalConnection,
    UserInputError,
    PaymentService,
    ShippingMethodService,
    UserService,
    RequestContext,
} from '@deenruv/core';
import { PDFService } from './pdf.service';
import { OrderRealizationEntity } from '../entities/order-realization.entity';
import { ProFormaEntity } from '../entities/pro-forma.entity';

@Injectable()
export class OrderRegisterService {
    constructor(
        private connection: TransactionalConnection,
        private pdfService: PDFService,
        private orderService: OrderService,
        private productService: ProductService,
        private userService: UserService,
        private paymentService: PaymentService,
        private shippingMethodService: ShippingMethodService,
    ) {}

    private hydrateOrderLines = async (ctx: any, order: Order) => {
        const lines = await Promise.all(
            order.lines.map(async line => {
                const product = await this.productService.findOne(ctx, line.productVariant.productId);
                return { ...line, product };
            }),
        );
        const payments = await this.orderService.getOrderPayments(ctx, order.id);
        const shippings = await this.orderService.getEligibleShippingMethods(ctx, order.id);
        const shippingMethod = shippings.find(s => s.id === order.shippingLines[0].shippingMethodId) as any;

        return { ...order, lines, payments, shippingMethod };
    };

    private getOrder = async (ctx: any, orderID: string) => {
        const order = await this.orderService.findOne(ctx, orderID);
        if (!order) throw new UserInputError('Order not found');
        return await this.hydrateOrderLines(ctx, order);
    };

    async getRealization(ctx: any, orderID: string) {
        return await this.connection.getRepository(ctx, OrderRealizationEntity).findOne({
            where: { orderID },
            order: { createdAt: 'DESC' },
        });
    }

    async getProforma(ctx: any, orderID: string) {
        return await this.connection.getRepository(ctx, ProFormaEntity).findOne({ where: { orderID } });
    }

    async registerRealization(
        ctx: RequestContext,
        args: {
            orderID: string;
            assets: { id: string; orderLineID: string; preview: string }[];
            plannedAt: string;
            color: string;
            finalPlannedAt: string;
            note: string;
        },
    ) {
        const order = await this.getOrder(ctx, args.orderID);
        const response = await this.pdfService.generateRealizationPDF(ctx, {
            ...args,
            order,
        });
        if (!response) {
            throw new UserInputError('PDF generation failed');
        }
        const entity = await this.connection.getRepository(ctx, OrderRealizationEntity).save({
            orderID: args.orderID,
            customerID: order.customer?.id as string,
            assetID: args.assets.map(a => a.id).join(','),
            plannedAt: args.plannedAt,
            color: args.color,
            finalPlannedAt: args.finalPlannedAt,
            note: args.note,
            key: response.key,
        });

        const firstRealization = await this.getRealization(ctx, args.orderID);
        const note = firstRealization
            ? `[REALIZACJA] Zmiana realizacji, planowana data: ${args.plannedAt}, finalna data: ${args.finalPlannedAt}.\nNotatka: ${args.note}, kolor kartki: ${args.color}`
            : `[REALIZACJA] Realizacja zarejestrowana, planowana data: ${args.plannedAt}, finalna data: ${args.finalPlannedAt}.\nNotatka: ${args.note}, kolor kartki: ${args.color}`;
        // await this.orderService.addNoteToOrder(ctx, {
        //   id: args.orderID,
        //   note: `[REALIZACJA] Link do realizacji: ${response.url}`,
        //   isPublic: false,
        // });
        await this.orderService.addNoteToOrder(ctx, {
            id: args.orderID,
            note,
            isPublic: false,
        });
        return { ...entity, url: response.url };
    }

    async registerProforma(ctx: any, args: { orderID: string }) {
        const customerID = ctx.activeUserId;
        const order = await this.getOrder(ctx, args.orderID);
        const data = await this.pdfService.generatePROFormaPDF(ctx, { order });
        if (!data) {
            throw new UserInputError('PDF generation failed');
        }
        const PROForma = new ProFormaEntity({
            proformaID: args.orderID,
            orderID: args.orderID,
            customerID,
            key: data.key,
        });
        await this.connection.getRepository(ctx, ProFormaEntity).save(PROForma);
        return data?.url;
    }
}
