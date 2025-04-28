import { Query, Args, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { ResolverInputTypes } from "../zeus";
import { BetterMetricsService } from "../services/metrics.service";

@Resolver()
export class AdminResolver {
  constructor(private betterMetricsService: BetterMetricsService) {}

  @Allow(Permission.Authenticated)
  @Query()
  async chartMetric(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: ResolverInputTypes["ChartMetricInput"] },
  ) {
    return this.betterMetricsService.getChartMetrics(ctx, args.input);
  }

  @Allow(Permission.Authenticated)
  @Query()
  async orderSummaryMetric(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: ResolverInputTypes["OrderSummaryMetricInput"] },
  ) {
    return this.betterMetricsService.getOrderSummaryMetric(ctx, args.input);
  }

  @Allow(Permission.Authenticated)
  @Query()
  async additionalOrderStates(@Ctx() ctx: RequestContext) {
    return this.betterMetricsService.additionalOrderStates(ctx);
  }
}
