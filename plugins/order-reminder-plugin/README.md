# @deenruv/order-reminder-plugin

Plugin that sends reminder events for orders that have been in a specific state for a configurable duration. It supports multiple reminder rules, each targeting a specific order state and age threshold, and publishes custom Deenruv events that can trigger email notifications or other actions.

## Installation

```bash
pnpm add @deenruv/order-reminder-plugin
```

## Configuration

```typescript
import { OrderReminderPlugin } from '@deenruv/order-reminder-plugin';
import { MyPaymentReminderEvent } from './events';

// In your Deenruv server config:
plugins: [
  OrderReminderPlugin.init([
    {
      uniqueId: 'payment-reminder-24h',
      orderState: 'ArrangingPayment',
      orderAgeMs: 24 * 60 * 60 * 1000, // 24 hours
      eventCtor: MyPaymentReminderEvent,
      batchSize: 50,
      orderFrom: new Date('2025-01-01'),
    },
  ]),
]
```

## Features

- Configurable reminder rules with order state and age thresholds
- Publishes custom Deenruv events for each qualifying order (integrates with email/notification systems)
- Per-rule tracking to prevent duplicate reminder sends
- Batch processing with configurable batch sizes
- Optional `orderFrom` date to avoid spamming historical orders when enabling the plugin
- Supports multiple independent reminder rules

## Admin UI

This plugin is server-only and does not add any admin UI extensions.

## API Extensions

This plugin does not add any GraphQL API extensions. It operates via a controller endpoint and internal event publishing.
