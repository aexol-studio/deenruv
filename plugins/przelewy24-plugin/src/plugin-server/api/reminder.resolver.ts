import { Args, Resolver, Query } from "@nestjs/graphql";
import { ID, OrderService } from "@deenruv/core";
import { Ctx, Allow, RequestContext, Permission } from "@deenruv/core";
import { Przelewy24Service } from "../services/przelewy24.service";

@Resolver()
export class Przelewy24ReminderResolver {
  constructor(
    private readonly przelewy24Service: Przelewy24Service,
    private readonly orderService: OrderService,
  ) {}

  @Allow(Permission.UpdateCatalog)
  @Query()
  async remindPrzelewy24(
    @Ctx() ctx: RequestContext,
    @Args() args: { orderId: ID },
  ): Promise<boolean> {
    try {
      const order = await this.orderService.findOne(ctx, args.orderId, [
        "payments",
      ]);
      const przelewy24Payment = order?.payments?.find(
        (p) => p.method === "przelewy24",
      );

      const przelewy24Url =
        przelewy24Payment?.metadata?.public?.paymentUrl ?? null;
      const paymentState = przelewy24Payment?.state ?? null;

      if (paymentState === "Authorized" && przelewy24Url) {
        await this.przelewy24Service.reminder(ctx, { orderId: args.orderId });
        return true;
      }

      throw new Error("No reminder, payment not authorized or no payment URL");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
