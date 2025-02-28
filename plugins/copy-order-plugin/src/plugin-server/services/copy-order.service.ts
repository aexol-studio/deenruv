import { Inject, Injectable } from '@nestjs/common';
import { HistoryService, ID, Order, OrderService, RelationPaths, RequestContext } from '@deenruv/core';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { HistoryEntryType } from '@deenruv/common/lib/generated-types.js';
import { ResolveField, Resolver } from '@nestjs/graphql';
import { CopyOrderPluginOptions } from '../types.js';

export class CopyOrderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CopyOrderError';
    }
}

@Resolver('CopyOrderResult')
export class CopyOrderResultResolver {
    @ResolveField()
    __resolveType(value: unknown): string {
        if (value instanceof CopyOrderError) {
            return 'CopyOrderErrorResponse';
        }
        return 'Order';
    }
}

@Injectable()
export class CopyOrderService {
    private notAllowedStates: Order['state'][] = [];
    constructor(
        private readonly orderService: OrderService,
        private readonly historyService: HistoryService,
        @Inject(PLUGIN_INIT_OPTIONS)
        private options?: CopyOrderPluginOptions,
    ) {
        this.options = options;
        if (this.options?.notAllowedStates) this.notAllowedStates = this.options.notAllowedStates;
    }

    async copyOrder(ctx: RequestContext, id: ID, relations: RelationPaths<Order> = []) {
        const order = await this.orderService.findOne(ctx, id, [
            ...relations,
            'customer',
            'lines',
            'shippingLines.shippingMethod',
        ]);
        if (!order) throw new CopyOrderError('ORDER_NOT_FOUND');
        if (this.notAllowedStates.includes(order.state)) throw new CopyOrderError('ORDER_STATE_NOT_ALLOWED');

        const draftOrder = await this.orderService.createDraft(ctx);
        if (!order.customer) throw new CopyOrderError('ORDER_HAS_NO_CUSTOMER');
        await this.orderService.setShippingAddress(ctx, draftOrder.id, {
            ...order.shippingAddress,
            streetLine1: order.shippingAddress?.streetLine1 || '',
            countryCode: order.shippingAddress?.countryCode || '',
        });
        await this.orderService.setBillingAddress(ctx, draftOrder.id, {
            ...order.billingAddress,
            streetLine1: order.billingAddress?.streetLine1 || '',
            countryCode: order.billingAddress?.countryCode || '',
        });
        await this.orderService.addCustomerToOrder(ctx, draftOrder.id, order.customer);
        await this.orderService.addItemsToOrder(ctx, draftOrder.id, order.lines);
        const shippingMethod = order.shippingLines[0]?.shippingMethod;
        if (shippingMethod)
            await this.orderService.setShippingMethod(ctx, draftOrder.id, [shippingMethod.id]);

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
        if (!final) throw new CopyOrderError('COULD_NOT_COPY_ORDER');
        return final;
    }
}
