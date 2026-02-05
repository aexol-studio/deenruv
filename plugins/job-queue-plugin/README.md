# @deenruv/job-queue-plugin

Alternate `JobQueueStrategy` implementations for Deenruv, providing scalable alternatives to the default database-polling approach.

## Installation

```bash
pnpm add @deenruv/job-queue-plugin
```

## Sub-Plugins

### BullMQJobQueuePlugin

A drop-in replacement for `DefaultJobQueuePlugin` using [BullMQ](https://github.com/taskforcesh/bullmq) with Redis for push-based job processing.

```bash
pnpm add bullmq
```

```typescript
import { BullMQJobQueuePlugin } from '@deenruv/job-queue-plugin/package/bullmq';

const config = {
  plugins: [
    // Remove DefaultJobQueuePlugin first
    BullMQJobQueuePlugin.init({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      workerOptions: {
        concurrency: 10,
      },
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `connection` | `ConnectionOptions` | `127.0.0.1:6379` | Redis connection options |
| `queueOptions` | `QueueOptions` | - | BullMQ Queue instance options |
| `workerOptions` | `WorkerOptions` | `{ concurrency: 3 }` | BullMQ Worker instance options |
| `setRetries` | `fn(queueName, job) => number` | - | Override retry count per queue/job |
| `setBackoff` | `fn(queueName, job) => BackoffOptions` | exponential/1000ms | Custom backoff strategy for retries |

**Advantages over DefaultJobQueuePlugin:**

- Push-based (no polling) - significantly lower DB load
- Jobs stored in Redis instead of the database
- Much better scalability with multiple workers
- Lower latency in job processing
- Built-in Redis health checks
- Auto-cleanup of completed/failed jobs (30 days or 5,000 jobs by default)

### PubSubPlugin

Uses [Google Cloud Pub/Sub](https://cloud.google.com/pubsub) for the Deenruv job queue, suitable for GCP-based deployments.

```bash
pnpm add @google-cloud/pubsub
```

```typescript
import { PubSubPlugin } from '@deenruv/job-queue-plugin/package/pub-sub';

const config = {
  plugins: [
    PubSubPlugin.init({
      // PubSub options
    }),
  ],
};
```

## Features

- BullMQ: Push-based Redis job queue with configurable concurrency
- BullMQ: Redis health indicator for monitoring
- BullMQ: Configurable retry strategies (exponential/fixed backoff)
- BullMQ: Automatic cleanup of old completed/failed jobs
- Pub/Sub: Google Cloud native job queue strategy
- Both are drop-in replacements for DefaultJobQueuePlugin

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

No GraphQL API extensions. These plugins configure the internal job queue strategy.
