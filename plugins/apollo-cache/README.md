# @deenruv/apollo-cache

Server-side response caching plugin for Deenruv, powered by Apollo Server's response cache and cache control plugins. It enables HTTP-level caching of GraphQL responses with session-aware cache keys.

## Installation

```bash
pnpm add @deenruv/apollo-cache
```

## Configuration

```typescript
import { ApolloCachePlugin } from '@deenruv/apollo-cache';

// In your Deenruv server config:
plugins: [
  ApolloCachePlugin.init({
    cacheControlOptions: {
      defaultMaxAge: 60,
    },
    responseCacheOptions: {
      // Optional: custom session ID extraction
      sessionId: async (req) => {
        // Default implementation extracts session from cookies
        return null;
      },
    },
  }),
]
```

## Features

- Integrates Apollo Server response cache plugin for full-response caching
- Configurable cache control options (default max age, scope, etc.)
- Session-aware caching with automatic cookie-based session ID extraction
- Supports custom session ID resolution for authenticated/personalized responses

## Admin UI

This plugin is server-only and does not add any admin UI extensions.

## API Extensions

This plugin does not add any GraphQL API extensions. It operates at the Apollo Server plugin level, adding cache control headers and response caching behavior to existing queries.
