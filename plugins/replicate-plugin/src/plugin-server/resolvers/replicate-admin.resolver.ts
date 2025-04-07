import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";
import { ReplicateService } from "../services/replicate.service.js";
import { Ctx, RequestContext, Customer } from "@deenruv/core";
import { StartOrderExportToReplicateInput } from "../graphql/generated-admin-types.js";

@Resolver()
export class ReplicateAdminResolver {
  constructor(private replicateService: ReplicateService) {}

  @Mutation()
  async startModelTraining(
    @Args()
    {
      input,
    }: { input: { numLastOrder: number; startDate: string; endDate: string } },
    @Ctx() ctx: RequestContext,
  ) {
    await this.replicateService.modelTrainingJob(ctx, input);
    return "model training done";
  }

  @Mutation()
  async startOrderExportToReplicate(
    @Args() { input }: { input: StartOrderExportToReplicateInput },
    @Ctx() ctx: RequestContext,
  ) {
    return this.replicateService.orderExportJob(ctx, input);
  }

  @Query()
  async getPredictionID(
    @Ctx() ctx: RequestContext,
    @Args() { input }: { input: { prediction_entity_id: string } },
  ) {
    return this.replicateService.getPredictionID(
      ctx,
      input.prediction_entity_id,
    );
  }

  @Query()
  async getReplicatePredictions(
    @Ctx() ctx: RequestContext,
    @Args() { options }: { options: any },
  ) {
    return this.replicateService.getPredictionItems(ctx, options);
  }

  @Query()
  async getPredictionItem(
    @Ctx() ctx: RequestContext,
    @Args() { id }: { id: string },
  ) {
    return this.replicateService.getPredictionItem(ctx, id);
  }
}
