# @deenruv/payments-plugin

A collection of payment provider integrations for Deenruv, including Stripe, Mollie, and Braintree. Each provider is a separate sub-plugin that can be used independently.

## Installation

```bash
pnpm add @deenruv/payments-plugin
```

Additionally, install the client library for your chosen payment provider(s):

```bash
# Stripe
pnpm add stripe

# Mollie
pnpm add @mollie/api-client

# Braintree
pnpm add braintree
```

## Sub-Plugins

### StripePlugin

Processes payments via the [Stripe](https://stripe.com/docs) Payment Intents API with webhook-based order settlement.

```typescript
import { StripePlugin } from '@deenruv/payments-plugin/package/stripe';

plugins: [
  StripePlugin.init({
    storeCustomersInStripe: true,
  }),
];
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `storeCustomersInStripe` | `boolean` | Stores Deenruv customers as Stripe customers (adds `stripeCustomerId` custom field) |

**API Extensions (Shop):**

- `createStripePaymentIntent` mutation - Creates a Stripe PaymentIntent and returns a client secret

**Webhook:** Listens at `/payments/stripe` for `payment_intent.succeeded` and `payment_intent.payment_failed` events.

### MolliePlugin

Processes payments via the [Mollie](https://docs.mollie.com/) Order API with support for multiple payment methods including pay-later options (Klarna).

```typescript
import { MolliePlugin } from '@deenruv/payments-plugin/package/mollie';

plugins: [
  MolliePlugin.init({
    deenruvHost: 'https://your-deenruv-server.io',
  }),
];
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `deenruvHost` | `string` | Your Deenruv server host URL (used for Mollie webhooks) |
| `enabledPaymentMethodsParams` | `fn` | Optional function to provide additional params (locale, billingCountry) to the Mollie methods API |

**API Extensions (Shop):**

- `createMolliePaymentIntent` mutation - Creates a Mollie payment and returns a redirect URL
- `molliePaymentMethods` query - Lists available Mollie payment methods

**API Extensions (Admin):**

- Mollie-specific admin resolvers for payment management

### BraintreePlugin

Processes payments via [Braintree](https://www.braintreepayments.com/) with Drop-in UI integration and optional vault (stored payment methods).

```typescript
import { BraintreePlugin } from '@deenruv/payments-plugin/package/braintree';
import { Environment } from 'braintree';

plugins: [
  BraintreePlugin.init({
    environment: Environment.Sandbox,
    storeCustomersInBraintree: true,
  }),
];
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `storeCustomersInBraintree` | `boolean` | Enables Braintree vault for stored payment methods (adds `braintreeCustomerId` custom field) |

**API Extensions (Shop):**

- `generateBraintreeClientToken` query - Generates a client token for the Braintree Drop-in UI

## Features

- Stripe Payment Intents API with webhook-based settlement
- Mollie Order API with 20+ payment methods including pay-later (Klarna)
- Braintree Drop-in UI with vault for stored payment methods
- Webhook handlers for async payment confirmation
- Customer storage in payment provider for returning customers
- Custom fields added to Order/Customer entities as needed

## Admin UI

Server-only plugin. Payment methods are configured through the standard Deenruv Admin UI PaymentMethod settings.

## Development

### Mollie local development

For testing out changes to the Mollie plugin locally, with a real Mollie account, follow the steps below. These steps
will create an order, set Mollie as payment method, and create a payment intent link to the Mollie platform.

1. Get a test api key from your Mollie
   dashboard: https://help.mollie.com/hc/en-us/articles/115000328205-Where-can-I-find-the-API-key-
2. Create the file `packages/payments-plugin/.env` with content `MOLLIE_APIKEY=your-test-apikey`
3. `cd packages/payments-plugin`
4. `npm run dev-server:mollie`
5. Watch the logs for `Mollie payment link` and click the link to finalize the test payment.

You can change the order flow, payment methods and more in the file `e2e/mollie-dev-server`, and restart the devserver.

### Stripe local development

For testing out changes to the Stripe plugin locally, with a real Stripe account, follow the steps below. These steps
will create an order, set Stripe as payment method, and create a payment secret.

1. Get a test api key from your Stripe
   dashboard: https://dashboard.stripe.com/test/apikeys
2. Use Ngrok or Localtunnel to make your localhost publicly available and create a webhook as described here: https://deenruv.com/docs/typescript-api/payments-plugin/stripe-plugin/
3. Create the file `packages/payments-plugin/.env` with these contents:

```sh
STRIPE_APIKEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```

1. `cd packages/payments-plugin`
2. `yarn dev-server:stripe`
3. Watch the logs for the link or go to `http://localhost:3050/checkout` to test the checkout.

After checkout completion you can see your payment in https://dashboard.stripe.com/test/payments/
