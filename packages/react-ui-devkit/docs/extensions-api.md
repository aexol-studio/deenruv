# Extension-Surface API

The **extension-surface API** (`extensions`) is the recommended way for Deenruv plugins to inject UI components into detail views and sidebars. It complements and improves upon the legacy `components` array with:

- **Stable React keys** — no UUID-based instability between renders
- **Explicit ordering** — control placement with the `order` field
- **Typed surfaces** — targets use `DetailLocationID` / `DetailLocationSidebarID` types
- **Deterministic resolution** — extensions sorted by `order`, then by registration sequence

## Quick Start

```ts
import { createDeenruvUIPlugin, DEENRUV_UI_VERSION } from '@deenruv/react-ui-devkit';
import { MyComponent } from './components/MyComponent';

export const MyPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: 'My Plugin',
  extensions: [
    {
      id: 'my-product-widget',
      surface: 'products-detail-view',
      component: MyComponent,
    },
  ],
});
```

## `SurfaceExtension` Shape

| Field       | Type                                              | Required | Description |
|-------------|---------------------------------------------------|----------|-------------|
| `id`        | `string`                                          | ✅       | Stable unique identifier within the plugin. Used as React key. |
| `surface`   | `DetailLocationID \| DetailLocationSidebarID`     | ✅       | Target surface where the component is injected. |
| `tab`       | `string`                                          | ❌       | Only render when this tab is active. |
| `order`     | `number`                                          | ❌       | Lower values appear first. Unordered entries are appended after ordered ones. |
| `component` | `React.ComponentType`                             | ✅       | The React component to render. |

## Ordering Semantics

1. Extensions **with** `order` are sorted ascending (e.g. `order: 10` before `order: 20`).
2. Extensions **without** `order` are appended in plugin-registration order.
3. **New API extensions always appear before legacy `components`** entries.

### Example: Controlling Order

```ts
extensions: [
  { id: 'price-override', surface: 'products-detail-view', order: 10, component: PriceOverride },
  { id: 'badges',         surface: 'products-detail-view', order: 20, component: Badges },
  { id: 'seo-meta',       surface: 'products-detail-view',            component: SeoMeta }, // no order → last
],
```

## Available Surfaces

Surfaces map directly to detail view location IDs defined in the framework:

| Surface ID                         | Location |
|------------------------------------|----------|
| `products-detail-view`             | Product detail — main content area |
| `products-detail-view-sidebar`     | Product detail — sidebar |
| `orders-detail-view`               | Order detail — main content area |
| `orders-detail-view-sidebar`       | Order detail — sidebar |
| `customers-detail-view`            | Customer detail — main content area |
| `collections-detail-view`          | Collection detail — main content area |
| *...and all other `*-detail-view`* | See `DetailLocations` in `types/types.ts` |

Use the dev marker (Ctrl+Q) in the admin panel to discover surface IDs interactively.

## Tab Filtering

To render only when a specific tab is active, set the `tab` field:

```ts
extensions: [
  {
    id: 'product-seo',
    surface: 'products-detail-view-sidebar',
    tab: 'product',
    component: SeoSidebar,
  },
],
```

## Accessing Surface Components Programmatically

The plugin context exposes `getSurfaceComponents()` which returns entries with stable keys:

```tsx
const { getSurfaceComponents } = usePluginStore();
const entries = getSurfaceComponents('products-detail-view', activeTab);
// entries: Array<{ key: string; component: React.ComponentType }>
```

## Migration from Legacy `components`

The legacy `components` array is still fully supported but is deprecated in favour of `extensions`.

### Before (legacy)

```ts
createDeenruvUIPlugin({
  components: [
    { id: 'products-detail-view', component: Badges },
    { id: 'products-detail-view-sidebar', tab: 'product', component: SeoWidget },
  ],
});
```

### After (extensions)

```ts
createDeenruvUIPlugin({
  extensions: [
    { id: 'badges',     surface: 'products-detail-view',           component: Badges },
    { id: 'seo-widget', surface: 'products-detail-view-sidebar', tab: 'product', component: SeoWidget },
  ],
});
```

Key differences:
- `id` → now a **stable unique identifier** (not a location string)
- Location string moves to `surface`
- Optional `order` field for explicit placement control
- Both APIs can coexist in the same plugin during migration
