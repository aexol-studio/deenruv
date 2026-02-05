# @deenruv/inpost-plugin

Integration plugin for the InPost parcel locker shipping service. It provides a custom fulfillment handler, shipment management, label generation, webhook handling, and a geowidget for pickup point selection on the storefront.

## Installation

```bash
pnpm add @deenruv/inpost-plugin
```

## Configuration

```typescript
import { InpostPlugin } from '@deenruv/inpost-plugin';

// In your Deenruv server config:
plugins: [
  InpostPlugin.init({}),
]
```

## Features

- Custom InPost fulfillment handler for shipping method integration
- InPost API configuration per shipping method (host, API key, organization, service type)
- Shipment label generation and storage as Fulfillment assets
- Webhook controller for InPost shipment status events (confirmed, delivered, cancelled, etc.)
- Pickup point ID custom field on orders
- Geowidget key exposed to the storefront for pickup point selection
- Organization listing for admin configuration

## Admin UI

This plugin extends the admin UI with an InPost configuration panel where administrators can set up API credentials, select InPost organizations and services, and manage shipping method integration settings.

## API Extensions

### Admin API

- **Query** `getInpostConfig: InpostConfig` — Returns the current InPost configuration
- **Query** `getInpostOrganizations(input: GetInpostOrganizationsInput): InpostOrganizationResponse!` — Lists available InPost organizations for given credentials
- **Mutation** `setInpostShippingMethodConfig(input: SetInpostShippingMethodConfigInput!): Boolean!` — Saves InPost configuration for a shipping method

### Shop API

- **Query** `inPostGeowidgetKey: String` — Returns the geowidget key for the storefront pickup point selector
