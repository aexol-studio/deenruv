# @deenruv/order-line-attributes-plugin

Plugin that adds custom attribute fields to OrderLine entities, including discount tracking, modified pricing, text-based attributes with a custom input component, and a selected image relation field.

## Installation

```bash
pnpm add @deenruv/order-line-attributes-plugin
```

## Configuration

```typescript
import { OrderLineAttributesServerPlugin } from '@deenruv/order-line-attributes-plugin';

// In your Deenruv server config:
plugins: [
  OrderLineAttributesServerPlugin,
]
```

## Features

- `discountBy` (int) — Discount amount applied to the order line
- `modifiedListPrice` (string, public) — Modified price value for display
- `attributes` (text) — Free-form attributes field with a custom "attributes-input" UI component
- `selectedImage` (Asset relation) — Associated image for the order line with a custom "selected-image-input" UI component
- Multi-language labels and descriptions (English and Polish)

## Admin UI

This plugin extends the admin UI with custom input components for order line attributes, including an attributes editor and a facet values selector displayed on the order detail page.

## API Extensions

This plugin does not add any GraphQL API extensions. It registers custom fields on the OrderLine entity, which are automatically exposed through the standard Deenruv GraphQL API.
