---
title: 'Nest Devtools'
---

The NestJS core team have built a [powerful set of dev tools](https://docs.nestjs.com/devtools/overview) which can be used to inspect, analyze and debug NestJS applications.
Since a Deenruv server is a NestJS application, these tools can be used to debug your Deenruv application.

:::note
Nest Devtools is a paid service. You can [sign up for a free trial](https://devtools.nestjs.com/).
:::

## Installation

First you'll need to install the `@nestjs/devtools-integration` package:

```bash
npm i @nestjs/devtools-integration
```

## Configuration

Next you need to create a plugin which imports the `DevToolsModule` and adds it to the `imports` array:

```ts title="src/plugins/devtools/devtools-plugin.ts"
import { VendurePlugin } from '@deenruv/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@DeenruvPlugin({
    imports: [
        DevtoolsModule.register({
            // The reason we are checking the NODE_ENV environment
            // variable here is that you should never use this module in production!
            http: process.env.NODE_ENV !== 'production',
        }),
    ],
})
class DevtoolsPlugin {}
```

Now we need to add this plugin to the `plugins` array in the `DeenruvConfig`. We need to make sure we are
only adding it to the server config, and not the worker, otherwise we will get a port config when
running the server and worker at the same time.

Lastly we must set the `snapshot` option when bootstrapping the server. Note: this is only possible
with Deenruv v2.2 or later.

```ts title="src/index.ts"
import { bootstrap } from '@deenruv/core';
import { config } from './deenruv-config';

const configWithDevtools = {
    ...config,
    plugins: [...config.plugins, DevtoolsPlugin],
};

bootstrap(configWithDevtools, {
    nestApplicationOptions: { snapshot: true },
}).catch(err => {
    console.log(err);
    process.exit(1);
});
```

## Usage

Now you can start the server, and navigate to [devtools.nestjs.com](https://devtools.nestjs.com/) to start view your
Deenruv server in the Nest Devtools dashboard.

![Nest Devtools graphql explorer](./nest-devtools-graph.webp)
![Nest Devtools bootstrap performance](./nest-devtools-bootstrap-perf.webp)
