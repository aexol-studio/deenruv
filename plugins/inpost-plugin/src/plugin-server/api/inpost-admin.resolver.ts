import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { InpostService } from "../services/inpost.service.js";
import { SetInpostShippingMethodConfigInput } from "../types.js";

@Resolver()
export class InpostAdminResolver {
  constructor(private inpostService: InpostService) {}

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
