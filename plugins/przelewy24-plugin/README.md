# @deenruv/przelewy24-plugin

A payment plugin that integrates the [Przelewy24](https://www.przelewy24.pl/) Polish payment gateway with your Deenruv server, supporting both standard card/bank payments and BLIK instant payments.

## Installation

```bash
pnpm add @deenruv/przelewy24-plugin
```

## Configuration

```typescript
import { Przelewy24Plugin } from '@deenruv/przelewy24-plugin';

// In your Deenruv server config:
plugins: [
  Przelewy24Plugin.init({
    apiUrl: 'https://secure.przelewy24.pl',
    przelewy24Host: 'https://your-server.com',
    returnUrl: async (ctx, { order }) => `https://your-store.com/order/${order.code}`,
    PL: {
      PRZELEWY24_POS_ID: process.env.P24_POS_ID,
      PRZELEWY24_CRC: process.env.P24_CRC,
      PRZELEWY24_CLIENT_SECRET: process.env.P24_CLIENT_SECRET,
    },
    // Optional: map currency codes to market channels
    currencyCodeToChannel: (currencyCode) => 'PL',
  }),
]
```

## Features

- Standard Przelewy24 payment method handler for card and bank transfers
- BLIK instant payment method handler with real-time status polling
- Multi-market support with per-channel credentials
- Webhook controller for processing Przelewy24 payment notifications
- Shop API extensions for initiating payments and checking BLIK status
- Email event integration for payment confirmations

## Admin UI

This plugin extends the admin UI with a Przelewy24 management interface for viewing payment transaction details and statuses.

## API Extensions

The plugin extends the **Shop API** with:

- Mutations and queries for creating Przelewy24 payment intents
- BLIK payment status polling
- Przelewy24 payment verification
