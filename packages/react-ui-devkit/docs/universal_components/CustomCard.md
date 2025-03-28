# CustomCard

A default Deenruv card component. This component provides a styled card layout with configurable title, description, icons, and additional content areas. It supports collapsible behavior and custom styling.

## Props

### icon

- **Type:** `ReactNode`

- An optional icon displayed alongside the title.

### title

- **Type:** `string`

- The title of the card.

### description

- **Type:** `string`

- An optional description displayed below the title.

### upperRight

- **Type:** `ReactNode`

- An optional element positioned in the upper-right corner.

### bottomRight

- **Type:** `ReactNode`

- An optional element positioned in the bottom-right footer corner.

### color

- **Type:** `TailwindColor`

- The color theme of the card.

### wrapperClassName

- **Type:** `string`

- Additional CSS classes for the card wrapper.

### collapsed

- **Type:** `boolean`

- If true, the card starts in a collapsed state.

### notCollapsible

- **Type:** `boolean`

- If true, the card cannot be collapsed.

### children

- **Type:** `ReactNode`

- The main content of the card.



## Example Usage

```tsx
<CustomCard
  icon={/* value */}
  title={/* value */}
  description={/* value */}
  upperRight={/* value */}
  bottomRight={/* value */}
  color={/* value */}
  wrapperClassName={/* value */}
  collapsed={/* value */}
  notCollapsible={/* value */}
  children={/* value */}
/>
```
