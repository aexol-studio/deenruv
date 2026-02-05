# @deenruv/dashboard-widgets-plugin

Admin dashboard plugin that provides rich order and product analytics widgets. It adds chart-based metrics, order summary tiles, category breakdowns, product charts, and a latest orders table to the admin dashboard.

## Installation

```bash
pnpm add @deenruv/dashboard-widgets-plugin
```

## Configuration

```typescript
import { DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin';

// In your Deenruv server config:
plugins: [
  DashboardWidgetsPlugin.init({
    // Optional: cache time for metrics queries in milliseconds
    cacheTime: 60000,
    // Optional: enable discount custom field support
    discountByCustomField: false,
    // Optional: additional order states to include in filters
    additionalOrderStates: [
      { state: 'InRealization', selectedByDefault: true },
    ],
  }),
]
```

## Features

- Order summary metrics (total revenue, order count, average order value, product count)
- Interactive time-series charts for order count, order total, average order value, and product count
- Configurable time ranges (today, this week, this month, this year, custom, etc.)
- Hourly and daily chart intervals
- Order state filtering for all metrics
- Product-specific metric filtering
- Categories and products breakdown chart widgets
- Latest orders table widget
- Materialized database views for fast metric aggregation

## Admin UI

This plugin extends the admin UI with a comprehensive dashboard featuring:
- **Orders Widget** — Time-series charts with configurable metrics, date ranges, and order state filters
- **Order Summary Tiles** — Quick overview cards showing total revenue, order count, average value, and product count
- **Categories Chart Widget** — Breakdown of orders by product categories
- **Products Chart Widget** — Top products bar chart with custom tooltips
- **Latest Orders Widget** — Recent orders table with payment method info

## API Extensions

### Admin API

- **Query** `additionalOrderStates: [AdditionalOrderState!]!` — Returns configured additional order states
- **Query** `chartMetric(input: ChartMetricInput!): ChartMetrics!` — Returns time-series chart data for selected metric types, date ranges, and intervals
- **Query** `orderSummaryMetric(input: OrderSummaryMetricInput!): OrderSummaryMetrics!` — Returns aggregated order summary data (totals, counts, averages)
