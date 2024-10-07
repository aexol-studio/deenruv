import { ProductReview } from './entities/product-review.entity';

export type ReviewState = 'new' | 'approved' | 'rejected';

declare module '@deenruv/core' {
    interface CustomProductFields {
        reviewCount: number;
        reviewRating: number;
        featuredReview?: ProductReview;
    }
}
