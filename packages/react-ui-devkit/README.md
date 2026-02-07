# @deenruv/react-ui-devkit

The official UI plugin development kit for Deenruv Admin Panel. Build type-safe plugins that extend the admin dashboard with custom pages, components, navigation, widgets, notifications, and more.

## Overview

`@deenruv/react-ui-devkit` provides everything you need to build Deenruv admin UI plugins:

- **Plugin System** — Type-safe plugin definition with 15 extension points
- **Location-Based Injection** — 21 list locations, 20 detail locations, and modal locations
- **GraphQL Client** — Zeus Thunder client with automatic `customFields` injection
- **Form Management** — `useGFFLP` for type-safe forms driven by GraphQL `ModelTypes`
- **Component Library** — 40+ shadcn/ui atoms, molecules, templates, and universal components
- **State Management** — Zustand stores for settings, server state, orders, and global search
- **Navigation & Routing** — Type-safe route helpers and customizable admin navigation
- **i18n** — Built-in translation system with per-plugin namespaces
- **Notifications** — Polling-based notification system with configurable placements
- **Dashboard Widgets** — Resizable, configurable dashboard widgets
- **Tailwind v4 CSS-First Theme** — Design tokens defined via `@theme inline` in CSS

## Installation

```bash
pnpm add @deenruv/react-ui-devkit
```

Peer dependency:

```bash
pnpm add @deenruv/core
```

## Quick Start

Create a minimal plugin with a custom page and navigation link:

```tsx
// src/plugin-ui/index.tsx
import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { ListIcon } from 'lucide-react';
import { MyPage } from './pages/MyPage';
import en from './locales/en';
import pl from './locales/pl';

const PLUGIN_NAME = 'my-plugin-ui';

export const MyPlugin = createDeenruvUIPlugin({
  name: PLUGIN_NAME,
  version: '1.0.0',
  translations: {
    ns: 'my-plugin',
    data: { en, pl },
  },
  pages: [
    { path: '', element: <MyPage /> },
    { path: ':id', element: <MyPage /> },
  ],
  navMenuLinks: [
    {
      id: 'my-plugin-link',
      labelId: 'nav.myPlugin',    // Resolved as: my-plugin.nav.myPlugin
      href: '',
      groupId: 'assortment-group', // BASE_GROUP_ID.ASSORTMENT
      icon: ListIcon,
    },
  ],
});
```

> Plugin pages are auto-prefixed with `admin-ui/extensions/{plugin-name}/`.
> Nav link `labelId` is auto-prefixed with `{translations.ns}.{labelId}`.

## Plugin System

### `createDeenruvUIPlugin`

An identity function that provides TypeScript type safety for your plugin definition:

```ts
import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';

export const MyPlugin = createDeenruvUIPlugin({
  name: 'my-plugin-ui',
  version: '1.0.0',
  // ...extension points
});
```

### Extension Points

The `DeenruvUIPlugin<T>` type supports the following extension points:

| Extension Point | Type | Description |
|---|---|---|
| `name` | `string` | Plugin name (required) |
| `version` | `string` | Plugin version (required) |
| `config` | `T` | Custom plugin configuration object |
| `pages` | `PluginPage[]` | Custom routes (auto-prefixed: `admin-ui/extensions/{name}/{path}`) |
| `tables` | `DeenruvUITable[]` | List view columns, row actions, bulk actions with `externalSelector` |
| `tabs` | `DeenruvTabs[]` | Detail view tabs with `hideSidebar`, `sidebarReplacement`, `disabled` |
| `actions` | `{ inline?, dropdown? }` | Detail view action buttons (inline and dropdown) |
| `components` | `DeenruvUIDetailComponent[]` | Inject into detail views/sidebars (supports `tab` filtering, `${KEY}-sidebar` IDs) |
| `modals` | `DeenruvUIModalComponent[]` | Inject into modals |
| `widgets` | `Widget[]` | Dashboard widgets with `size` and `sizes` |
| `inputs` | `PluginComponent[]` | Custom field input overrides |
| `navMenuGroups` | `PluginNavigationGroup[]` | Navigation menu groups with `placement` |
| `navMenuLinks` | `PluginNavigationLink[]` | Navigation links with `groupId`, `icon`, `placement` |
| `topNavigationComponents` | `PluginComponent[]` | Top navigation bar components |
| `topNavigationActionsMenu` | `NavigationAction[]` | Top navigation action menu items |
| `notifications` | `Notification[]` | Polling notifications with `fetch`, `interval`, `placements` |
| `translations` | `{ ns, data }` | i18n bundles as `{ ns: string, data: Record<string, Array<object>> }` |

