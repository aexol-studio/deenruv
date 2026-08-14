import { Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, Transaction } from "@deenruv/core";
import { Args, Mutation, Query } from "@nestjs/graphql";
import type { RequestContext } from "@deenruv/core";
import { BadgeService } from "../services/badge.service.js";
import type {
  CreateBadgeInput,
  EditBadgeInput,
  GetProductBadgesInput,
  RemoveBadgeInput,
} from "../extensions/badge.extension.js";

@Resolver()
export class BadgeAdminResolver {
  constructor(private badgeService: BadgeService) {}

  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async createBadge(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateBadgeInput },
  ) {
    return this.badgeService.createBadge(ctx, args.input);
  }
  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async removeBadge(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: RemoveBadgeInput },
  ) {
    return this.badgeService.removeBadge(ctx, args.input.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async editBadge(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: EditBadgeInput },
  ) {
    return this.badgeService.editBadge(ctx, args.input);
  }

  @Query()
  async getProductBadges(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: GetProductBadgesInput },
  ) {
    return this.badgeService.findAll(ctx, [args.input.productId]);
  }
}
