# @deenruv/copy-order-plugin

Admin plugin that allows duplicating existing orders. It adds a `copyOrder` mutation to the Admin API and provides a UI button on the order detail page.

## Installation

```bash
pnpm add @deenruv/copy-order-plugin
```

## Configuration

```typescript
import { CopyOrderPlugin } from '@deenruv/copy-order-plugin';

// In your Deenruv server config:
plugins: [
  CopyOrderPlugin.init({
    // Optional: order states where copying is not allowed
    notAllowedStates: ['Cancelled'],
  }),
]
```

## Features

- Duplicate any order with a single click from the admin panel
- Configurable state restrictions to prevent copying orders in certain states
- Returns the new order or an error response

## Admin UI

This plugin extends the admin UI with a "Copy Order" button on the order detail page, allowing administrators to quickly duplicate orders.

## API Extensions

### Admin API

- **Mutation** `copyOrder(id: ID!): CopyOrderResult!` — Duplicates an order by ID. Returns either the new `Order` or a `CopyOrderErrorResponse` with an error message.