### Location IDs

Plugins use location IDs to target specific admin panel views.

#### List Locations (21)

Used with `tables` to extend list views:

| Location ID | Entity Type |
|---|---|
| `assets-list-view` | Asset |
| `admins-list-view` | Administrator |
| `channels-list-view` | Channel |
| `collections-list-view` | Collection |
| `countries-list-view` | Country |
| `customerGroups-list-view` | CustomerGroup |
| `customers-list-view` | Customer |
| `facets-list-view` | Facet |
| `facet-values-list` | FacetValue |
| `orders-list-view` | Order |
| `paymentMethods-list-view` | PaymentMethod |
| `products-list-view` | Product |
| `productVariants-list-view` | ProductVariant |
| `promotions-list-view` | Promotion |
| `roles-list-view` | Role |
| `sellers-list-view` | Seller |
| `shippingMethods-list-view` | ShippingMethod |
| `stockLocations-list` | StockLocation |
| `stockLocations-list-view` | StockLocation |
| `taxCategories-list-view` | TaxCategory |
| `taxRates-list-view` | TaxRate |
| `zones-list-view` | Zone |

#### Detail Locations (20)

Used with `tabs`, `actions`, and `components` to extend detail views:

| Location ID | Entity Type |
|---|---|
| `admins-detail-view` | Administrator |
| `channels-detail-view` | Channel |
| `collections-detail-view` | Collection |
| `countries-detail-view` | Country |
| `customerGroups-detail-view` | CustomerGroup |
| `customers-detail-view` | Customer |
| `facets-detail-view` | Facet |
| `globalSettings-detail-view` | GlobalSettings |
| `orders-detail-view` | Order |
| `orders-summary` | Order |
| `paymentMethods-detail-view` | PaymentMethod |
| `products-detail-view` | Product |
| `promotions-detail-view` | Promotion |
| `roles-detail-view` | Role |
| `sellers-detail-view` | Seller |
| `shippingMethods-detail-view` | ShippingMethod |
| `stockLocations-detail-view` | StockLocation |
| `taxCategories-detail-view` | TaxCategory |
| `taxRates-detail-view` | TaxRate |
| `zones-detail-view` | Zone |

To inject into the sidebar of a detail view, append `-sidebar` to the location ID:

```ts
components: [
  {
    id: 'products-detail-view-sidebar',
    tab: 'product',
    component: MyProductSidebar,
  },
],
```

#### Modal Locations

| Location ID | Type |
|---|---|
| `manual-order-state` | Order state transition modal |

#### Navigation Group IDs (`BASE_GROUP_ID`)

```ts
enum BASE_GROUP_ID {
  SHOP       = 'shop-group',
  ASSORTMENT = 'assortment-group',
  USERS      = 'users-group',
  PROMOTIONS = 'promotions-group',
  SHIPPING   = 'shipping-group',
  SETTINGS   = 'settings-group',
}
```

### Plugin View Markers

Press **Ctrl+Q** in the admin panel to toggle plugin view markers. This highlights the injection points where plugin components are rendered, useful for debugging plugin placement.

## Hooks

### `useGFFLP`

Type-safe form state management driven by GraphQL `ModelTypes`. Creates form fields for specific properties of a GraphQL type with built-in validation, dot-path nested updates, and `customFields` merge semantics.

> **Note:** A deprecated alias `useGLFFP` is exported for backward compatibility and will be removed in a future major version. Always use `useGFFLP` in new code.

```ts
import { useGFFLP } from '@deenruv/react-ui-devkit';

// Pick specific fields from a GraphQL model type
const { state, setField, setState, checkIfAllFieldsAreValid, haveValidFields, clearErrors, clearAllForm } =
  useGFFLP('Product', 'name', 'slug', 'description')({
    name: {
      initialValue: '',
      validate: (value) => (!value ? ['Name is required'] : undefined),
    },
    slug: { initialValue: '' },
    description: { initialValue: '' },
  });

// Access field values
const name = state.name?.value;
const nameErrors = state.name?.errors;

// Update a field
setField('name', 'My Product');

// Validate all fields
const allValid = checkIfAllFieldsAreValid();
```

