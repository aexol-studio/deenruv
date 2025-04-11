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
  async assignPredictionToProduct(
    @Args() { input }: { input: AssignPredictionToProductInput },
    @Ctx() ctx: RequestContext,
  ) {
    return this.replicateSimpleBGService.assignPredictionToProduct(ctx, input);
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
    const key = await parent.url;
    const baseUrl = String(
      await this.replicateSimpleBGService.getSimpleBgThemesAsset(),
    );
    const url = key.startsWith(baseUrl) ? key : [baseUrl, key].join("/");
    return { url };
  }

  @ResolveField("Image")
  Image(parent: { url: string }) {
    return { url: parent.url };
  }

  @Query()
  async getSimpleBgRoomType() {
    return this.replicateSimpleBGService.getSimpleBgRoomType();
  }

  @Query()
  async getSimpleBgRoomTheme() {
    return this.replicateSimpleBGService.getSimpleBgRoomTheme();
  }

  @Query()
  async getSimpleBgAssetIDByName(
    @Ctx() ctx: RequestContext,
    @Args() { source }: { source: string },
  ) {
    return this.replicateSimpleBGService.getSimpleBgAssetIDByName(ctx, source);
  }

  @Query()
  async getSimpleBgProductList(
    @Ctx() ctx: RequestContext,
    @Args() { options }: { options: any },
  ) {
    return this.replicateSimpleBGService.getSimpleBgProductList(ctx, options);
  }
}
