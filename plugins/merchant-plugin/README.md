# @deenruv/merchant-plugin

Plugin for exporting product catalog data to merchant platforms like Google Merchant Center and Facebook Commerce. It supports a strategy-based approach for transforming product data into platform-specific formats and managing platform integration settings.

## Installation

```bash
pnpm add @deenruv/merchant-plugin
```

## Configuration

```typescript
import { MerchantPlugin } from '@deenruv/merchant-plugin';
import type { MerchantExportStrategy } from '@deenruv/merchant-plugin';

// Implement your export strategy:
const myStrategy: MerchantExportStrategy<MyProductData[]> = {
  getBaseData: async (ctx, product) => { /* ... */ },
  prepareGoogleProductPayload: async (ctx, data) => { /* ... */ },
  prepareFacebookProductPayload: async (ctx, data) => { /* ... */ },
};

// In your Deenruv server config:
plugins: [
  MerchantPlugin.init({
    strategy: myStrategy,
  }),
]
```

## Features

- Strategy-based product export architecture supporting Google and Facebook platforms
- Google Merchant Center integration via Google Content API
- Facebook Commerce integration via Facebook Business SDK
- Per-platform settings storage and management
- Bulk product sync to merchant platforms
- Orphan item cleanup for removed products
- `communicateID` custom field on ProductVariant for platform communication tracking
- Lifecycle management with automatic strategy init/destroy

## Admin UI

This plugin extends the admin UI with dedicated Google and Facebook integration pages where administrators can configure platform credentials, trigger product sync, view connection status, and manage platform settings.

## API Extensions

### Admin API

- **Query** `getMerchantPlatformSettings(platform: String!): MerchantPlatformSettingsEntity` — Returns saved settings for a platform
- **Query** `getMerchantPlatformInfo(platform: String!): [MerchantPlatformInfo!]` — Returns connection status and product count for a platform
- **Mutation** `sendAllProductsToMerchantPlatform(platform: String!): Boolean` — Triggers a full product sync to the specified platform
- **Mutation** `saveMerchantPlatformSettings(input: SaveMerchantPlatformSettingInput!): MerchantPlatformSettingsEntity!` — Saves platform credentials and settings
- **Mutation** `removeOrphanItems(platform: String!): Boolean` — Removes products from the platform that no longer exist in the catalog
