# @deenruv/product-badges-plugin

Plugin that adds translatable, color-coded badges to products. Badges can be managed through the Admin API and displayed on the storefront via the Shop API, enabling visual labels like "New", "Sale", "Bestseller", etc.

## Installation

```bash
pnpm add @deenruv/product-badges-plugin
```

## Configuration

```typescript
import { BadgesServerPlugin } from '@deenruv/product-badges-plugin';

// In your Deenruv server config:
plugins: [
  BadgesServerPlugin,
]
```

## Features

- Translatable badge names with multi-language support
- Color-coded badges with customizable hex colors
- CRUD operations for badges via the Admin API
- Badges associated with individual products
- Both Admin and Shop API extensions for full badge management and display

## Admin UI

This plugin extends the admin UI with a badge management interface on the product detail page, including a badge list, a creation/edit modal with color picker and translation inputs, and badge removal functionality.

## API Extensions

### Admin API

- **Query** `getProductBadges(input: GetProductBadgesInput!): [Badge!]` — Returns all badges for a given product
- **Mutation** `createBadge(input: CreateBadgeInput!): Badge!` — Creates a new badge with color and translations
- **Mutation** `editBadge(input: EditBadgeInput!): Badge!` — Updates a badge's color and/or translations
- **Mutation** `removeBadge(input: RemoveBadgeInput!): Boolean!` — Removes a badge by ID

### Shop API

- **Field** `Product.badges: [Badge!]` — Returns badges associated with a product, including translations
