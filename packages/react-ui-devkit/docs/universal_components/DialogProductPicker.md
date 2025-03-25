# DialogProductPicker

Dialog component for selecting products or product variants.

## Props

### mode

- **Type:** `'product' | 'variant'`

- Specifies whether the picker is for products or product variants.

### multiple

- **Type:** `boolean`

- Determines if multiple selections are allowed. Defaults to false.

### initialValue

- **Type:** `string | string[]`

- Initial selected value(s). Array of IDs if `multiple` is true; single ID otherwise.

### onSubmit

- **Type:** `(value: DialogProductPickerType | DialogProductPickerType[]) => void`

- Callback triggered on selection confirmation.

### onCancel

- **Type:** `() => void`

- Optional callback triggered when the selection is canceled.



## Example Usage

```tsx
<DialogProductPicker
  mode={'product' | 'variant'}
  multiple={/* value */}
  initialValue={string | string[]}
  onSubmit={(value: DialogProductPickerType | DialogProductPickerType[]) => {}}
  onCancel={() => {}}
/>
```
