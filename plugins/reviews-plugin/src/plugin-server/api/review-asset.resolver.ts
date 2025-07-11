import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ReviewEntity } from "../entities/review.entity.js";
import { ReviewsService } from "../services/reviews.service.js";
import { Ctx, RequestContext } from "@deenruv/core";

@Resolver("Review")
export class ReviewAssetResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResolveField("assets")
  async assets(@Ctx() ctx: RequestContext, @Parent() review: ReviewEntity) {
    return this.reviewsService.getReviewAssets(ctx, review);
  }
}
