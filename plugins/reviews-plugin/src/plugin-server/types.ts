import { S3Client } from "@aws-sdk/client-s3";
import { ID, InjectableStrategy, RequestContext } from "@deenruv/core";
import { ReviewEntity } from "./entities/review.entity.js";
import { LanguageCode } from "./zeus/index.js";

export interface TranslateReviewStrategy extends InjectableStrategy {
  translateReviews: (
    ctx: RequestContext,
    review: ReviewEntity,
    languageCodes: LanguageCode[],
  ) => Promise<
    Array<{ languageCode: LanguageCode; body: string; summary: string }>
  >;
}

export type ReviewsPluginOptions = {
  s3: { bucket: string; client: S3Client; folder: string };
  getReviewsConfig: (
    ctx: RequestContext,
  ) => Promise<{ reviewsLanguages: string[] }>;
  translateStrategy?: TranslateReviewStrategy;
};

export type CreateReviewInput = {
  body: string;
  rating: number;
  keepAnonymous: boolean;
  orderId?: ID;
  productVariantId?: ID;
  uploadedAssets?: string[];
  authorName?: string;
  authorLocation?: string;
  authorEmailAddress?: string;
};
