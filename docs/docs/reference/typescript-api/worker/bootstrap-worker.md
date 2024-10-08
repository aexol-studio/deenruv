---
title: 'BootstrapWorker'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## bootstrapWorker

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="170" packageName="@deenruv/core" />

Bootstraps a Deenruv worker. Resolves to a <a href='/reference/typescript-api/worker/deenruv-worker#vendureworker'>VendureWorker</a> object containing a reference to the underlying
NestJs [standalone application](https://docs.nestjs.com/standalone-applications) as well as convenience
methods for starting the job queue and health check server.

Read more about the [Deenruv Worker](/guides/developer-guide/worker-job-queue/).

_Example_

```ts
import { bootstrapWorker } from '@deenruv/core';
import { config } from './deenruv-config';

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .then(worker => worker.startHealthCheckServer({ port: 3020 }))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
```

```ts title="Signature"
function bootstrapWorker(
    userConfig: Partial<DeenruvConfig>,
    options?: BootstrapWorkerOptions,
): Promise<VendureWorker>;
```

Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/deenruv-config#vendureconfig'>DeenruvConfig</a>&#62;`} />

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/worker/bootstrap-worker#bootstrapworkeroptions'>BootstrapWorkerOptions</a>`} />

## BootstrapWorkerOptions

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="58" packageName="@deenruv/core" since="2.2.0" />

Additional options that can be used to configure the bootstrap process of the
Deenruv worker.

```ts title="Signature"
interface BootstrapWorkerOptions {
    nestApplicationContextOptions: NestApplicationContextOptions;
}
```

<div className="members-wrapper">

### nestApplicationContextOptions

<MemberInfo kind="property" type={`NestApplicationContextOptions`} />

These options get passed directly to the `NestFactory.createApplicationContext` method.

</div>
