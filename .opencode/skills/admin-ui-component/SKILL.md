---
name: admin-ui-component
description: Build admin UI components and pages using @deenruv/react-ui-devkit (shadcn/Tailwind-based)
---

# Admin UI Component Development

Use this skill when building React components for the Deenruv admin panel using `@deenruv/react-ui-devkit`.

## When to Apply

- Creating admin UI components or pages for a plugin
- Adding dashboard widgets, detail view tabs, or list table columns
- Building custom field inputs
- Extending existing admin views (sidebars, detail panels, modals)

## Architecture

Plugin UI code lives in `plugins/<name>-plugin/src/plugin-ui/`. Each plugin registers extensions via `createDeenruvUIPlugin()` exported from its `plugin-ui/index.tsx`.

**All UI imports come from `@deenruv/react-ui-devkit`** — never import raw shadcn components or `react-i18next` directly.

## Available Atom Components (Shadcn/Radix-based)

Accordion, AspectRatio, Badge, Breadcrumb, Button, Calendar, Card (Card, CardContent, CardHeader, CardTitle, CardDescription), Command, Checkbox, Dialog, DropdownMenu, Form, HoverCard, Input, Label, Pagination, Popover, ScrollArea, Select, Sheet, Switch, Table, Tabs (Tabs, TabsContent, TabsList, TabsTrigger), Textarea, Timeline, Tooltip, Sonner (toasts), AlertDialog, Toggle, ToggleGroup, Skeleton, Chart, Spinner, ImagePlaceholder, AssetUploadButton, RadioGroup, Separator, MultipleSelector, Drawer, LanguagePicker, FacetedFilter, Progress

## Available Molecule Components

PaymentMethodImage, OrderStateBadge, SimpleSelect, SimpleTooltip, SortButton, TranslationSelect, ListTable, SearchInput, CustomFieldsModal, ImageWithPreview, ErrorMessage, ListBadge, ContextMenu

## Available Template Components

DetailList, DetailView

## Available Core Components

DetailViewMarker, ListViewMarker, Renderer, EntityCustomFields

## Available Universal Components

PageBlock, DateTimeInput, SimpleTimePicker, DraggableSelect, FacetIdsSelector, CustomCardHeader, CustomCard, EmptyState, DateTimePicker, CustomerSearch, DialogProductPicker, RichTextEditor, ConfirmationDialog, AssetsModalInput, EntityChannelManager

## Hooks

| Hook | Purpose |
|------|---------|
| `useTranslation(ns)` | i18n — NEVER import from `react-i18next` |
| `useQuery(query, opts)` | Fetch GraphQL data (Zeus-based) |
| `useLazyQuery(query)` | Lazy GraphQL query |
| `useMutation(mutation)` | Execute GraphQL mutation |
| `useLocalStorage(key, default)` | Persistent local state |
| `useDebounce(value, delay)` | Debounced value |
| `useGFFLP()` | Form field label/placeholder helpers |
| `useRouteGuard()` | Unsaved changes guard |
| `useAssets()` | Asset management |
| `useErrorHandler()` | Error handling |
| `useValidators()` | Form validation |
| `useList()` | Paginated list management |
| `useCustomFields()` | Custom field input state (value, setValue, label, description) |

## Zustand Stores

`useSettings`, `useGlobalState`, `useServerState`, `useGuardState`, `useOrderState`, `useGlobalSearch`

## BASE_GROUP_ID (Navigation Placement)

| Enum Value | ID String | Area |
|------------|-----------|------|
| `BASE_GROUP_ID.SHOP` | `shop-group` | Shop |
| `BASE_GROUP_ID.ASSORTMENT` | `assortment-group` | Products, Collections, Facets |
| `BASE_GROUP_ID.USERS` | `users-group` | Customers, Admins |
| `BASE_GROUP_ID.PROMOTIONS` | `promotions-group` | Promotions |
| `BASE_GROUP_ID.SHIPPING` | `shipping-group` | Shipping, Payment methods |
| `BASE_GROUP_ID.SETTINGS` | `settings-group` | Settings area |

## Detail View Location IDs (for `components` and `tabs`)

