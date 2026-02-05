# @deenruv/harden-plugin

Hardens your Deenruv GraphQL APIs against abuse and attacks. Recommended for all production deployments.

## Installation

```bash
pnpm add @deenruv/harden-plugin
```

## Configuration

```typescript
import { HardenPlugin } from '@deenruv/harden-plugin';

const config = {
  plugins: [
    HardenPlugin.init({
      maxQueryComplexity: 650,
      apiMode: process.env.APP_ENV === 'dev' ? 'dev' : 'prod',
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxQueryComplexity` | `number` | `1000` | Maximum permitted query complexity score |
| `apiMode` | `'dev' \| 'prod'` | `'prod'` | In `prod` mode, disables introspection and GraphQL playground |
| `hideFieldSuggestions` | `boolean` | `true` | Prevents field name suggestions in error messages (blocks schema sniffing) |
| `logComplexityScore` | `boolean` | `false` | Logs complexity score breakdown for each query (useful for tuning) |
| `customComplexityFactors` | `{ [path: string]: number }` | - | Custom complexity weights for specific fields |
| `queryComplexityEstimators` | `ComplexityEstimator[]` | Deenruv default | Custom estimator functions for complexity calculation |

## Features

- **Query complexity analysis** - Rejects overly complex queries that could overload server resources (powered by [graphql-query-complexity](https://www.npmjs.com/package/graphql-query-complexity))
- **Introspection control** - Disables introspection and GraphQL playground in production mode
- **Field suggestion hiding** - Removes field name suggestions from validation errors, preventing trial-and-error schema discovery
- **Complexity logging** - Optional detailed logging of query complexity scores for tuning the `maxQueryComplexity` threshold
- **Custom complexity weights** - Per-field complexity factors for expensive custom operations
- **Deenruv-optimized estimator** - Default complexity estimator tuned specifically for the Deenruv API (applies a factor of 1000 for list queries without a `take` argument)

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

No GraphQL API extensions. This plugin configures Apollo Server plugins for query analysis and validation.
