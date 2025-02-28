import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Transaction } from '@deenruv/core';
import { WFirmaService } from '../services/wfirma.service';
import { ResolverInputTypes } from '../zeus';

@Resolver()
export class WFirmaAdminResolver {
    constructor(private wFirmaService: WFirmaService) {}

    @Transaction()
    @Mutation()
    async sendInvoiceToWFirma(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: ResolverInputTypes['SendInvoiceToWFirmaInput'] },
    ) {
        return await this.wFirmaService.createInvoice(ctx, args.input);
    }
}
