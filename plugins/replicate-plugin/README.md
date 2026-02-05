# @deenruv/replicate-plugin

An AI-powered plugin that integrates [Replicate](https://replicate.com/) machine learning models with your Deenruv server for model training and order prediction tasks.

## Installation

```bash
pnpm add @deenruv/replicate-plugin replicate
```

## Configuration

```typescript
import { ReplicatePlugin } from '@deenruv/replicate-plugin';

// In your Deenruv server config:
plugins: [
  ReplicatePlugin.init({
    deploymentName: 'your-replicate-deployment',
    apiToken: process.env.REPLICATE_API_TOKEN,
  }),
]
```

## Features

- Integration with Replicate AI deployment API
- Model training based on order history data
- Order export and prediction capabilities
- Custom entity for tracking Replicate job status
- Admin API for managing AI model operations
- Webhook controller for receiving Replicate prediction results

## Admin UI

This plugin extends the admin UI with a Replicate management dashboard for configuring deployments, initiating model training, viewing prediction results, and monitoring job statuses.

## API Extensions

The plugin extends the **Admin API** with:

- Mutations for triggering model training and order predictions
- Queries for retrieving Replicate job status and prediction results
