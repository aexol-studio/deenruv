---
title: 'UseRichTextEditor'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Deenruv source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## useRichTextEditor

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-rich-text-editor.ts" sourceLine="40" packageName="@deenruv/admin-ui" />

Provides access to the ProseMirror (rich text editor) instance.

_Example_

```ts
import { useRichTextEditor } from '@deenruv/admin-ui/react';
import React from 'react';

export function Component() {
    const { ref, editor } = useRichTextEditor({
       attributes: { class: '' },
       onTextInput: (text) => console.log(text),
       isReadOnly: () => false,
    });

    return <div className="w-full" ref={ref} />
}
```
