import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service.js";
import {
  Ctx,
  Product,
  RelationPaths,
  Relations,
  RequestContext,
} from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";
import { ReviewEntity } from "../entities/review.entity.js";

@Resolver("Product")
export class ReviewProductResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResolveField("averageRating")
  async averageRating(@Ctx() ctx: RequestContext, @Parent() product: Product) {
    return this.reviewsService.getAverageRating(ctx, product);
  }

  @ResolveField("reviews")
  async reviews(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { options: ModelTypes["ReviewListOptions"] },
    @Parent() product: Product,
    @Relations(ReviewEntity) relations: RelationPaths<ReviewEntity>,
  ) {
    return this.reviewsService.listReviews(
      ctx,
      {
        ...args.options,
        filter: {
          ...args.options.filter,
          productId: { eq: product.id as string },
        },
      },
      relations,
    );
  }
}
