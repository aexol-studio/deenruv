---
title: 'ActionBar'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## ActionBar

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/ActionBar.tsx" sourceLine="22" packageName="@deenruv/admin-ui" />

A container for the primary actions on a list or detail page

_Example_

```ts
import { ActionBar } from '@deenruv/admin-ui/react';

export function MyComponent() {
  return (
    <ActionBar leftContent={<div>Optional left content</div>}>
      <button className='button primary'>Primary action</button>
    </ActionBar>
  );
}
```

```ts title="Signature"
function ActionBar(props: PropsWithChildren<{ leftContent?: ReactNode }>): void;
```

Parameters

### props

<MemberInfo kind="parameter" type={`PropsWithChildren&#60;{ leftContent?: ReactNode }&#62;`} />
