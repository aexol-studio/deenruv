# @deenruv/newsletter-plugin

Plugin that provides newsletter subscription functionality via the Shop API. It uses a strategy-based approach, allowing you to plug in any newsletter service provider (e.g., Mailchimp, SendGrid, custom API).

## Installation

```bash
pnpm add @deenruv/newsletter-plugin
```

## Configuration

```typescript
import { NewsletterPlugin, DefaultNewsletterStrategy } from '@deenruv/newsletter-plugin';

// In your Deenruv server config:
plugins: [
  NewsletterPlugin.init({
    strategy: new DefaultNewsletterStrategy(),
    // Or provide your own:
    // strategy: new MyCustomNewsletterStrategy(),
  }),
]
```

### Custom Strategy

```typescript
import type { NewsletterStrategy } from '@deenruv/newsletter-plugin';

class MyNewsletterStrategy implements NewsletterStrategy {
  async addToNewsLetter(ctx, email) {
    // Integrate with your newsletter provider
    return { success: true };
  }
}
```

## Features

- Strategy-based newsletter subscription architecture
- Built-in `DefaultNewsletterStrategy` for quick setup
- Shop API mutation for email subscription
- Error handling with typed error codes (e.g., `InvalidEmail`)
- Lifecycle management with automatic strategy init/destroy

## Admin UI

This plugin is server-only and does not add any admin UI extensions.

## API Extensions

### Shop API

- **Mutation** `addToNewsletter(email: String!): AddToNewsletterResult!` — Subscribes an email to the newsletter. Returns either `AddToNewsletterSuccessResult` or `AddToNewsletterErrorResult` with a `NewsletterErrorCode`.
