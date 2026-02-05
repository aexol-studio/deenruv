# @deenruv/in-realization-plugin

Plugin that adds an "InRealization" order state to the Deenruv order process, along with order realization tracking, PDF generation, and S3-based file storage. It enables administrators to register realization details (planned dates, notes, assets) and exposes realization info to the storefront.

## Installation

```bash
pnpm add @deenruv/in-realization-plugin
```

## Configuration

```typescript
import { InRealizationPlugin } from '@deenruv/in-realization-plugin';
import { S3Client } from '@aws-sdk/client-s3';

// In your Deenruv server config:
plugins: [
  InRealizationPlugin.init({
    s3: {
      client: new S3Client({ region: 'eu-central-1' }),
      bucket: 'my-realization-bucket',
      expiresIn: 3600, // Pre-signed URL expiry in seconds
    },
  }),
]
```

## Features

- Adds `InRealization` state to the order process (transition from `PaymentSettled`)
- Order realization entity for tracking planned dates, notes, colors, and associated assets
- PDF generation service for realization documents
- S3 storage integration with pre-signed URL support
- Both Admin and Shop API extensions for realization data

## Admin UI

This plugin extends the admin UI with realization management components on the order detail page, including an "InRealization" action button, a realization card showing planned dates and notes, and a state transition modal.

## API Extensions

### Admin API

- **Query** `getRealizationURL(orderID: ID!): String` — Returns a pre-signed URL for the realization document
- **Mutation** `registerRealization(input: OrderRealizationInput!): OrderRealization` — Registers realization details (planned dates, notes, assets) for an order
- **Field** `Order.getRealization: OrderRealization` — Returns realization data for an order

### Shop API

- **Field** `Order.realization: ShopOrderRealization` — Returns realization info (note, planned dates) visible to customers