**Returns:**

| Property | Type | Description |
|---|---|---|
| `state` | `Partial<Record<K, GFFLPFormField<T>>>` | Current form state with `value`, `initialValue`, `errors`, `validatedValue` |
| `setField` | `(field, value) => void` | Update a single field (supports dot notation for nested fields) |
| `setState` | `(value) => void` | Set all fields at once |
| `checkIfAllFieldsAreValid` | `() => boolean` | Run all validators and return validity |
| `haveValidFields` | `boolean` | Whether all validated fields currently have valid values |
| `clearErrors` | `() => void` | Clear all validation errors (sets `validatedValue` for consistency) |
| `clearAllForm` | `() => void` | Reset form to initial values |

### `useFFLP`

Lower-level form hook used by `useGFFLP`. Use directly when you need form state without GraphQL `ModelTypes` binding:

```ts
import { useFFLP } from '@deenruv/react-ui-devkit';

const { state, setField } = useFFLP<{ email: string; age: number }>({
  email: {
    initialValue: '',
    validate: (v) => (!v.includes('@') ? ['Invalid email'] : undefined),
  },
  age: { initialValue: 0 },
});
```

### `useList`

Paginated list management with URL search params for sorting, filtering, and pagination. Returns a pre-built `Paginate` JSX element.

```ts
import { useList, apiClient } from '@deenruv/react-ui-devkit';

const {
  Paginate,          // Pre-built pagination JSX component
  objects,           // Current page items
  total,             // Total item count
  setSort,           // Set sort column
  setFilter,         // Set filter object
  setFilterField,    // Set individual filter field
  removeFilterField, // Remove individual filter field
  resetFilter,       // Clear all filters
  optionInfo,        // Current { page, perPage, sort, filter, filterOperator }
  refetch,           // Manual refetch
  isFilterOn,        // Whether any filters are active
} = useList({
  route: (options) =>
    apiClient('query')({
      products: [
        {
          options: {
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
            sort: options.sort
              ? { [options.sort.key]: options.sort.sortDir }
              : undefined,
            filter: options.filter,
          },
        },
        { totalItems: true, items: { id: true, name: true } },
      ],
    }).then((r) => r.products),
  listType: 'products',
});
```

### `useTranslation`

Wrapper around `react-i18next` that uses the Deenruv i18n instance from `window.__DEENRUV_SETTINGS__.i18n`.

```ts
import { useTranslation } from '@deenruv/react-ui-devkit';

const { t, tEntity, i18n } = useTranslation('my-plugin-namespace');

// Standard translation
t('my.key');

// Entity-aware translation with pluralization
tEntity('entity.title', 'Product', 'one');   // singular
tEntity('entity.title', 'Product', 'many');  // plural
tEntity('entity.title', 'Product', 5);       // count-based
```

> **Important:** Never import `react-i18next` directly. Always use `useTranslation` from `@deenruv/react-ui-devkit` to ensure the correct i18n instance is used.

### `useAssets`

Asset management hook with pagination, search, and tag filtering:

```ts
import { useAssets } from '@deenruv/react-ui-devkit';

const {
  assets,        // Current page of assets
  isPending,     // Loading state
  error,         // Error message
  totalItems,    // Total asset count
  refetchData,   // Manual refetch
  page, setPage, // Pagination
  perPage, setPerPage,
  searchTerm, setSearchTerm, // Text search
  searchTags, setSearchTags, // Tag filter
  totalPages,
} = useAssets();
```

### `useDebounce`

Re-exported from `use-debounce`. Debounces a value with a configurable delay.

### `useLocalStorage`

Persistent state management using browser localStorage.

### `useValidators`

Common validation functions for form fields.

### `useErrorHandler`

Centralized error handling for GraphQL and API errors.

### `useRouteGuard`

> **Note:** This hook is currently **disabled**. The internal `useBlocker` callback always returns `false`. Route guard blocking logic is commented out in the source.

### `useCustomSearchParams`

