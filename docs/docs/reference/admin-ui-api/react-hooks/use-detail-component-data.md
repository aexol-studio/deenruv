---
title: 'UseDetailComponentData'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## useDetailComponentData

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-detail-component-data.ts" sourceLine="34" packageName="@deenruv/admin-ui" />

Provides the data available to React-based CustomDetailComponents.

_Example_

```ts
import { Card, useDetailComponentData } from '@deenruv/admin-ui/react';
import React from 'react';

export function CustomDetailComponent(props: any) {
    const { entity, detailForm } = useDetailComponentData();
    const updateName = () => {
        detailForm.get('name')?.setValue('New name');
        detailForm.markAsDirty();
    };
    return (
        <Card title={'Custom Detail Component'}>
            <button className="button" onClick={updateName}>
                Update name
            </button>
            <pre>{JSON.stringify(entity, null, 2)}</pre>
        </Card>
    );
}
```

```ts title="Signature"
function useDetailComponentData<T = any>(): void;
```
