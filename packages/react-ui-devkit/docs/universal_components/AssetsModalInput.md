# AssetsModalInput

A responsive, accessible modal that allows the user to select one asset from the
asset library. Search, tag filters, upload, metadata, and picker-local pagination
are available without changing the committed value until the user confirms.

## Props

### value

- **Type:** `{ id: string; preview: string } | undefined`

- The currently committed asset. Opening the dialog creates a draft selection
  from this value; cancelling discards draft changes.

### setValue

- **Type:** `(value?: AssetsModalChangeType) => void`

- Callback invoked with `{ id, preview, source }` after the user confirms. The
  optional callback argument is retained for backwards compatibility; the picker
  does not add a separate clear action.

## Custom Types

```typescript
export interface AssetsModalChangeType {
    id: string;
    preview: string;
    source: string;
}
```

## Example Usage

```tsx
<AssetsModalInput
  value={selectedAsset ? { id: selectedAsset.id, preview: selectedAsset.preview } : undefined}
  setValue={(value?: AssetsModalChangeType) => setSelectedAsset(value)}
/>
```

Uploaded assets become the current draft selection automatically. Asset cards
are single-select buttons and expose selected state to assistive technology.
