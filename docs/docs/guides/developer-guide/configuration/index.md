---
title: 'Configuration'
sidebar_position: 3
---

# Configuration

Every aspect of the Deenruv server is configured via a single, central [`DeenruvConfig`](/reference/typescript-api/configuration/deenruv-config/) object. This object is passed into the [`bootstrap`](/reference/typescript-api/common/bootstrap/) and [`bootstrapWorker`](/reference/typescript-api/worker/bootstrap-worker/) functions to start up the Deenruv server and worker respectively.

The `DeenruvConfig` object is organised into sections, grouping related settings together. For example, [`DeenruvConfig.apiOptions`](/reference/typescript-api/configuration/api-options/) contains all the config for the GraphQL APIs, whereas [`DeenruvConfig.authOptions`](/reference/typescript-api/auth/auth-options/) deals with authentication.

## Important Configuration Settings

In this guide, we will take a look at those configuration options needed for getting the server up and running.

:::tip
A description of every available configuration option can be found in the [`DeenruvConfig` reference docs](/reference/typescript-api/configuration/deenruv-config/).
:::

### Specifying API hostname & port etc

The [`DeenruvConfig.apiOptions`](/reference/typescript-api/configuration/api-options/) object is used to set the hostname, port, as well as other API-related concerns. Express middleware and Apollo Server plugins may also be specified here.

Example:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    apiOptions: {
        hostname: 'localhost',
        port: 3000,
        adminApiPath: '/admin',
        shopApiPath: '/shop',
        middleware: [
            {
                // add some Express middleware to the Shop API route
                handler: timeout('5s'),
                route: 'shop',
            },
        ],
    },
    // ...
};
```

### Connecting to the database

The database connection is configured with the `DeenruvConfig.dbConnectionOptions` object. This object is actually the [TypeORM DataSourceOptions object](https://typeorm.io/data-source-options) and is passed directly to TypeORM.

Example:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        synchronize: false,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'deenruv',
        migrations: [path.join(__dirname, 'migrations/*.ts')],
    },
    // ...
};
```

### Configuring authentication

Authentication settings are configured with [`DeenruvConfig.authOptions`](/reference/typescript-api/auth/auth-options/). The most important setting here is whether the storefront client will use cookies or bearer tokens to manage user sessions. For more detail on this topic, see [the Managing Sessions guide](/guides/storefront/connect-api/#managing-sessions).

The username and default password of the superadmin user can also be specified here. In production, it is advisable to use environment variables for these settings (see the following section on usage of environment variables).

Example:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    authOptions: {
        tokenMethod: 'cookie',
        requireVerification: true,
        cookieOptions: {
            secret: process.env.COOKIE_SESSION_SECRET,
        },
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
    },
    // ...
};
```

## Working with the DeenruvConfig object

Since the `DeenruvConfig` is just a JavaScript object, it can be managed and manipulated according to your needs. For example:

### Using environment variables

Environment variables can be used when you don't want to hard-code certain values which may change, e.g. depending on whether running locally, in staging or in production:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    apiOptions: {
        hostname: process.env.HOSTNAME,
        port: process.env.PORT,
    },
    // ...
};
```

They are also useful so that sensitive credentials do not need to be hard-coded and committed to source control:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    dbConnectionOptions: {
        type: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'deenruv',
    },
    // ...
};
```

When you create a Deenruv project with `@deenruv/create`, it comes with the [dotenv](https://www.npmjs.com/package/dotenv) package installed, which allows you to store environment variables in a `.env` file in the root of your project.

To define new environment variables, you can add them to the `.env` file. For instance, if you are using a plugin that requires
an API key, you can

```txt title=".env"
APP_ENV=dev
COOKIE_SECRET=toh8soqdlj
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin
// highlight-next-line
MY_API_KEY=12345
```

In order to tell TypeScript about the existence of this new variable, you can add it to the `src/environment.d.ts` file:

```ts title="src/environment.d.ts"
export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ENV: string;
            COOKIE_SECRET: string;
            SUPERADMIN_USERNAME: string;
            SUPERADMIN_PASSWORD: string;
            // highlight-next-line
            MY_API_KEY: string;
        }
    }
}
```

You can then use the environment variable in your config file:

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';

export const config: DeenruvConfig = {
    plugins: [
        MyPlugin.init({
            apiKey: process.env.MY_API_KEY,
        }),
    ],
    // ...
};
```

:::info

In production, the way you manage environment variables will depend on your hosting provider. Read more about this in our [Production Configuration guide](/guides/deployment/production-configuration/).

:::

### Splitting config across files

If the config object grows too large, you can split it across several files. For example, the `plugins` array in a real-world project can easily grow quite big:

```ts title="src/deenruv-config-plugins.ts"
import { AssetServerPlugin, DefaultJobQueuePlugin, DeenruvConfig } from '@deenruv/core';
import { ElasticsearchPlugin } from '@deenruv/elasticsearch-plugin';
import { EmailPlugin } from '@deenruv/email-plugin';
import { CustomPlugin } from './plugins/custom-plugin';

export const plugins: DeenruvConfig['plugins'] = [
    CustomPlugin,
    AssetServerPlugin.init({
        route: 'assets',
        assetUploadDir: path.join(__dirname, 'assets'),
        port: 5002,
    }),
    DefaultJobQueuePlugin,
    ElasticsearchPlugin.init({
        host: 'localhost',
        port: 9200,
    }),
    EmailPlugin.init({
        // ...lots of lines of config
    }),
];
```

```ts title="src/deenruv-config.ts"
import { DeenruvConfig } from '@deenruv/core';
import { plugins } from './deenruv-config-plugins';

export const config: DeenruvConfig = {
    plugins,
    // ...
};
```
