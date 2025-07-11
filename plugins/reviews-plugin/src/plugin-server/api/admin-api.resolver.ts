import { Query, Args, Resolver, Mutation } from "@nestjs/graphql";
import { ReviewsService } from "../services/reviews.service.js";
import {
  Ctx,
  ID,
  LanguageCode,
  RelationPaths,
  Relations,
  RequestContext,
} from "@deenruv/core";
import { ReviewState } from "../constants.js";
import { ReviewEntity } from "../entities/review.entity.js";
import { ModelTypes } from "../zeus/index.js";

@Resolver()
export class ReviewsAdminAPIResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query()
  getReviewInfoForProduct(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID },
  ) {
    return this.reviewsService.getReviewInfoForProduct(ctx, args.productId);
  }

  @Query()
  getReviewsConfig(
    @Ctx() ctx: RequestContext,
  ): Promise<{ reviewsLanguages: string[] }> {
    return this.reviewsService.getReviewsConfig(ctx);
  }

  @Query()
  listReviews(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { options: ModelTypes["ReviewListOptions"] },
    @Relations(ReviewEntity) relations: RelationPaths<ReviewEntity>,
  ) {
    return this.reviewsService.listReviews(ctx, args.options, relations);
  }

  @Query()
  getReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string },
    @Relations(ReviewEntity) relations: RelationPaths<ReviewEntity>,
  ) {
    return this.reviewsService.getReview(ctx, args.id, relations);
  }

  @Query()
  translateReviews(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { input: ModelTypes["TranslateReviewsInput"] },
  ) {
    return this.reviewsService.translateReviews(ctx, args.input);
  }

  @Query()
  getReviewForOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { orderId: ID },
    @Relations(ReviewEntity) relations: RelationPaths<ReviewEntity>,
  ) {
    return this.reviewsService.getOrderReview(
      ctx,
      { id: args.orderId },
      relations,
    );
  }

  @Mutation()
  changeReviewState(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { input: { id: string; state: ReviewState; message?: string } },
  ) {
    return this.reviewsService.changeReviewState(ctx, [args.input]);
  }

  @Mutation()
  changeReviewsState(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: Array<{ id: string; state: ReviewState; message?: string }>;
    },
  ) {
    return this.reviewsService.changeReviewState(ctx, args.input);
  }

  @Mutation()
  updateTranslationsReview(
    @Ctx() ctx: RequestContext,
    @Args()
    args: { input: ModelTypes["UpdateTranslationsReviewInput"] },
  ) {
    return this.reviewsService.updateTranslationsReview(ctx, args.input);
  }
}
