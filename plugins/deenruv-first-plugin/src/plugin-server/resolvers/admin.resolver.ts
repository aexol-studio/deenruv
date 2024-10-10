import { Query, Args, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@deenruv/core';
import { ResolverInputTypes } from '../zeus';
import { BetterMetricsService } from '../services/metrics.service';

@Resolver()
export class AdminResolver {
    constructor(private betterMetricsService: BetterMetricsService) {}

    @Allow(Permission.Authenticated)
    @Query()
    async betterMetricSummary(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: ResolverInputTypes['BetterMetricSummaryInput'] },
    ) {
        return this.betterMetricsService.getBetterMetrics(ctx, args.input);
    }
}
