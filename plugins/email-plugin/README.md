# @deenruv/email-plugin

Generates and sends transactional emails based on Deenruv server events, using [MJML](https://mjml.io/) + [Handlebars](https://handlebarsjs.com/) templates (or [React Email](https://react.email/)) and [Nodemailer](https://nodemailer.com/) for delivery.

## Installation

```bash
pnpm add @deenruv/email-plugin
```

## Configuration

```typescript
import { defaultEmailHandlers, EmailPlugin } from '@deenruv/email-plugin';
import path from 'path';

const config = {
  plugins: [
    EmailPlugin.init({
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, 'static/email/templates'),
      transport: {
        type: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        },
      },
    }),
  ],
};
```

### Dev Mode

```typescript
EmailPlugin.init({
  devMode: true,
  route: 'mailbox',
  handlers: defaultEmailHandlers,
  templatePath: path.join(__dirname, 'static/email/templates'),
  outputPath: path.join(__dirname, 'test-emails'),
});
```

In dev mode, emails are saved as HTML files and a web-based mailbox UI is available at the configured route (e.g. `http://localhost:3000/mailbox`).

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `handlers` | `EmailEventHandler[]` | *required* | Event handlers that define which events trigger emails |
| `templatePath` | `string` | - | Path to MJML/Handlebars email templates (deprecated, use `templateLoader`) |
| `templateLoader` | `TemplateLoader` | `FileBasedTemplateLoader` | Custom template loader for dynamic template resolution |
| `transport` | `EmailTransportOptions \| fn` | *required* | Email transport config (SMTP, SES, sendmail, file, none) or dynamic function |
| `globalTemplateVars` | `object \| fn` | - | Variables available to all templates (static or async function with `RequestContext`) |
| `emailSender` | `EmailSender` | `NodemailerEmailSender` | Custom email sending implementation |
| `emailGenerator` | `EmailGenerator` | `HandlebarsMjmlGenerator` | Custom email generation implementation |
| `useReactEmail` | `boolean` | `false` | Use React Email for template rendering |

**Transport types:** `smtp`, `ses` (AWS SES), `sendmail`, `file`, `none`, `testing`

## Features

- **MJML + Handlebars templates** - Responsive email markup with dynamic data
- **React Email support** - Alternative template engine using React components
- **Default event handlers** - Order confirmation, email verification, password reset, email change
- **Customizable handlers** - Extend/modify default handlers or create entirely new ones
- **Dynamic SMTP settings** - Channel-aware transport configuration via async function
- **Job queue integration** - Emails processed via the Deenruv job queue with retry support
- **Dev mailbox** - Web-based email preview UI for development
- **Global template variables** - Static or async variables (e.g. storefront URL, theme colors)
- **Template helpers** - Built-in `formatMoney` and `formatDate` Handlebars helpers
- **File attachments** - Support for email attachments via Nodemailer
- **AWS SES support** - Native SES transport option

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

No GraphQL API extensions. Email sending is triggered by internal Deenruv events.
