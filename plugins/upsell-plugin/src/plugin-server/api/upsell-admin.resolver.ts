import { Mutation, Args, Query, Resolver } from "@nestjs/graphql";
import { Ctx, ID, RequestContext } from "@deenruv/core";
import { ResolverInputTypes } from "../zeus/index.js";
import { UpsellService } from "../services/upsell.service.js";

@Resolver()
export class UpsellAdminResolver {
  constructor(private upsellService: UpsellService) {}

  @Query()
  async upsellProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productID: ID },
  ) {
    return this.upsellService.upsells(ctx, args.productID);
  }

  @Mutation()
  async createUpsell(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: ResolverInputTypes["UpsellInput"][] },
  ) {
    return this.upsellService.createUpsell(ctx, args.input);
  }

  @Mutation()
  async deleteUpsell(
    @Ctx() ctx: RequestContext,

    @Args() args: { input: ResolverInputTypes["UpsellInput"][] },
  ) {
    return this.upsellService.deleteUpsell(ctx, args.input);
  }
}