Helper for managing URL search parameters in list views.

## Components

### Templates

High-level page layout components:

| Component | Description |
|---|---|
| `DetailList` | Full-featured list page with table, pagination, filtering, sorting, bulk actions |
| `DetailView` | Detail page layout with tabs, sidebar, actions, and plugin injection points |

### Core Components

| Component | Description |
|---|---|
| `DetailViewMarker` | Plugin injection marker for detail views (toggle with Ctrl+Q) |
| `ListViewMarker` | Plugin injection marker for list views (toggle with Ctrl+Q) |
| `Renderer` | Dynamic component renderer for plugin-injected content |
| `EntityCustomFields` | Renders custom field inputs for any entity |

### Molecule Components (13)

Higher-level composed components:

| Component | Description |
|---|---|
| `PaymentMethodImage` | Payment method icon/image display |
| `OrderStateBadge` | Color-coded order state badge |
| `SimpleSelect` | Simplified select dropdown |
| `SimpleTooltip` | Simplified tooltip wrapper |
| `SortButton` | Column sort toggle button |
| `TranslationSelect` | Language/translation picker |
| `ListTable` | Data table for list views |
| `SearchInput` | Search input with debounce |
| `CustomFieldsModal` | Modal for editing custom fields |
| `ImageWithPreview` | Image thumbnail with lightbox preview |
| `ErrorMessage` | Styled error message display |
| `ListBadge` | Badge for list item status |
| `ContextMenu` | Right-click context menu |

### Atom Components (42)

shadcn/ui-based primitive components, all styled with the Deenruv theme:

`Accordion` `AlertDialog` `AssetUploadButton` `AspectRatio` `Badge` `Breadcrumb` `Button` `Calendar` `Card` `Chart` `Checkbox` `Command` `Dialog` `Drawer` `DropdownMenu` `FacetedFilter` `Form` `HoverCard` `ImagePlaceholder` `Input` `Label` `LanguagePicker` `MultipleSelector` `Pagination` `Popover` `Progress` `RadioGroup` `ScrollArea` `Select` `Separator` `Sheet` `Skeleton` `Sonner` `Spinner` `Switch` `Table` `Tabs` `Textarea` `Timeline` `Toggle` `ToggleGroup` `Tooltip`

### Universal Components (15)

Reusable business-logic components for common admin patterns:

| Component | Description |
|---|---|
| `DialogProductPicker` | Product selection dialog with search |
| `RichTextEditor` | Tiptap-based rich text editor |
| `AssetsModalInput` | Asset picker with modal browser |
| `ConfirmationDialog` | Confirmation dialog with customizable actions |
| `PageBlock` | Page section wrapper with title and description |
| `CustomCard` | Styled card with consistent admin theme |
| `CustomCardHeader` | Card header with title, description, and actions |
| `EmptyState` | Empty state placeholder with icon and message |
| `FacetIdsSelector` | Facet value multi-selector |
| `DraggableSelect` | Drag-and-drop reorderable select |
| `SimpleTimePicker` | Time-only picker |
| `DateTimePicker` | Combined date and time picker |
| `DateTimeInput` | Date/time input field |
| `EntityChannelManager` | Channel assignment manager for entities |
| `CustomerSearch` | Customer search with autocomplete |

### Universal Table Actions (5)

Pre-built table actions for common entity operations:

| Component | Description |
|---|---|
| `ManageEntityToChannelsDialog` | Dialog for assigning entities to channels |
| `DeleteEntityFromChannelsDialog` | Dialog for removing entities from channels |
| `EntityChannelManagementRowAction` | Row-level channel management action |
| `EntityChannelManagementBulkAction` | Bulk channel management action |
| `EntityFacetManagementBulkAction` | Bulk facet assignment action |

### Universal Utilities

| Function | Description |
|---|---|
| `createDialogFunction` | Create a dialog trigger function from a dialog component |
| `createDialogFromComponentFunction` | Create a dialog from an existing component |

## GraphQL Client

### `apiClient`

Zeus Thunder client for standard GraphQL queries and mutations. Automatically injects `customFields` into queries via GraphQL AST manipulation.

