# @deenruv/reviews-plugin

A full-featured product reviews plugin that adds customer review and rating functionality to your Deenruv store, including S3-based image uploads, review state management, and optional automatic translation.

## Installation

```bash
pnpm add @deenruv/reviews-plugin
```

## Configuration

```typescript
import { ReviewsPlugin } from '@deenruv/reviews-plugin';
import { S3Client } from '@aws-sdk/client-s3';

// In your Deenruv server config:
plugins: [
  ReviewsPlugin.init({
    s3: {
      bucket: 'my-reviews-bucket',
      client: new S3Client({ region: 'eu-central-1' }),
      folder: 'reviews',
    },
    getReviewsConfig: async (ctx) => ({
      reviewsLanguages: ['en', 'pl'],
    }),
    // Optional: automatic review translation strategy
    translateStrategy: myTranslateStrategy,
  }),
]
```

## Features

- Customer product reviews with ratings and text
- Review image/asset uploads via S3 presigned URLs
- Review state machine (e.g., pending, approved, rejected)
- Multi-language review translations with pluggable translation strategy
- Reviews linked to orders, products, variants, and customers
- Configurable review languages per channel

## Admin UI

This plugin extends the admin UI with a comprehensive reviews management dashboard including review listing and detail pages, review state change controls (approve/reject), product and order info sidebars, customer review history, and universal selection dialogs for linking reviews.

## API Extensions

The plugin extends both the **Admin API** and **Shop API**:

**Admin API:**
- Queries for listing and filtering reviews
- Mutations for updating review state and managing reviews

**Shop API:**
- Mutations for creating reviews with ratings, text, and image uploads
- Queries for fetching product reviews with pagination
- Resolvers for reviews on Product, Order, and Customer types
