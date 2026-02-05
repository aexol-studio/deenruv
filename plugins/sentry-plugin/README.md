# @deenruv/sentry-plugin

Integrates your Deenruv server with [Sentry](https://sentry.io/) for error tracking, performance monitoring, and distributed tracing.

## Installation

```bash
pnpm add @deenruv/sentry-plugin @sentry/node
```

## Configuration

```typescript
import { SentryPlugin } from '@deenruv/sentry-plugin';

const config = {
  plugins: [
    SentryPlugin.init({
      dsn: process.env.SENTRY_DSN,
      enableTracing: true,
      includeErrorTestMutation: !isProduction,
      // Any additional @sentry/node options are also supported:
      tracesSampleRate: 1.0,
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dsn` | `string` | *required* | Sentry [Data Source Name](https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/) |
| `enableTracing` | `boolean` | `false` | Enables performance tracing for GraphQL resolvers |
| `includeErrorTestMutation` | `boolean` | `false` | Adds a `createTestError` mutation to the Admin API for testing |

All additional `@sentry/node` `NodeOptions` are passed through (e.g. `tracesSampleRate`, `environment`, etc.).

## Features

- Automatic error capture via Apollo Server plugin and error handler strategy
- Request context enrichment via middleware (attaches user/session info to Sentry events)
- Built-in support for distributed tracing across GraphQL resolvers
- Optional `createTestError` Admin API mutation for verifying Sentry integration
- Compatible with Sentry's full Node.js SDK for custom instrumentation

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

When `includeErrorTestMutation` is enabled, the Admin API is extended with:

```graphql
enum TestErrorType {
  UNCAUGHT_ERROR
  THROWN_ERROR
  CAPTURED_ERROR
  CAPTURED_MESSAGE
  DATABASE_ERROR
}

extend type Mutation {
  createTestError(errorType: TestErrorType!): Boolean
}
```
