import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service.js";
import {
  Ctx,
  Customer,
  type RelationPaths,
  Relations,
  RequestContext,
} from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";
import { ReviewEntity } from "../entities/review.entity.js";

@Resolver("Customer")
export class ReviewCustomerResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResolveField("reviews")
  async reviews(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer,
    @Args()
    args: { options: ModelTypes["ReviewListOptions"] },
    @Relations(ReviewEntity) relations: RelationPaths<ReviewEntity>,
  ) {
    return this.reviewsService.listReviews(
      ctx,
      {
        ...args.options,
        filter: {
          ...args.options.filter,
          customerId: { eq: customer.id as string },
        },
      },
      relations,
      true,
    );
  }

  @ResolveField("shopReviewCreated")
  async shopReviewCreated(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer,
  ) {
    return this.reviewsService.hasShopReviewCreated(ctx, customer);
  }
}
