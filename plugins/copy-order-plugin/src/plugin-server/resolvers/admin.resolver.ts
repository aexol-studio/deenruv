import { Mutation, Args, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, ID, Permission, RequestContext } from "@deenruv/core";
import { CopyOrderService } from "../services/copy-order.service";

@Resolver()
export class AdminResolver {
  constructor(private service: CopyOrderService) {}

  @Allow(Permission.SuperAdmin)
  @Mutation()
  async copyOrder(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.service.copyOrder(ctx, args.id);
  }
}
