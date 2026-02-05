# @deenruv/phone-number-validation

Plugin that validates phone numbers on orders using the `libphonenumber-js` library. It can enforce phone number validation during order state transitions and exposes a Shop API query for on-demand validation.

## Installation

```bash
pnpm add @deenruv/phone-number-validation
```

## Configuration

```typescript
import { PhoneNumberValidationPlugin } from '@deenruv/phone-number-validation';

// In your Deenruv server config:
plugins: [
  PhoneNumberValidationPlugin.init({
    // Disable automatic validation on order state transitions
    disableTransitionValidation: false,
    // Order state to validate at (default behavior)
    stateCheck: 'ArrangingPayment',
    // Require a phone number to be present
    requirePhoneNumber: true,
    // Default country code for parsing (string or async function)
    defaultCountryCode: 'PL',
    // Allowed country codes (array or async function)
    allowedCountryCodes: ['PL', 'DE', 'GB'],
  }),
]
```

## Features

- Phone number validation using `libphonenumber-js`
- Automatic validation during order state transitions (configurable)
- Shop API query for on-demand phone number validation
- Configurable default country code (static or dynamic per request/order)
- Configurable allowed country codes whitelist (static or dynamic per request)
- Optional phone number requirement enforcement

## Admin UI

This plugin is server-only and does not add any admin UI extensions.

## API Extensions

### Shop API

- **Query** `validateCurrentOrderPhoneNumber: PhoneNumberValidationResult!` — Validates the phone number on the current active order. Returns either `PhoneNumberValidationSuccess` or `PhoneNumberValidationError` with a message.
