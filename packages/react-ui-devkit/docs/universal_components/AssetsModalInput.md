# AssetsModalInput

A modal that allows the user to select an asset from a list of available assets.

## Props

### value

- **Type:** `AssetsModalChangeType`

- The currently selected asset.

### setValue

- **Type:** `(value?: AssetsModalChangeType) => void`

- Callback invoked whenever the selected asset changes.

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
  value={/* value */}
  setValue={(value?: AssetsModalChangeType) => {}}
/>
```
