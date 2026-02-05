# @deenruv/elasticsearch-plugin

Replaces the default Deenruv product search with [Elasticsearch](https://www.elastic.co/elasticsearch/) for advanced full-text search, faceted filtering, price range queries, custom mappings, and geo-spatial search.

**Requires Elasticsearch v7.0 or higher** (below v7.10.2 due to client compatibility).

## Installation

```bash
pnpm add @deenruv/elasticsearch-plugin @elastic/elasticsearch
```

Make sure to remove `DefaultSearchPlugin` from your config if present.

## Configuration

```typescript
import { ElasticsearchPlugin } from '@deenruv/elasticsearch-plugin';

const config = {
  plugins: [
    ElasticsearchPlugin.init({
      host: 'http://localhost',
      port: 9200,
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | `string` | `'http://localhost'` | Elasticsearch host |
| `port` | `number` | `9200` | Elasticsearch port |
| `clientOptions` | `ClientOptions` | - | Direct Elasticsearch client options (overrides host/port) |
| `connectionAttempts` | `number` | `10` | Max connection retry attempts on startup |
| `connectionAttemptInterval` | `number` | `5000` | Interval (ms) between connection attempts |
| `indexPrefix` | `string` | `'deenruv-'` | Prefix for Elasticsearch indices |
| `indexSettings` | `object` | `{}` | Elasticsearch index settings (analyzers, filters, etc.) |
| `indexMappingProperties` | `object` | `{}` | Custom index mapping properties |
| `customProductMappings` | `object` | `{}` | Custom fields indexed from Products |
| `customProductVariantMappings` | `object` | `{}` | Custom fields indexed from ProductVariants |
| `searchConfig` | `SearchConfig` | See below | Internal search query configuration |
| `bufferUpdates` | `boolean` | `false` | Buffer index updates for manual batch execution |
| `hydrateProductRelations` | `string[]` | `[]` | Additional Product relations to fetch during reindexing |
| `hydrateProductVariantRelations` | `string[]` | `[]` | Additional ProductVariant relations to fetch during reindexing |
| `extendSearchInputType` | `object` | `{}` | Add custom fields to the `SearchInput` GraphQL type |
| `extendSearchSortType` | `string[]` | `[]` | Add custom sort parameters |

**SearchConfig defaults:**

| Option | Default | Description |
|--------|---------|-------------|
| `facetValueMaxSize` | `50` | Max FacetValues returned per search |
| `collectionMaxSize` | `50` | Max Collections returned per search |
| `totalItemsMaxSize` | `10000` | Max total items tracked |
| `multiMatchType` | `'best_fields'` | Elasticsearch multi-match query type |
| `priceRangeBucketInterval` | `1000` | Price range bucket interval (in cents) |
| `mapQuery` | identity | Custom query transformation function |
| `mapSort` | identity | Custom sort transformation function |
| `scriptFields` | `{}` | Computed script fields (e.g. geo-distance) |

## Features

- Drop-in replacement for `DefaultSearchPlugin`
- Price range filtering and price bucket aggregations
- Custom product/variant field mappings exposed via GraphQL
- Script fields for computed values (e.g. geo-spatial distance)
- Configurable search boosting per field
- Custom index analyzers and mapping properties
- Buffered updates for high-volume environments
- Health check integration
- Automatic index management and reindexing on entity changes
- Supports fuzzy search, wildcard queries via `mapQuery`
- Custom sort parameters via `mapSort`

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

Both Admin and Shop APIs are extended with price range data and custom mapping fields:

```graphql
extend type SearchResponse {
  prices: SearchResponsePriceData!
}

type SearchResponsePriceData {
  range: PriceRange!
  rangeWithTax: PriceRange!
  buckets: [PriceRangeBucket!]!
  bucketsWithTax: [PriceRangeBucket!]!
}

type PriceRangeBucket {
  to: Int!
  count: Int!
}

extend input SearchInput {
  priceRange: PriceRangeInput
  priceRangeWithTax: PriceRangeInput
}

input PriceRangeInput {
  min: Int!
  max: Int!
}
```

When `customProductMappings` or `customProductVariantMappings` are defined, additional fields are exposed on `SearchResult`:

```graphql
type SearchResult {
  customProductMappings: CustomProductMappings
  customProductVariantMappings: CustomProductVariantMappings
  customMappings: CustomMappings  # Union of both
}
```
