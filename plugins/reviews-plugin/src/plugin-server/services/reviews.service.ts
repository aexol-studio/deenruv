import {
  Customer,
  CustomerService,
  EntityHydrator,
  EventBus,
  ID,
  LanguageCode,
  ListQueryBuilder,
  OrderService,
  Product,
  ProductVariant,
  ProductVariantService,
  type RelationPaths,
  RequestContext,
  TransactionalConnection,
  TranslatableSaver,
  TranslatorService,
} from "@deenruv/core";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ReviewStateMachine } from "../state/reviews.state.js";
import { ReviewEntity } from "../entities/review.entity.js";
import { REVIEWS_PLUGIN_OPTIONS, ReviewState } from "../constants.js";
import { ReviewEntityTranslation } from "../entities/review-translation.entity.js";
import { CreateReviewInput, ReviewsPluginOptions } from "../types.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ReviewChangeStateEvent from "../events.js";
import { ModelTypes } from "../zeus/index.js";
import { In } from "typeorm";

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger("ReviewsService");
  private readonly error = this.logger.error.bind(this.logger);
  private readonly log = this.logger.log.bind(this.logger);
  translateStrategy: ReviewsPluginOptions["translateStrategy"];
  canTranslate: boolean;

  constructor(
    @Inject(REVIEWS_PLUGIN_OPTIONS)
    private readonly options: ReviewsPluginOptions,
    private readonly connection: TransactionalConnection,
    private readonly reviewStateMachine: ReviewStateMachine,
    private readonly productVariantService: ProductVariantService,
    private readonly orderService: OrderService,
    private readonly translatableSaver: TranslatableSaver,
    private readonly translatorService: TranslatorService,
    private readonly customerServicer: CustomerService,
    private readonly listQueryBuilder: ListQueryBuilder,
    private readonly eventBus: EventBus,
    private readonly entityHydrator: EntityHydrator,
  ) {
    this.translateStrategy = options.translateStrategy;
    if (!this.translateStrategy) this.canTranslate = false;
    else this.canTranslate = true;
  }

  async hasShopReviewCreated(ctx: RequestContext, customer: Customer) {
    const qb = this.connection
      .getRepository(ctx, ReviewEntity)
      .createQueryBuilder("review");
    qb.select("COUNT(review.id)", "count")
      .where("review.authorId = :authorId", { authorId: customer.id })
      .andWhere("review.productId IS NULL")
      .andWhere("review.orderId IS NULL");
    const result = await qb.getRawOne();
    if (!result) return false;
    const count = parseInt(result.count, 10);
    if (isNaN(count)) return false;
    return count > 0;
  }

  async getAverageRatings(ctx: RequestContext) {
    const reviewRepo = this.connection.getRepository(ctx, ReviewEntity);
    const productQb = reviewRepo.createQueryBuilder("review");
    productQb
      .select("SUM(review.rating)", "total")
      .addSelect("COUNT(review.rating)", "count")
      .where("review.productId IS NOT NULL")
      .andWhere("review.state = :state", { state: ReviewState.ACCEPTED });
    const productResult = await productQb.getRawOne();
    const shopQb = reviewRepo.createQueryBuilder("review");
    shopQb
      .select("SUM(review.rating)", "total")
      .addSelect("COUNT(review.rating)", "count")
      .where("review.productId IS NULL")
      .andWhere("review.state = :state", { state: ReviewState.ACCEPTED });
    const shopResult = await shopQb.getRawOne();
    const productsAverageRating = {
      total: parseInt(productResult?.total ?? "0", 10),
      count: parseInt(productResult?.count ?? "0", 10),
    };
    const shopAverageRating = {
      total: parseInt(shopResult?.total ?? "0", 10),
      count: parseInt(shopResult?.count ?? "0", 10),
    };
    return { shopAverageRating, productsAverageRating };
  }

  async getOrderReview(
    ctx: RequestContext,
    order: { id: ID },
    relations?: RelationPaths<ReviewEntity>,
  ) {
    const review = await this.connection
      .getRepository(ctx, ReviewEntity)
      .findOne({ where: { order: { id: order.id } }, relations });
    if (!review) return null;
    return this.translatorService.translate(review, ctx);
  }

  async isOrderReviewed(ctx: RequestContext, order: { id: ID }) {
    const qb = this.connection
      .getRepository(ctx, ReviewEntity)
      .createQueryBuilder("review");
    qb.select("COUNT(review.id)", "count").where("review.orderId = :orderId", {
      orderId: order.id,
    });
    const result = await qb.getRawOne();
    if (!result) return false;
    const count = parseInt(result.count, 10);
    if (isNaN(count)) return false;
    return count > 0;
  }

  async getAverageRating(ctx: RequestContext, product: Product) {
    const productId = product.id;
    const qb = this.connection
      .getRepository(ctx, ReviewEntity)
      .createQueryBuilder("review");
    qb.select("AVG(review.rating)", "averageRating")
      .where("review.productId = :productId", { productId })
      .andWhere("review.state = :state", { state: ReviewState.ACCEPTED });
    const result = await qb.getRawOne();
    const averageRating = result?.averageRating ?? 0;
    const value = parseFloat(averageRating);
    return isNaN(value) ? 0 : value;
  }

  async translateReviews(
    ctx: RequestContext,
    input: ModelTypes["TranslateReviewsInput"],
  ) {
    if (!this.canTranslate || !this.translateStrategy) {
      this.error(
        "ReviewsService.translateReviews called, but translateStrategy is not set",
      );
      return [];
    }
    const { id, languages } = input;
    const review = await this.connection.getEntityOrThrow(
      ctx,
      ReviewEntity,
      id,
      { relations: ["translations"] },
    );
    if (!review) {
      this.error(`Review with id ${id} not found`);
      return [];
    }
    return this.translateStrategy.translateReviews(ctx, review, languages);
  }

  async updateTranslationsReview(
    ctx: RequestContext,
    input: ModelTypes["UpdateTranslationsReviewInput"],
  ) {
    const { id, translations } = input;
    const review = await this.connection.getEntityOrThrow(
      ctx,
      ReviewEntity,
      id,
      { relations: ["translations"] },
    );
    if (!review) {
      this.error(`Review with id ${id} not found`);
      return;
    }
    const existingTranslations = review.translations || [];
    const updatedTranslations = existingTranslations.map((translation) => {
      const newTranslation = translations.find(
        (t) => t.languageCode === (translation.languageCode as string),
      );
      if (newTranslation) {
        return {
          ...translation,
          body: newTranslation.body,
        };
      }
      return translation;
    });
    const newTranslations = translations
      .filter(
        (t) =>
          !existingTranslations.some(
            (et) => et.languageCode === (t.languageCode as string),
          ),
      )
      .map((t) => ({
        languageCode: t.languageCode as unknown as LanguageCode,
        body: t.body,
      }));
    const allTranslations = [...updatedTranslations, ...newTranslations];
    if (allTranslations.length === 0) {
      this.error(`No translations provided for review with id ${id}`);
      return;
    }
    return this.translatableSaver.update({
      ctx,
      entityType: ReviewEntity,
      translationType: ReviewEntityTranslation,
      input: { id, translations: allTranslations },
    });
  }

  async getReviewInfoForProduct(ctx: RequestContext, productId: ID) {
    const qb = this.connection
      .getRepository(ctx, ReviewEntity)
      .createQueryBuilder("review");
    qb.select("AVG(review.rating)", "averageRating")
      .addSelect("COUNT(review.id)", "totalReviews")
      .addSelect("SUM(review.rating)", "totalRatings")
      .where("review.productId = :productId", { productId })
      .andWhere("review.state = :state", { state: ReviewState.ACCEPTED });
    const result = await qb.getRawOne();
    if (!result) {
      return { averageRating: 0, totalReviews: 0, totalRatings: 0 };
    }
    return {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews, 10) || 0,
      totalRatings: parseInt(result.totalRatings, 10) || 0,
    };
  }

  async getReviewsConfig(ctx: RequestContext) {
    const configFn = this.options.getReviewsConfig;
    const emptyConfig = {
      reviewsLanguages: [],
      canTranslate: this.canTranslate,
    };

    if (typeof configFn !== "function") {
      this.error(
        "ReviewsPluginOptions.getReviewsConfig is not set or not a function, returning empty config",
      );
      return emptyConfig;
    }

    try {
      const response = await configFn(ctx);
      return { ...response, canTranslate: this.canTranslate };
    } catch (e) {
      this.error(
        `Error while executing ReviewsPluginOptions.getReviewsConfig: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      );
      return emptyConfig;
    }
  }

  async getReview(
    ctx: RequestContext,
    id: ID,
    relations: RelationPaths<ReviewEntity>,
  ) {
    const review = await this.connection.getEntityOrThrow(
      ctx,
      ReviewEntity,
      id,
      { relations },
    );
    return this.translatorService.translate(review, ctx);
  }

  async changeReviewState(
    ctx: RequestContext,
    input: Array<{ id: ID; state: ReviewState; message?: string }>,
  ) {
    const response = [];
    for (const { id, ...rest } of input) {
      const review = await this.connection.getEntityOrThrow(
        ctx,
        ReviewEntity,
        id,
      );
      const { finalize } = await this.reviewStateMachine.transition(
        ctx,
        review,
        rest,
      );
      await this.connection.getRepository(ctx, ReviewEntity).save(review);
      await finalize();
      await this.eventBus.publish(
        new ReviewChangeStateEvent(
          ctx,
          review,
          review.state,
          rest.state,
          rest.message,
        ),
      );
      response.push({ id, success: true });
    }
    return response.length === 1 ? response[0] : response;
  }

  async listReviews(
    ctx: RequestContext,
    _options: ModelTypes["ReviewListOptions"],
    relations?: RelationPaths<ReviewEntity>,
    showAll: boolean = false,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = (_options || {}) as any;
    const where =
      ctx.apiType !== "admin"
        ? showAll
          ? {}
          : { state: ReviewState.ACCEPTED }
        : {};
    const qb = this.listQueryBuilder.build(ReviewEntity, options, {
      ctx,
      where,
      relations,
      customPropertyMap: {
        productId: "product.id",
        orderId: "order.id",
        customerId: "author.id",
      },
    });
    qb.addOrderBy("reviewentity.createdAt", "DESC");
    qb.leftJoin("reviewentity.product", "product");
    qb.leftJoin("product.channels", "productChannel");
    qb.leftJoin("reviewentity.order", "order");
    qb.leftJoin("order.channels", "orderChannel");
    qb.andWhere(
      `(
      (product.id IS NOT NULL AND productChannel.id = :channelId)
      OR
      (order.id IS NOT NULL AND orderChannel.id = :channelId)
      OR
      (product.id IS NULL AND order.id IS NULL)
    )`,
      { channelId: ctx.channelId },
    );

    const [items, totalItems] = await qb.getManyAndCount();
    const reviews = items.map((item) =>
      this.translatorService.translate(item, ctx),
    );
    return { items: reviews, totalItems };
  }

  async createReview(ctx: RequestContext, input: CreateReviewInput) {
    const {
      productVariantId,
      orderId,
      rating,
      uploadedAssets,
      authorLocation,
      authorName,
      authorEmailAddress,
      keepAnonymous,
      ...translations
    } = input;

    let variant: ProductVariant | undefined = undefined;
    if (productVariantId) {
      variant = await this.productVariantService.findOne(
        ctx,
        productVariantId,
        ["product"],
      );
    }

    return this.translatableSaver.create({
      ctx,
      entityType: ReviewEntity,
      translationType: ReviewEntityTranslation,
      input: {
        translations: [{ languageCode: ctx.languageCode, ...translations }],
      },
      beforeSave: async (review) => {
        review.authorName = authorName || "";
        review.authorLocation = authorLocation || "";
        review.authorEmailAddress = authorEmailAddress || "";
        review.keepAnonymous = keepAnonymous || false;
        review.rating = rating;
        if (variant) {
          review.productVariant = variant;
          if (variant.product) review.product = variant.product;
        }
        if (orderId) {
          const order = await this.orderService.findOne(ctx, orderId, []);
          if (order) {
            review.order = order;
            if (order.customer) review.author = order.customer;
          }
        }
        if (uploadedAssets) {
          const filteredAssets = uploadedAssets.filter(
            (asset) => !!asset && asset.length > 0,
          );
          review.assetKeys = filteredAssets;
        }

        if (ctx.activeUserId && !review.author) {
          // If the review is being created by an authenticated user, we can set the author
          const customer = await this.customerServicer.findOneByUserId(
            ctx,
            ctx.activeUserId,
          );
          if (customer) {
            await this.entityHydrator.hydrate(ctx, customer, {
              relations: ["addresses"],
            });
            review.author = customer;
          }
        }
      },
    });
  }

  async getReviewsStorage(
    ctx: RequestContext,
    input: Array<{ filename: string }>,
  ) {
    const { bucket, client, folder } = this.options.s3;
    const results: { key: string; url: string }[] = [];
    for (const { filename } of input) {
      const timestamp = new Date().getTime();
      const [name, ext] = filename.split(".");
      const hash = [
        timestamp,
        name.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
        ext,
      ].join("-");
      const key = [folder, hash].join("/");
      const command = new PutObjectCommand({ Bucket: bucket, Key: key });
      const url = await getSignedUrl(client, command);
      results.push({ key, url });
    }
    return results;
  }

  async getReviewAssets(ctx: RequestContext, review: ReviewEntity) {
    const keys = review.assetKeys || [];
    if (keys.length > 0) {
      const { bucket, client } = this.options.s3;
      const results: { key: string; url: string }[] = [];
      for (const key of keys) {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(client, command);
        results.push({ key, url });
      }
      return results;
    }
    return [];
  }
}
