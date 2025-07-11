import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service.js";
import { Ctx, RequestContext } from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";
import { CreateReviewInput } from "../types.js";

@Resolver()
export class ReviewsShopAPIResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation()
  async createReview(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { input: CreateReviewInput },
  ) {
    return this.reviewsService.createReview(ctx, args.input);
  }

  @Query()
  async getReviewsStorage(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: Array<{ filename: string }> },
  ) {
    return this.reviewsService.getReviewsStorage(ctx, args.input);
  }

  @Query()
  async getAverageRatings(@Ctx() ctx: RequestContext) {
    return this.reviewsService.getAverageRatings(ctx);
  }
}
