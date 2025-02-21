import { Inject, Injectable } from '@nestjs/common';
import { HistoryService, ID, Order, OrderService, RelationPaths, RequestContext } from '@deenruv/core';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { HistoryEntryType } from '@deenruv/common/lib/generated-types.js';

@Injectable()
export class CopyOrderService {
    constructor(
        private readonly orderService: OrderService,
        private readonly historyService: HistoryService,
        @Inject(PLUGIN_INIT_OPTIONS)
        private options?: {},
    ) {
        this.options = options;
    }

    async copyOrder(ctx: RequestContext, id: ID, relations: RelationPaths<Order> = []) {
        const order = await this.orderService.findOne(ctx, id, relations.concat(['customer']));
        if (!order) {
            throw new Error('Order not found');
        }
        const draftOrder = await this.orderService.createDraft(ctx);
        if (!order.customer) {
            throw new Error('Order must have a customer');
        }

        await this.orderService.setShippingAddress(ctx, draftOrder.id, {
            ...order.shippingAddress,
            streetLine1: order.shippingAddress?.streetLine1 || '',
            countryCode: order.shippingAddress?.countryCode || 'pl',
        });
        await this.orderService.setBillingAddress(ctx, draftOrder.id, {
            ...order.billingAddress,
            streetLine1: order.billingAddress?.streetLine1 || '',
            countryCode: order.billingAddress?.countryCode || 'pl',
        });
        await this.orderService.addCustomerToOrder(ctx, draftOrder.id, order.customer);
        await this.orderService.addItemsToOrder(ctx, draftOrder.id, []);
        await this.orderService.setShippingMethod(ctx, draftOrder.id, []);

        const history = await this.historyService.getHistoryForOrder(ctx, order.id, false);
        for (const entry of history.items) {
            if (entry.type === HistoryEntryType.ORDER_NOTE) {
                await this.historyService.createHistoryEntryForOrder(
                    { ctx, data: entry.data, type: entry.type, orderId: draftOrder.id },
                    entry.isPublic,
                );
            }
        }
        await this.historyService.createHistoryEntryForOrder(
            {
                ctx,
                data: { note: 'createCopyNote' },
                orderId: draftOrder.id,
                type: HistoryEntryType.ORDER_NOTE,
            },
            false,
        );

        const final = await this.orderService.findOne(ctx, draftOrder.id, relations);
        if (!final) {
            throw new Error('Order not found');
        }
        return final;
    }
}
