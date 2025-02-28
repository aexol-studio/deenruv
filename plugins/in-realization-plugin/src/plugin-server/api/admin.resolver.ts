import { Mutation, Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, ID, Permission, RequestContext, Transaction } from '@deenruv/core';
import { OrderRegisterService } from '../services/order-register.service';
import { StorageService } from '../services/storage.service';
import { ModelTypes } from '../zeus/index.js';

@Resolver()
export class AdminResolver {
    constructor(
        private orderRegisterService: OrderRegisterService,
        private storageService: StorageService,
    ) {}

    @Allow(Permission.UpdateOrder)
    @Transaction()
    @Mutation()
    async registerRealization(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: ModelTypes['OrderRealizationInput'] },
    ) {
        return this.orderRegisterService.registerRealization(ctx, args.input);
    }

    @Allow(Permission.UpdateOrder)
    @Query()
    async getRealizationURL(@Ctx() ctx: RequestContext, @Args() args: { orderID: ID }) {
        const realization = await this.orderRegisterService.getRealization(ctx, args.orderID as string);
        if (!realization) return null;
        const url = await this.storageService.getSingedFileUrl(realization.key);
        return url;
    }
}
