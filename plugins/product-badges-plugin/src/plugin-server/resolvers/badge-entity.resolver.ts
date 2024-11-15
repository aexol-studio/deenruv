import { Parent, Resolver, ResolveField } from "@nestjs/graphql";
import { Ctx, Product, RequestContext } from "@deenruv/core";
import { BadgeService } from "../services/badge.service.js";

@Resolver("Product")
export class BadgesResolver {
  constructor(private badgeService: BadgeService) {}

  @ResolveField()
  async badges(@Ctx() ctx: RequestContext, @Parent() parent: Product) {
    return this.badgeService.findAll(ctx, [parent.id]);
  }
}
