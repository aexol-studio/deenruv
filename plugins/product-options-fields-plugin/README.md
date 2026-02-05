# @deenruv/product-options-fields-plugin

Plugin that extends ProductOption entities with additional custom fields for enhanced product option presentation. It adds color support, visibility controls, "new" flags, and image associations to product options.

## Installation

```bash
pnpm add @deenruv/product-options-fields-plugin
```

## Configuration

```typescript
import { ProductOptionServerPlugin } from '@deenruv/product-options-fields-plugin';

// In your Deenruv server config:
plugins: [
  ProductOptionServerPlugin,
]
```

## Features

- `hexColor` (string, public) — Hex color value with a color picker UI component for visual option representation
- `isNew` (boolean, public) — Flag to mark product options as new
- `isHidden` (boolean, public) — Flag to hide product options from the storefront
- `image` (Asset relation, public) — Associated image for visual option representation
- Multi-language labels (English and Polish)

## Admin UI

This plugin is server-only and does not add any admin UI extensions. The custom fields are editable through the standard ProductOption detail pages in the admin panel.

## API Extensions

This plugin does not add any GraphQL API extensions. It registers custom fields on the ProductOption entity, which are automatically exposed through the standard Deenruv GraphQL API.
