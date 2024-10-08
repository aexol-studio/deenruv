---
title: 'UseInjector'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## useInjector

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-injector.ts" sourceLine="27" packageName="@deenruv/admin-ui" />

Exposes the Angular injector which allows the injection of services into React components.

_Example_

```ts
import { useInjector } from '@deenruv/admin-ui/react';
import { NotificationService } from '@deenruv/admin-ui/core';

export const MyComponent = () => {
    const notificationService = useInjector(NotificationService);

    const handleClick = () => {
        notificationService.success('Hello world!');
    };
    // ...
    return <div>...</div>;
}
```

```ts title="Signature"
function useInjector<T = any>(token: ProviderToken<T>): T;
```

Parameters

### token

<MemberInfo kind="parameter" type={`ProviderToken&#60;T&#62;`} />
