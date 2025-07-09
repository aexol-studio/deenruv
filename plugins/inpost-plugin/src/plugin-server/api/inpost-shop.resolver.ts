import { Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@deenruv/core";
import { InpostService } from "../services/inpost.service.js";

@Resolver()
export class InpostShopResolver {
  constructor(private inpostService: InpostService) {}

  @Query()
  async inPostGeowidgetKey(@Ctx() ctx: RequestContext) {
    return this.inpostService.getGeowidgetKey(ctx);
  }
}