```ts
import { apiClient } from '@deenruv/react-ui-devkit';

// Query
const result = await apiClient('query')({
  product: [
    { id: 'product-123' },
    {
      id: true,
      name: true,
      slug: true,
      description: true,
      // customFields are automatically injected!
    },
  ],
});

// Mutation
const updated = await apiClient('mutation')({
  updateProduct: [
    { input: { id: 'product-123', translations: [] } },
    { id: true, name: true },
  ],
});
```

### `apiUploadClient`

Zeus Thunder client for file upload mutations (multipart form data):

```ts
import { apiUploadClient } from '@deenruv/react-ui-devkit';

const result = await apiUploadClient('mutation')({
  createAssets: [
    { input: [{ file: myFile }] },
    { ... on Asset: { id: true, source: true } },
  ],
});
```

### `useQuery`

React hook for declarative GraphQL queries with automatic execution:

```ts
import { useQuery } from '@deenruv/react-ui-devkit';
import { MyQueryDocument } from './graphql/queries';

const { data, loading, error, runQuery } = useQuery(MyQueryDocument, {
  initialVariables: { id: 'product-123' },
  onSuccess: (data) => console.log('Loaded:', data),
  stopRefetchOnChannelChange: false, // Re-fetches when channel changes by default
});

// Manual re-fetch with different variables
await runQuery({ id: 'product-456' });
```

### `useMutation`

React hook for GraphQL mutations.

### `useLazyQuery`

React hook for on-demand GraphQL queries (not executed automatically).

### `deenruvAPICall`

Low-level API call function used internally by `apiClient` and `apiUploadClient`. Handles:

- Authentication via `Bearer` token from settings store
- Channel token injection
- Language code parameters
- Custom fields AST injection
- GraphQL error handling

## State Management

Zustand-based global stores:

### `useSettings`

Persisted settings store for the admin panel:

```ts
import { useSettings } from '@deenruv/react-ui-devkit';

const token = useSettings((s) => s.token);
const selectedChannel = useSettings((s) => s.selectedChannel);
const translationsLanguage = useSettings((s) => s.translationsLanguage);
const logIn = useSettings((s) => s.logIn);
const logOut = useSettings((s) => s.logOut);
```

### `useServer`

Server connection and status state.

### `useOrder`

Order-specific state management for the order detail view.

### `useGlobalSearch`

Global search state across the admin panel.

### `useRouteGuardStore`

Route guard state (currently disabled - see `useRouteGuard` hook note).

### `GlobalStoreProvider` / `useGlobalStore`

Context-based global store provider for app-wide state.

## Types

### Key Exports

```ts
import {
  // Location types
  ListLocations,        // 21 list location definitions
  DetailLocations,      // 20 detail location definitions
  ModalLocations,       // Modal location definitions
  BASE_GROUP_ID,        // Navigation group enum

  // Plugin types
  DeenruvUIPlugin,      // Main plugin type
  DeenruvUITable,       // Table extension type
  DeenruvTabs,          // Tab extension type
  DeenruvUIDetailComponent, // Detail component type
  DeenruvUIModalComponent,  // Modal component type
  PluginPage,           // Page definition type
  PluginComponent,      // Generic component type
  PluginNavigationGroup,    // Nav group type
  PluginNavigationLink,     // Nav link type
  NavigationAction,     // Action menu item type
  Widget,               // Dashboard widget type
  Notification,         // Notification type

  // Form types
  GFFLPFormField,       // Form field with value/errors/validatedValue

  // Location key types
  LocationKeys,         // Union of all list location IDs
  DetailKeys,           // Union of all detail location IDs
  ModalLocationsKeys,   // Union of all modal location IDs
} from '@deenruv/react-ui-devkit';
```

## Routes

Type-safe route helpers for navigating to admin panel pages:

```ts
import { Routes, buildURL } from '@deenruv/react-ui-devkit';

// Navigate to product detail
const url = Routes.products.to('product-123');
// => "/admin-ui/products/product-123"

// Available routes:
Routes.dashboard          // /admin-ui
Routes.products.list      // /admin-ui/products
Routes.products.new       // /admin-ui/products/new
Routes.products.route     // /admin-ui/products/:id
Routes.products.to(id)    // /admin-ui/products/{id}
// ...and more for: orders, customers, collections, facets,
//    channels, admins, roles, sellers, promotions, countries,
//    paymentMethods, shippingMethods, taxCategories, taxRates,
//    zones, stockLocations, customerGroups, productVariants, assets
```

