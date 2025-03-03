import { Injectable, NotFoundException } from '@nestjs/common';
import {
    AssetService,
    EventBus,
    ID,
    Order,
    OrderService,
    Payment,
    RequestContext,
    TransactionalConnection,
} from '@deenruv/core';
import { Przelewy24NotificationBody } from '../types';
import { verifyPrzelewy24Payment } from '../verify';
import { Przelewy24ReminderEvent } from '../email-event';

@Injectable()
export class Przelewy24Service {
    constructor(
        public readonly orderService: OrderService,
        public readonly assetService: AssetService,
        private eventBus: EventBus,
        public connection: TransactionalConnection,
    ) {}

    async reminder(ctx: RequestContext, args: { orderId: ID }) {
        this.eventBus.publish(new Przelewy24ReminderEvent(ctx, args));
    }

    async verifyPayment(body: Przelewy24NotificationBody) {
        return verifyPrzelewy24Payment(body);
    }

    async settlePayment(ctx: RequestContext, paymentId: ID) {
        await this.orderService.settlePayment(ctx, paymentId);
    }

    async cancelPayment(ctx: RequestContext, payment: Payment) {
        try {
            await this.connection.getRepository(ctx, Payment).update(payment.id, {
                state: 'Cancelled',
            });
            await this.connection.getRepository(ctx, Order).update(payment.order.id, {
                state: 'ArrangingAdditionalPayment',
            });
        } catch (err) {
            console.log(err);
        }
    }

    async findPaymentByTransactionId(ctx: RequestContext, transactionId: string) {
        const payment = await this.connection.getRepository(ctx, Payment).findOne({
            where: { transactionId },
            relations: ['order'],
        });
        if (!payment) throw new NotFoundException();
        return payment;
    }
}
