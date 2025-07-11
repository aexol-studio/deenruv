import { Ctx, Product, RequestContext } from "@deenruv/core";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UpsellService } from "../services/upsell.service.js";

@Resolver("Product")
export class UpsellProductResolver {
  constructor(private upsellService: UpsellService) {}

  @ResolveField("upsellProducts")
  async upsellProducts(@Ctx() ctx: RequestContext, @Parent() product: Product) {
    return this.upsellService.upsells(ctx, product.id);
  }
}
