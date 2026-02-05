# @deenruv/method-modal-plugin

Plugin that adds localized modal content fields to both PaymentMethod and ShippingMethod entities. This enables storefronts to display informational modals with custom title, description, and additional description for each payment and shipping method.

## Installation

```bash
pnpm add @deenruv/method-modal-plugin
```

## Configuration

```typescript
import { MethodModalServerPlugin } from '@deenruv/method-modal-plugin';

// In your Deenruv server config:
plugins: [
  MethodModalServerPlugin,
]
```

## Features

- Adds `modalTitle` (localeString) custom field to PaymentMethod and ShippingMethod
- Adds `modalDescription` (localeText with rich text) custom field to PaymentMethod and ShippingMethod
- Adds `modalAdditionalDescription` (localeText with rich text) custom field to PaymentMethod and ShippingMethod
- Full-width rich text editor support in the admin UI
- All fields are public and accessible from the Shop API

## Admin UI

This plugin is server-only and does not add any admin UI extensions. The custom fields are editable through the standard PaymentMethod and ShippingMethod detail pages in the admin panel.

## API Extensions

This plugin does not add any GraphQL API extensions. It registers localized custom fields on PaymentMethod and ShippingMethod entities, which are automatically exposed through the standard Deenruv GraphQL API.
