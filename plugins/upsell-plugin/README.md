# @deenruv/upsell-plugin

A product upselling plugin that allows you to define and manage upsell/cross-sell relationships between products in your Deenruv store, exposing them via both Admin and Shop APIs.

## Installation

```bash
pnpm add @deenruv/upsell-plugin
```

## Configuration

```typescript
import { UpsellPlugin } from '@deenruv/upsell-plugin';

// In your Deenruv server config:
plugins: [
  UpsellPlugin.init({}),
]
```

## Features

- Custom `Upsell` entity for defining product-to-product relationships
- Admin API for creating and managing upsell associations
- Shop API for querying upsell products on product detail pages
- Product resolver extensions for seamlessly including upsells in product queries

## Admin UI

This plugin extends the admin UI with an upsell management interface including a product upsell selection dialog and an extras management page for configuring upsell relationships between products.

## API Extensions

The plugin extends both the **Admin API** and **Shop API**:

**Admin API:**
- Mutations for creating, updating, and deleting upsell relationships
- Queries for listing upsell associations

**Shop API:**
- Product type resolver extension for querying upsell products associated with a given product
