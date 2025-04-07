import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Ctx, Order, RequestContext } from "@deenruv/core";
import { OrderRegisterService } from "../services/order-register.service";

@Resolver("Order")
export class ShopOrderResolver {
  constructor(private orderRegisterService: OrderRegisterService) {}

  @ResolveField()
  async realization(@Ctx() ctx: RequestContext, @Parent() order: Order) {
    const realization = await this.orderRegisterService.getRealization(
      ctx,
      order.id as string,
    );
    if (!realization) return null;
    const { note, plannedAt, finalPlannedAt } = realization;
    return { note, plannedAt, finalPlannedAt };
  }
}
