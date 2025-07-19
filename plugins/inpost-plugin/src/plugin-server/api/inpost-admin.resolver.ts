import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { InpostService } from "../services/inpost.service.js";
import { SetInpostShippingMethodConfigInput } from "../types.js";

@Resolver()
export class InpostAdminResolver {
  constructor(private inpostService: InpostService) {}

  @Query()
  @Allow(Permission.Owner)
  async getInpostConfig(@Ctx() ctx: RequestContext) {
    return this.inpostService.getInpostConfig(ctx);
  }

  @Query()
  @Allow(Permission.Owner)
  async getInpostOrganizations(
    @Ctx() ctx: RequestContext,
    @Args("input")
    input: { host: string; apiKey: string; inpostOrganization: number },
  ) {
    return this.inpostService.getInpostOrganizations(ctx, input);
  }

  @Mutation()
  @Allow(Permission.Owner)
  async setInpostShippingMethodConfig(
    @Ctx() ctx: RequestContext,
    @Args("input") input: SetInpostShippingMethodConfigInput,
  ) {
    await this.inpostService.setInpostConfig(ctx, input);
    return true;
  }
}
