# EmptyState

This component is used to show messages when there are no elements in a table.

## Props

### icon

- **Type:** `ReactNode`

- An optional icon displayed above the title.

### title

- **Type:** `string`

- The title of the card.

### columnsLength

- **Type:** `number`

- Necessary for full width display inside tables.

### description

- **Type:** `string`

- An optional description displayed below the title.

### filtered

- **Type:** `boolean`

- Used to show different icon and texts when empty state is due to filtering.

### color

- **Type:** `TailwindColor`

- The color theme of the icon.

### small

- **Type:** `boolean`

- If true, some different styles are applied to make the component smaller.



## Example Usage

```tsx
<EmptyState
  icon={/* value */}
  title={/* value */}
  columnsLength={/* value */}
  description={/* value */}
  filtered={/* value */}
  color={/* value */}
  small={/* value */}
/>
```