## Tailwind v4 CSS-First Configuration

Deenruv uses Tailwind CSS v4 with CSS-first configuration. The theme, design tokens, and content
sources are defined in `@deenruv/admin-dashboard`'s `root.css` using `@theme inline` directives.

**No JS/TS Tailwind config file is needed.** Plugins that consume `@deenruv/admin-dashboard/dist/index.css`
automatically inherit the full theme (colors, radii, animations, dark mode).

If your plugin introduces new Tailwind classes not already scanned, add a `@source` directive
in your app's CSS entry point:

```css
@source "../../node_modules/@deenruv/my-plugin/dist/**/*.js";
```

## Notifications

Plugins can register polling-based notifications:

```ts
import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';

export const MyPlugin = createDeenruvUIPlugin({
  name: 'my-plugin',
  version: '1.0.0',
  notifications: [
    {
      id: 'my-notification',
      fetch: async () => {
        // Fetch notification data
        return { count: 5, items: [...] };
      },
      interval: 30000, // Poll every 30 seconds
      placements: {
        main: (data) => ({
          name: 'my-notification',
          title: 'New Items',
          description: `${data.count} new items`,
          icon: <BellIcon />,
          when: (data) => data.count > 0,
        }),
        navigation: [
          {
            id: 'my-plugin-link',
            component: (data) => <Badge>{data.count}</Badge>,
          },
        ],
      },
    },
  ],
});
```

## Development

### Plugin UI Folder Structure

Follow this convention for plugin UI code (based on existing plugins like `reviews-plugin`, `dashboard-widgets-plugin`, etc.):

```
plugins/my-plugin/
  src/
    plugin-ui/
      index.tsx            # createDeenruvUIPlugin() call + plugin definition
      constants.ts         # Plugin constants (name, namespace, routes)
      tsconfig.json        # TypeScript config for the plugin UI
      components/          # React components
        index.tsx
        MyComponent.tsx
      pages/               # Page components for plugin routes
        MyList.tsx
        MyDetail.tsx
      locales/             # i18n translation files
        en/
          index.ts
          my-plugin.json
        pl/
          index.ts
          my-plugin.json
      graphql/             # GraphQL queries, mutations, selectors
        index.ts
        queries.ts
        mutations.ts
        selectors.ts
        scalars.ts
      zeus/                # Zeus-generated types (if using custom schema)
        index.ts
        const.ts
        typedDocumentNode.ts
```

### Plugin Routes Convention

Define your plugin routes relative to the auto-prefixed base path:

```ts
const PLUGIN_NAME = 'my-plugin-ui';

export const MY_PLUGIN_ROUTES = {
  route: ['/admin-ui', 'extensions', PLUGIN_NAME, ':id'].join('/'),
  new: ['/admin-ui', 'extensions', PLUGIN_NAME, 'new'].join('/'),
  list: ['/admin-ui', 'extensions', PLUGIN_NAME].join('/'),
  to: (id: string) => ['/admin-ui', 'extensions', PLUGIN_NAME, id].join('/'),
};
```

## Important Rules

1. **Never import `react-i18next` directly** — Always use `useTranslation` from `@deenruv/react-ui-devkit`. The hook binds to the global Deenruv i18n instance via `window.__DEENRUV_SETTINGS__.i18n`.

2. **Custom fields are auto-injected** — The `apiClient` automatically adds `customFields` selection to all queries via GraphQL AST manipulation. You don't need to manually request them.

3. **Use location IDs for injection** — Plugin components, tabs, and actions target specific admin views using location ID strings (e.g., `products-detail-view`, `orders-list-view`).

4. **Sidebar injection** — To inject into a detail view sidebar, append `-sidebar` to the location ID and optionally filter by `tab`:
   ```ts
   { id: 'products-detail-view-sidebar', tab: 'product', component: MySidebar }
   ```

5. **Translation namespacing** — Plugin translations use the `ns` field from the `translations` config. Nav link labels are auto-prefixed with `{ns}.{labelId}`.

6. **Page auto-prefixing** — Plugin page paths are auto-prefixed with `admin-ui/extensions/{plugin-name}/`.

## License

MIT
