# @deenruv/cronjobs-plugin

Plugin for managing scheduled cron jobs within Deenruv. It provides a strategy-based executor pattern (e.g., Kubernetes CronJobs) with an admin UI for creating, listing, updating, and removing cron jobs.

## Installation

```bash
pnpm add @deenruv/cronjobs-plugin
```

## Configuration

```typescript
import { CronJobsPlugin, KubernetesCronJobExecutor } from '@deenruv/cronjobs-plugin';

// In your Deenruv server config:
plugins: [
  CronJobsPlugin.init({
    controllerAuthToken: 'your-secret-token',
    executor: new KubernetesCronJobExecutor({
      // Kubernetes executor options
    }),
    knownWorkerJobsToSuggest: ['sync-products', 'cleanup-sessions'],
    presets: {
      merge: true,
      values: [
        { label: 'Every hour', value: '0 * * * *' },
        { label: 'Every day at midnight', value: '0 0 * * *' },
      ],
    },
  }),
]
```

## Features

- Strategy-based cron job execution (includes Kubernetes CronJob executor)
- Admin UI for creating, listing, updating, and removing scheduled jobs
- Configurable cron schedule presets for quick setup
- Suggested worker job names for easier configuration
- Authenticated controller endpoint for job execution triggers
- Lifecycle management with automatic init/destroy of executor strategies

## Admin UI

This plugin extends the admin UI with a dedicated cron jobs management page where administrators can view all scheduled jobs, create new ones with cron expressions, update schedules, and remove jobs.

## API Extensions

### Admin API

- **Query** `cronJobsConfig: CronJobsConfig!` — Returns suggested jobs and schedule presets
- **Query** `cronJobs(input: CronJobsListInput!): CronJobsList!` — Lists cron jobs with optional filtering by channel token and job queue name
- **Mutation** `createCronJob(input: CronJobCreateInput!): Boolean` — Creates a new cron job
- **Mutation** `updateCronJob(job: CronJobInput!): Boolean` — Updates an existing cron job's schedule
- **Mutation** `removeCronJob(jobs: [CronJobInput!]!): Boolean` — Removes one or more cron jobs
