# @deenruv/redis-strategy-plugin

A session cache strategy plugin that uses Redis as the backing store for Deenruv session data, replacing the default in-memory session cache with a persistent, distributed cache.

## Installation

```bash
pnpm add @deenruv/redis-strategy-plugin ioredis
```

## Configuration

```typescript
import { RedisSessionCachePlugin } from '@deenruv/redis-strategy-plugin/plugin-server';

// In your Deenruv server config:
plugins: [
  RedisSessionCachePlugin.init({
    redisOptions: {
      host: 'localhost',
      port: 6379,
    },
    // Optional: custom namespace prefix for Redis keys
    namespace: 'deenruv-session-cache',
    // Optional: TTL in seconds (default: 86400 = 24 hours)
    defaultTTL: 86400,
  }),
]
```

## Features

- Redis-backed session cache strategy for distributed deployments
- Configurable TTL (time-to-live) for cached sessions
- Custom namespace support for key isolation
- Automatic session serialization/deserialization
- Graceful error handling with fallback logging
- Supports all `ioredis` connection options (clusters, sentinels, TLS, etc.)

## Admin UI

This plugin extends the admin UI with a Redis monitoring interface for viewing session cache status.

## API Extensions

This plugin does not add any GraphQL API extensions. It operates at the infrastructure level by replacing the session cache strategy.
