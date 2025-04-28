import { Resolver, Args, Mutation, Query, ResolveField } from "@nestjs/graphql";
import { ReplicateSimpleBGService } from "../services/replicate-simple-bg.service.js";
import { Ctx, RequestContext } from "@deenruv/core";
import {
  StartGenerateSimpleBGInput,
  AssignPredictionToProductInput,
} from "../graphql/generated-admin-types.js";
@Resolver()
export class ReplicateSimpleBGAdminResolver {
  constructor(private replicateSimpleBGService: ReplicateSimpleBGService) {}

  @Mutation()
  async startGenerateSimpleBg(
    @Args() { input }: { input: StartGenerateSimpleBGInput },
    @Ctx() ctx: RequestContext,
  ) {
    return this.replicateSimpleBGService.startModelRun(ctx, input);
  }

  @Mutation()
  async getPredictionAsset(
    @Args() { input }: { input: AssignPredictionToProductInput },
    @Ctx() ctx: RequestContext,
  ) {
    return this.replicateSimpleBGService.getPredictionAsset(ctx, input);
  }

  @Query()
  async getSimpleBgID(
    @Ctx() ctx: RequestContext,
    @Args() { input }: { input: { prediction_simple_bg_entity_id: string } },
  ) {
    return this.replicateSimpleBGService.getSimpleBgID(
      ctx,
      input.prediction_simple_bg_entity_id,
    );
  }

  @Query()
  async getSimpleBgPredictions(
    @Ctx() ctx: RequestContext,
    @Args() { options }: { options: any },
  ) {
    return this.replicateSimpleBGService.getSimpleBgItems(ctx, options);
  }

  @Query()
  async getSimpleBgItem(
    @Ctx() ctx: RequestContext,
    @Args() { id }: { id: string },
  ) {
    return this.replicateSimpleBGService.getSimpleBgItem(ctx, id);
  }

  @Query()
  async getSimpleBgThemeAsset(@Args() parent: { url: string }) {
    const key = parent.url;
    const baseUrl = String(
      this.replicateSimpleBGService.getSimpleBgThemesAsset(),
    );
    const url = key.startsWith(baseUrl) ? key : [baseUrl, key].join("/");
    return { url };
  }

  @Query()
  async getSimpleBgOptions() {
    return this.replicateSimpleBGService.getSimpleBgOptions();
  }
}