`products-detail-view`, `orders-detail-view`, `customers-detail-view`, `collections-detail-view`, `facets-detail-view`, `promotions-detail-view`, `channels-detail-view`, `admins-detail-view`, `roles-detail-view`, `sellers-detail-view`, `zones-detail-view`, `countries-detail-view`, `taxRates-detail-view`, `taxCategories-detail-view`, `shippingMethods-detail-view`, `paymentMethods-detail-view`, `customerGroups-detail-view`, `stockLocations-detail-view`, `globalSettings-detail-view`, `orders-summary`

Append `-sidebar` to inject into the sidebar area (e.g. `products-detail-view-sidebar`).

## Example: Plugin Page with List

```tsx
// plugin-ui/components/FeaturePage.tsx
import React from 'react';
import { Card, CardContent, CardHeader, Button, Badge, Spinner, useTranslation, useQuery } from '@deenruv/react-ui-devkit';
import { translationNS } from '../translation-ns';
import { FeaturesQuery } from '../graphql/queries';

export const FeaturePage = () => {
  const { t } = useTranslation(translationNS);
  const { data, loading } = useQuery(FeaturesQuery, { initialVariables: { take: 20 } });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('heading')}</h1>
        <Button>{t('form.create')}</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {/* Use ListTable or DetailList for tabular data */}
        </CardContent>
      </Card>
    </div>
  );
};
```

## Example: Custom Field Input

```tsx
// plugin-ui/components/CustomColorInput.tsx
import React from 'react';
import { Input, Label, useCustomFields, CardDescription } from '@deenruv/react-ui-devkit';

export const CustomColorInput = () => {
  const { setValue, description, label, value } = useCustomFields<string>();
  return (
    <div>
      <Label>{label}</Label>
      <CardDescription>{description}</CardDescription>
      <Input type="color" value={value ?? '#000000'} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};
```

## Example: Plugin Registration (plugin-ui/index.tsx)

```tsx
import React from 'react';
import { BASE_GROUP_ID, createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { SettingsIcon } from 'lucide-react';
import { FeaturePage } from './components/FeaturePage';
import { CustomColorInput } from './components/CustomColorInput';
import { SidebarWidget } from './components/SidebarWidget';
import { translationNS } from './translation-ns';
import en from './locales/en';
import pl from './locales/pl';

export const UIPlugin = createDeenruvUIPlugin({
  version: '1.0.0',
  name: 'Feature Plugin',
  pages: [{ path: 'feature', element: <FeaturePage /> }],
  inputs: [{ id: 'color-custom-field-input', component: CustomColorInput }],
  components: [{ component: SidebarWidget, id: 'products-detail-view-sidebar', tab: 'product' }],
  tabs: [{ id: 'customers-detail-view', name: 'feature', label: 'Feature', component: <FeaturePage /> }],
  widgets: [{ id: 'feature-widget', name: 'Feature', component: <div />, visible: true, size: { width: 6, height: 8 }, sizes: [{ width: 6, height: 8 }] }],
  navMenuGroups: [{ id: 'feature-settings', labelId: 'nav.group', placement: { groupId: BASE_GROUP_ID.SETTINGS } }],
  navMenuLinks: [{ id: 'feature', href: 'feature', labelId: 'nav.link', groupId: 'feature-settings', icon: SettingsIcon }],
  translations: { ns: translationNS, data: { en, pl } },
});
```

## Styling Rules

- Tailwind CSS for all styling — no CSS modules or styled-components
- Spacing: `p-6` for page padding, `space-y-6` for vertical sections
- Wrap content in `Card` / `CardContent`
- Use `Badge` for status indicators, `Spinner` for loading
- Use `toast` from `sonner` for notifications
- Icons from `lucide-react`

## Checklist

- [ ] All imports from `@deenruv/react-ui-devkit` (not raw shadcn)
- [ ] `useTranslation` from devkit (NOT `react-i18next`)
- [ ] User-facing strings use translation keys via `t()`
- [ ] Loading states use `Spinner`
- [ ] Plugin registered via `createDeenruvUIPlugin` in `plugin-ui/index.tsx`
- [ ] Translations provided with `ns` + `data: { en, pl }`
- [ ] Tailwind CSS only — no inline styles or CSS modules
- [ ] Icons from `lucide-react`
