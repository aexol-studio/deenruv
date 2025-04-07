import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Ctx, Order, RequestContext } from "@deenruv/core";
import { OrderRegisterService } from "../services/order-register.service";

@Resolver("Order")
export class AdminOrderResolver {
  constructor(private orderRegisterService: OrderRegisterService) {}

  @ResolveField()
  async getRealization(@Ctx() ctx: RequestContext, @Parent() order: Order) {
    const realization = await this.orderRegisterService.getRealization(
      ctx,
      order.id as string,
    );
    if (!realization) return null;
    return realization;
  }
}
