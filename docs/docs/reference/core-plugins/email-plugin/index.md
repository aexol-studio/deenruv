---
title: 'EmailPlugin'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## EmailPlugin

<GenerationInfo sourceFile="packages/email-plugin/src/plugin.ts" sourceLine="304" packageName="@deenruv/email-plugin" />

The EmailPlugin creates and sends transactional emails based on Deenruv events. By default, it uses an [MJML](https://mjml.io/)-based
email generator to generate the email body and [Nodemailer](https://nodemailer.com/about/) to send the emails.

## High-level description

Deenruv has an internal events system (see <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>) that allows plugins to subscribe to events. The EmailPlugin is configured with <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>s
that listen for a specific event and when it is published, the handler defines which template to use to generate the resulting email.

The plugin comes with a set of default handler for the following events:

-   Order confirmation
-   New customer email address verification
-   Password reset request
-   Email address change request

You can also create your own handler and register them with the plugin - see the <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> docs for more details.

## Installation

`yarn add @deenruv/email-plugin`

or

`npm install @deenruv/email-plugin`

_Example_

```ts
import { defaultEmailHandlers, EmailPlugin } from '@deenruv/email-plugin';

const config: DeenruvConfig = {
    // Add an instance of the plugin to the plugins array
    plugins: [
        EmailPlugin.init({
            handler: defaultEmailHandlers,
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

## Email templates

In the example above, the plugin has been configured to look in `<app-root>/static/email/templates`
for the email template files. If you used `@deenruv/create` to create your application, the templates will have
been copied to that location during setup.

If you are installing the EmailPlugin separately, then you'll need to copy the templates manually from
`node_modules/@deenruv/email-plugin/templates` to a location of your choice, and then point the `templatePath` config
property at that directory.

-   ### Dynamic Email Templates
    Instead of passing a static value to `templatePath`, use `templateLoader` to define a template path.

```ts
  EmailPlugin.init({
   ...,
   templateLoader: new FileBasedTemplateLoader(my/order-confirmation/templates)
  })
```

## Customizing templates

Emails are generated from templates which use [MJML](https://mjml.io/) syntax. MJML is an open-source HTML-like markup
language which makes the task of creating responsive email markup simple. By default, the templates are installed to
`<project root>/deenruv/email/templates` and can be freely edited.

Dynamic data such as the recipient's name or order items are specified using [Handlebars syntax](https://handlebarsjs.com/):

```html
<p>Dear {{ order.customer.firstName }} {{ order.customer.lastName }},</p>

<p>Thank you for your order!</p>

<mj-table cellpadding="6px">
    {{#each order.lines }}
    <tr class="order-row">
        <td>{{ quantity }} x {{ productVariant.name }}</td>
        <td>{{ productVariant.quantity }}</td>
        <td>{{ formatMoney totalPrice }}</td>
    </tr>
    {{/each}}
</mj-table>
```

### Setting global variables using `globalTemplateVars`

`globalTemplateVars` is an object that can be passed to the configuration of the Email Plugin with static object variables.
You can also pass an async function that will be called with the `RequestContext` and the `Injector` so you can access services
and e.g. load channel specific theme configurations.

_Example_

```ts
EmailPlugin.init({
    globalTemplateVars: {
        primaryColor: '#FF0000',
        fromAddress: 'no-reply@ourstore.com',
    },
});
```

or

```ts
EmailPlugin.init({
    globalTemplateVars: async (ctx, injector) => {
        const myAsyncService = injector.get(MyAsyncService);
        const asyncValue = await myAsyncService.get(ctx);
        const channel = ctx.channel;
        const { primaryColor } = channel.customFields.theme;
        const theme = {
            primaryColor,
            asyncValue,
        };
        return theme;
    },
});
```

### Handlebars helpers

The following helper functions are available for use in email templates:

-   `formatMoney`: Formats an amount of money (which are always stored as integers in Deenruv) as a decimal, e.g. `123` => `1.23`
-   `formatDate`: Formats a Date value with the [dateformat](https://www.npmjs.com/package/dateformat) package.

## Extending the default email handler

The `defaultEmailHandlers` array defines the default handler such as for handling new account registration, order confirmation, password reset
etc. These defaults can be extended by adding custom templates for languages other than the default, or even completely new types of emails
which respond to any of the available [DeenruvEvents](/reference/typescript-api/events/).

A good way to learn how to create your own email handler is to take a look at the
[source code of the default handler](https://github.com/aexol-studio/deenruv/blob/master/packages/email-plugin/src/handler/default-email-handlers.ts).
New handler are defined in exactly the same way.

It is also possible to modify the default handler:

```ts
// Rather than importing `defaultEmailHandlers`, you can
// import the handler individually
import {
  orderConfirmationHandler,
  emailVerificationHandler,
  passwordResetHandler,
  emailAddressChangeHandler,
} from '@deenruv/email-plugin';
import { CustomerService } from '@deenruv/core';

// This allows you to then customize each handler to your needs.
// For example, let's set a new subject line to the order confirmation:
const myOrderConfirmationHandler = orderConfirmationHandler
  .setSubject(`We received your order!`);

// Another example: loading additional data and setting new
// template variables.
const myPasswordResetHandler = passwordResetHandler
  .loadData(async ({ event, injector }) => {
    const customerService = injector.get(CustomerService);
    const customer = await customerService.findOneByUserId(event.ctx, event.user.id);
    return { customer };
  })
  .setTemplateVars(event => ({
    passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
    customer: event.data.customer,
  }));

// Then you pass the handler to the EmailPlugin init method
// individually
EmailPlugin.init({
  handler: [
    myOrderConfirmationHandler,
    myPasswordResetHandler,
    emailVerificationHandler,
    emailAddressChangeHandler,
  ],
  // ...
}),
```

For all available methods of extending a handler, see the <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> documentation.

## Dynamic SMTP settings

Instead of defining static transport settings, you can also provide a function that dynamically resolves
channel aware transport settings.

_Example_

```ts
import { defaultEmailHandlers, EmailPlugin } from '@deenruv/email-plugin';
import { MyTransportService } from './transport.services.ts';
const config: DeenruvConfig = {
    plugins: [
        EmailPlugin.init({
            handler: defaultEmailHandlers,
            templatePath: path.join(__dirname, 'static/email/templates'),
            transport: (injector, ctx) => {
                if (ctx) {
                    return injector.get(MyTransportService).getSettings(ctx);
                } else {
                    return {
                        type: 'smtp',
                        host: 'smtp.example.com',
                        // ... etc.
                    };
                }
            },
        }),
    ],
};
```

## Dev mode

For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Deenruv to use the
file transport (See <a href='/reference/core-plugins/email-plugin/transport-options#filetransportoptions'>FileTransportOptions</a>) and outputs emails as rendered HTML files in the directory specified by the
`outputPath` property.

```ts
EmailPlugin.init({
    devMode: true,
    route: 'mailbox',
    handler: defaultEmailHandlers,
    templatePath: path.join(__dirname, 'deenruv/email/templates'),
    outputPath: path.join(__dirname, 'test-emails'),
});
```

### Dev mailbox

In dev mode, a webmail-like interface available at the `/mailbox` path, e.g.
http://localhost:3000/mailbox. This is a simple way to view the output of all emails generated by the EmailPlugin while in dev mode.

## Troubleshooting SMTP Connections

If you are having trouble sending email over and SMTP connection, set the `logging` and `debug` options to `true`. This will
send detailed information from the SMTP transporter to the configured logger (defaults to console). For maximum detail combine
this with a detail log level in the configured VendureLogger:

```ts
const config: DeenruvConfig = {
  logger: new DefaultLogger({ level: LogLevel.Debug })
  // ...
  plugins: [
    EmailPlugin.init({
      // ...
      transport: {
        type: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        },
        logging: true,
        debug: true,
      },
    }),
  ],
};
```

```ts title="Signature"
class EmailPlugin implements OnApplicationBootstrap, OnApplicationShutdown, NestModule {
    init(options: EmailPluginOptions | EmailPluginDevModeOptions) => Type<EmailPlugin>;
    onApplicationShutdown() => ;
    configure(consumer: MiddlewareConsumer) => ;
}
```

-   Implements: <code>OnApplicationBootstrap</code>, <code>OnApplicationShutdown</code>, <code>NestModule</code>

<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a> | <a href='/reference/core-plugins/email-plugin/email-plugin-options#emailplugindevmodeoptions'>EmailPluginDevModeOptions</a>) => Type&#60;<a href='/reference/core-plugins/email-plugin/#emailplugin'>EmailPlugin</a>&#62;`} />

### onApplicationShutdown

<MemberInfo kind="method" type={`() => `} />

### configure

<MemberInfo kind="method" type={`(consumer: MiddlewareConsumer) => `} />

</div>
