# @deenruv/deenruv-examples-plugin

Example and reference plugin demonstrating how to use custom fields across various Deenruv entities. It registers a wide variety of custom field types on Products, Orders, OrderLines, Collections, Facets, ProductVariants, and Assets for development and testing purposes.

## Installation

```bash
pnpm add @deenruv/deenruv-examples-plugin
```

## Configuration

```typescript
import { DeenruvExamplesServerPlugin } from '@deenruv/deenruv-examples-plugin';

// In your Deenruv server config:
plugins: [
  DeenruvExamplesServerPlugin,
]
```

## Features

- Demonstrates all supported custom field types: string, boolean, float, int, text, datetime, localeString, localeText
- Examples of list-type custom fields (string list, int list, float list, text list, localeString list, localeText list)
- Relation custom fields: single Asset, list of Assets, list of Products, list of ProductVariants
- Custom fields on multiple entities: Product, Order, OrderLine, Collection, Facet, ProductVariant, Asset
- Multi-language labels and descriptions (English and Polish)
- Reference implementation for plugin developers

## Admin UI

This plugin extends the admin UI with example pages, test components, custom input components, and custom table configurations to demonstrate the plugin UI extension system.

## API Extensions

This plugin does not add any GraphQL API extensions. It only registers custom fields on existing entities, which are automatically exposed through the standard Deenruv GraphQL API.
