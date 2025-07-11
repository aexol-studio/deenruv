import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service.js";
import { Ctx, Order, RequestContext } from "@deenruv/core";

@Resolver("Order")
export class ReviewOrderResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResolveField("reviewed")
  async reviewed(@Ctx() ctx: RequestContext, @Parent() order: Order) {
    return this.reviewsService.isOrderReviewed(ctx, order);
  }

  @ResolveField("review")
  async review(@Ctx() ctx: RequestContext, @Parent() order: Order) {
    return this.reviewsService.getOrderReview(ctx, order);
  }
}
