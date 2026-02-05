# @deenruv/stellate-plugin

Integrates your Deenruv server with [Stellate](https://stellate.co/) (formerly GraphCDN) for GraphQL edge caching with automatic cache purging based on Deenruv events.

## Installation

```bash
pnpm add @deenruv/stellate-plugin
```

## Configuration

```typescript
import { StellatePlugin, defaultPurgeRules } from '@deenruv/stellate-plugin';

const config = {
  plugins: [
    StellatePlugin.init({
      serviceName: 'my-deenruv-service',
      apiToken: process.env.STELLATE_PURGE_API_TOKEN,
      devMode: !isProduction,
      debugLogging: false,
      purgeRules: [
        ...defaultPurgeRules,
        // Add custom purge rules here
      ],
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceName` | `string` | *required* | Stellate service name (`<serviceName>.stellate.sh`) |
| `apiToken` | `string` | *required* | Stellate Purging API token |
| `purgeRules` | `PurgeRule[]` | *required* | Array of rules defining which events trigger cache purges |
| `defaultBufferTimeMs` | `number` | `2000` | Buffer time for batching purge requests |
| `devMode` | `boolean` | `false` | When `true`, no calls are made to the Stellate Purge API |
| `debugLogging` | `boolean` | `false` | Logs purge API calls (generates verbose debug-level logging) |

## Features

- Automatic cache purging based on Deenruv events (Product, Collection, etc.)
- Batched and debounced purge requests for efficiency
- Built-in default purge rules for standard Deenruv entity types
- Custom `PurgeRule` support for plugin-defined entities
- Dev mode to prevent API calls during development
- `cacheIdentifier` field on `SearchResponse` for storefront cache keys

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

The Shop API `SearchResponse` type is extended with a `cacheIdentifier` field:

```graphql
type SearchResponseCacheIdentifier {
  collectionSlug: String
}

extend type SearchResponse {
  cacheIdentifier: SearchResponseCacheIdentifier
}
```

In your storefront, include `cacheIdentifier` in search queries to enable proper cache invalidation:

```graphql
query SearchProducts($input: SearchInput!) {
  search(input: $input) {
    cacheIdentifier {
      collectionSlug
    }
    items {
      # ...
    }
  }
}
```
