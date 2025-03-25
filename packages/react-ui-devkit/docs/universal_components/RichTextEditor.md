# RichTextEditor

Rich text editor component that handles content input and validation.

## Props

### content

- **Type:** `string | undefined`

- The initial content of the editor.

### onContentChanged

- **Type:** `(content: string) => void`

- Callback invoked whenever the editor content changes.

### errors

- **Type:** `string[]`

- Optional list of error messages to display.

### disabled

- **Type:** `boolean`

- Whether the editor is in a disabled state.



## Example Usage

```tsx
<RichTextEditor
  content={string | undefined}
  onContentChanged={(content: string) => {}}
  errors={string[]}
  disabled={/* value */}
/>
```
