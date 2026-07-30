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

### Google Merchant API settings

The Google integration uses the stable Merchant API Products v1 clients. The
Google settings page requires:

- `merchantId` — the numeric Merchant Center account ID.
- `dataSource` — the full existing data source resource name in the form
  `accounts/{merchantId}/dataSources/{id}`. Its account segment must match
  `merchantId`.
- `credentials` — Google OAuth credential JSON for a service account or an
  authorized user. Store and distribute this value as a secret.
- `brand` — the brand applied to exported product attributes.
- `contentLanguage` — two-letter product language code (defaults to `pl`).
- `feedLabel` — Merchant Center feed label (defaults to `PL`).

`publicBaseUrl` is supplied by the export strategy. It must produce absolute,
publicly reachable `http` or `https` product and image URLs. The example server
reads it from `PUBLIC_URL`, then `HOST_URL`, and only falls back to localhost in
local development.

Product inputs are written only to the configured data source. Merchant API
processing is asynchronous, so a processed product might not be readable for
several minutes after a successful write.

After upgrading an existing installation, generate and run a database migration
for the new `merchant_sync_run` and `merchant_sync_item` history tables before
starting workers.

#### Deployment prerequisites (documentation only)

An operator must complete the following outside this plugin and outside the
application deployment. The plugin does not enable APIs, create or register
data sources, change Merchant Center configuration, or provision credentials:

1. Enable Merchant API for the Google Cloud project that owns the credentials.
2. Grant the credential identity the required access to the Merchant Center
   account.
3. Create or select an API product data source in Merchant Center and copy its
   full `accounts/{merchantId}/dataSources/{id}` resource name into the plugin
   settings.
4. Ensure the credentials can request the
   `https://www.googleapis.com/auth/content` OAuth scope.

## Features

- Strategy-based product export architecture supporting Google and Facebook platforms
- Google Merchant Center integration via Merchant API Products v1
- Facebook Commerce integration via Facebook Business SDK
- Per-platform settings storage and management
- Live account and data-source connection diagnostics
- Persistent synchronization run and per-product error history
- Retried, queued, idempotent Google product updates
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
