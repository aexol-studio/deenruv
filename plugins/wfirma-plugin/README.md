# @deenruv/wfirma-plugin

An invoicing plugin that integrates the [wFirma](https://wfirma.pl/) Polish accounting platform with your Deenruv server, enabling automatic invoice generation for orders.

## Installation

```bash
pnpm add @deenruv/wfirma-plugin
```

## Configuration

```typescript
import { WFirmaPlugin } from '@deenruv/wfirma-plugin';

// In your Deenruv server config:
plugins: [
  WFirmaPlugin.init({
    authorization: {
      accessKey: process.env.WFIRMA_ACCESS_KEY,
      secretKey: process.env.WFIRMA_SECRET_KEY,
      appKey: process.env.WFIRMA_APP_KEY,
    },
  }),
]
```

## Features

- Integration with the wFirma accounting API
- Automatic invoice generation for orders
- Custom `wfirmaInvoiceId` field on orders to track linked invoices
- Admin API for triggering invoice operations
- Admin UI extension with invoice action buttons on order detail pages

## Admin UI

This plugin extends the admin UI with wFirma integration controls, including invoice generation buttons on order detail pages, invoice status display, and custom styling overrides. The UI supports both English and Polish translations.

## API Extensions

The plugin extends the **Admin API** with:

- Mutations for generating wFirma invoices for orders
- Queries for retrieving invoice status and details
