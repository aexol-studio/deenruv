# Mini Admin Plan

## Context

The repository already has the core pieces needed for a restricted admin experience:

- `apps/panel` is the concrete Vite application that mounts `DeenruvAdminPanel` from `@deenruv/admin-dashboard`.
- `packages/admin-dashboard` owns the current React admin shell, built-in pages, menu, global search, login screen, notifications, and routing.
- `packages/react-ui-devkit` owns shared routes, state stores, GraphQL client helpers, UI templates, and the UI plugin system.
- `packages/core` is the real security boundary. Admin API resolvers use `@Allow(...)`, roles, permissions, channels, and `RequestContext` to authorize operations.

The mini-admin should therefore be treated as a scoped UX over the existing Admin API security model, not as the primary security layer. Backend roles and permissions must remain the source of truth.

## Current Admin Dashboard Behavior

### Panel Entry Point

- `apps/panel/src/App.tsx` passes `settings` and `plugins` to `<DeenruvAdminPanel />`.
- `apps/panel/src/plugins/enabled.ts` controls which UI plugins are bundled/enabled via `VITE_ADMIN_UI_PLUGINS`.
- This plugin filtering is build/runtime app configuration, not role-based access control.

### Routing

- `packages/admin-dashboard/src/DeenruvAdminPanel.tsx` imports all built-in page exports from `packages/admin-dashboard/src/pages/index.tsx`.
- It derives route paths dynamically from export names and `Routes` from `packages/react-ui-devkit/src/routes.ts`.
- It registers all built-in routes for every logged-in user.
- It also registers all plugin routes from `PluginStore`.
- Result: menu visibility can hide a page, but a user can still deep-link to many hidden routes. The backend may reject API calls, but the UX is not restricted cleanly.

### Menu

- `packages/admin-dashboard/src/components/Menu/Navigation.tsx` defines built-in menu groups and links.
- Most built-in links have `requiredPermissions` and are filtered against `userPermissions`.
- Dashboard has no required permission and is always visible.
- Plugin nav links have no permission metadata today and are always visible when the plugin is active.
- `packages/admin-dashboard/src/components/Menu/index.tsx` exposes additional topbar surfaces without consistent permission filtering, including global search, notifications, system/global-settings quick links, plugin top-nav actions, and the search reindex mutation.

### Global Search

- `packages/admin-dashboard/src/components/GlobalSearch.tsx` builds searchable routes from every entry in `Routes` and every plugin page.
- It does not filter by user permissions or mini-admin scope.
- Result: hidden pages can still be discovered and opened through search.

### Bootstrap Data

- `packages/admin-dashboard/src/pages/Root.tsx` initializes schema, active administrator, permissions, channels, global settings, jobs, status polling, and some auxiliary data.
- It flattens all role permissions into one `userPermissions` array.
- It conditionally loads some data based on broad permission checks, but still performs work that may be unnecessary for a restricted mini-admin.
- Channel-specific permission differences are still enforced by the backend, but the frontend permission model is not channel-scoped.

### List and Detail Templates

- `packages/react-ui-devkit/src/components/templates/DetailList/DetailList.tsx` hides create/delete affordances based on permissions.
- `packages/react-ui-devkit/src/components/templates/DetailView/DetailView.tsx` hides create/update/delete actions based on permissions.
- These templates do not act as route guards. If a route is mounted, the page can render and then rely on API errors.

### Plugin System

- `packages/react-ui-devkit/src/plugins/types.ts` supports plugin pages, nav links, nav groups, widgets, notifications, top navigation components/actions, table/detail extensions, modals, and translations.
- Plugin pages and nav links do not currently have access metadata such as `requiredPermissions`, `accessProfileIds`, or `hiddenInMiniAdmin`.
- `PluginStore` registers all plugin pages/actions/widgets/notifications for active plugins.

## Main Gaps For Mini Admin

- Routes are mounted globally instead of being filtered before router creation.
- Navigation and route access are defined separately, so they can drift.
- Global search exposes routes outside the visible menu.
- Dashboard, topbar actions, plugin nav links, plugin pages, plugin actions, widgets, and notifications are not consistently access-aware.
- Root bootstrap can fetch data that a restricted UI does not need.
- The persisted settings store uses the fixed key `deenruv-admin-panel-storage`, so a full admin and mini-admin on the same origin could share login/session UI state unless this is intentionally accepted or made configurable.
- Frontend permissions are flattened across roles/channels; this is acceptable for UX hints but should not be treated as security.

## Implementation Options

### Option A: Role-Only Cleanup

Keep the existing full admin, rely on backend roles, and patch the most visible leaks:

- Add permission checks to global search.
- Add permission checks to topbar links/actions.
- Add permission metadata to plugin nav links.
- Add simple route guards around built-in pages.

Pros:

- Smallest immediate diff.
- Uses the existing role/permission model.
- Good enough if mini-admin is only a light cosmetic restriction.

Cons:

- Still keeps route/menu/search metadata spread across many files.
- Hard to maintain as pages/plugins grow.
- Does not give us a clear product-level mini-admin profile.
- Easy to reintroduce access leaks in new pages.

### Option B: Access Profile Inside Existing Admin Dashboard

Add a central frontend access model to `admin-dashboard` and use it to filter routes, menu, search, topbar surfaces, notifications, widgets, and plugin extensions.

Pros:

- Keeps one admin dashboard package.
- Gives a clear, reusable way to define `full-admin`, `mini-admin`, and future profiles.
- Minimizes duplicated access logic.
- Lets `apps/panel` choose the profile without forking all UI code.
- Still uses backend roles and permissions as the real security layer.

Cons:

- Requires a small architectural refactor around route registration.
- Requires plugin API additions for access metadata.
- Requires tests around filtering behavior.

### Option C: Separate Mini Admin App/Package

Build a separate app or package that imports only selected pages/components from `admin-dashboard` and `react-ui-devkit`.

Pros:

- Strongest UI isolation.
- Useful if mini-admin becomes a materially different product.
- Can have separate branding, base path, storage key, and deployment.

Cons:

- More duplicated app shell work.
- Harder to reuse current pages because many assume the full admin context.
- Higher maintenance cost.
- Still needs most of the access metadata work if plugins/pages should be shared safely.

## Recommendation

Use Option B first: introduce a central access profile and route registry inside `packages/admin-dashboard`, with small supporting type changes in `packages/react-ui-devkit` for plugins.

This is the best fit for the current codebase because the full admin already exists, most pages already use backend permissions for actions, and the main problem is inconsistent UI surface filtering. A separate mini-admin app can be added later by mounting the same `DeenruvAdminPanel` with a different access profile.

## Proposed Architecture

### 1. Add Admin Access Profile Types

Create access types in `packages/admin-dashboard/src/access/types.ts` or move shared plugin-facing types to `packages/react-ui-devkit` if plugin packages need to import them.

Suggested shape:

```ts
export type PermissionMatchMode = 'any' | 'all';

export type AdminRouteId =
  | 'dashboard'
  | 'orders.list'
  | 'orders.detail'
  | 'orders.create'
  | 'customers.list'
  | 'customers.detail'
  | 'products.list'
  | 'products.detail'
  | 'settings.global'
  | 'system.status'
  | string;

export type AdminAccessRequirement = {
  requiredPermissions?: Permission[];
  permissionMatch?: PermissionMatchMode;
  profileIds?: string[];
};

export type AdminAccessProfile = {
  id: string;
  mode?: 'full' | 'restricted';
  allowedRouteIds?: AdminRouteId[];
  deniedRouteIds?: AdminRouteId[];
  defaultRouteId?: AdminRouteId;
  plugins?: {
    enabledIds?: string[];
    disabledIds?: string[];
  };
  surfaces?: {
    globalSearch?: boolean;
    notifications?: boolean;
    systemStatus?: boolean;
    extensionsPage?: boolean;
    channelSwitcher?: boolean | 'auto';
    languageSwitcher?: boolean;
    reindexAction?: boolean;
  };
};
```

The exact `AdminRouteId` union should be refined while implementing the route registry. It can start as `string` internally, then become stricter once all built-in routes are listed.

### 2. Add Access Evaluation Helper

Create one helper that every surface uses:

```ts
export function canAccessAdminItem(input: {
  item: AdminAccessRequirement & { id?: string };
  profile: AdminAccessProfile;
  userPermissions: Permission[];
}): boolean;
```

Rules:

- `full` mode allows everything except explicit `deniedRouteIds`.
- `restricted` mode allows only explicit `allowedRouteIds`, plus items with matching `profileIds` if we choose to support profile labels.
- `requiredPermissions` are checked against `userPermissions` for UX filtering.
- Permission checks must use the same OR semantics as the backend `@Allow(...)` by default.
- Use `permissionMatch: 'all'` only for cases that truly need all listed permissions.
- This helper is not a security boundary. Backend `@Allow(...)` remains authoritative.

### 3. Replace Dynamic Built-In Route Discovery With Route Definitions

Current route discovery in `DeenruvAdminPanel.tsx` is clever but hides metadata. Replace it with an explicit registry, for example `packages/admin-dashboard/src/access/built-in-routes.tsx`:

```tsx
export const builtInAdminRoutes: AdminRouteDefinition[] = [
  {
    id: 'orders.list',
    path: Routes.orders.list,
    element: <OrdersListPage />,
    nav: { groupId: 'shop-group', labelId: 'orders' },
    requiredPermissions: [Permission.ReadOrder],
  },
  {
    id: 'orders.detail',
    path: Routes.orders.route,
    element: <OrdersDetailPage />,
    requiredPermissions: [Permission.ReadOrder],
  },
  {
    id: 'orders.create',
    path: Routes.orders.new,
    element: <OrdersDetailPage />,
    requiredPermissions: [Permission.CreateOrder],
  },
];
```

This registry should include:

- Route id.
- Path.
- React element.
- Required read/create permission for opening the route.
- Optional nav group/link metadata.
- Optional search metadata.
- Optional topbar/notification/surface metadata if needed.

The registry becomes the single source for route registration, navigation, and search visibility.

### 4. Filter Router Children Before Router Creation

In `packages/admin-dashboard/src/DeenruvAdminPanel.tsx`:

- Accept an optional `accessProfile` prop or `settings.ui.accessProfile`.
- Default to a full-admin profile for backward compatibility.
- Build `allowedBuiltInRoutes` from `builtInAdminRoutes` using `canAccessAdminItem`.
- Build `allowedPluginRoutes` from plugin route metadata using the same helper.
- Pass only allowed routes into `createBrowserRouter`.
- Set index/default redirect to `accessProfile.defaultRouteId` or the first allowed navigable route.
- Pass allowed path list into `Root`.

Result:

- Hidden routes are not mounted.
- Deep links to disallowed routes land on a 404/access-denied route instead of rendering a page that then fails at API level.

### 5. Move Navigation To The Same Registry

In `packages/admin-dashboard/src/components/Menu/Navigation.tsx`:

- Stop hardcoding a second copy of route permissions.
- Build nav groups from the filtered route registry.
- Keep existing labels and grouping, but define them in route metadata or a nearby nav registry.
- Filter plugin nav links through access metadata.

This removes drift between registered routes and visible menu links.

### 6. Filter Global Search Through The Same Registry

In `packages/admin-dashboard/src/components/GlobalSearch.tsx`:

- Use allowed route definitions instead of raw `Routes`.
- Include plugin pages only if their plugin route definition is allowed.
- Disable the whole search surface if `accessProfile.surfaces.globalSearch === false`.

### 7. Make Topbar Surfaces Access-Aware

In `packages/admin-dashboard/src/components/Menu/index.tsx`:

- Brand logo should navigate to the profile default route, not always `Routes.dashboard`.
- Hide system status and global settings quick links unless the route is allowed.
- Hide or guard the reindex action unless the user has `Permission.UpdateCatalog` or `Permission.UpdateProduct` and the profile allows that action.
- Hide plugin top navigation actions/components unless their access metadata passes.
- Keep logout always available.
- Make `ChannelSwitcher`, `LanguagesDropdown`, notifications, and global search respect `accessProfile.surfaces`.

### 8. Add Plugin Access Metadata

Extend plugin types in `packages/react-ui-devkit/src/plugins/types.ts`:

```ts
export type PluginAccessMetadata = {
  requiredPermissions?: Permission[];
  permissionMatch?: 'any' | 'all';
  accessProfileIds?: string[];
};

export type PluginNavigationLink = {
  id: string;
  labelId: string;
  href: string;
  groupId: string;
  icon?: React.ComponentType;
  placement?: 'before' | 'after';
  access?: PluginAccessMetadata;
};

export type PluginPage = {
  path: string;
  element: React.ReactNode;
  access?: PluginAccessMetadata;
};
```

Apply equivalent optional `access` fields to plugin notifications, top navigation actions/components, widgets, and possibly table/detail extensions if they can expose privileged actions.

This can be backward-compatible because `access` is optional. Existing plugins behave as full-admin unless the active access profile filters plugin ids or the plugin opts into access metadata.

### 9. Filter Root Bootstrap Work

In `packages/admin-dashboard/src/pages/Root.tsx`:

- Keep fetching active administrator and permissions first.
- Keep schema/global settings only if still required by dynamic custom fields and shared UI.
- Fetch channels only if the user/profile needs channel switching or channel context.
- Fetch job queues only when system status/jobs are accessible.
- Fetch countries/payment methods/fulfillment handlers only when allowed routes/features need them.
- Register built-in notifications only if profile and permissions allow them.

This avoids noisy unauthorized API errors and reduces work for restricted users.

### 10. Separate Session State If Needed

If full admin and mini-admin are served from the same origin and must not share UI login state, add a configurable storage key to `packages/react-ui-devkit/src/state/settings.ts`.

Possible setting:

```ts
api: {
  uri: string;
  channelTokenName?: string;
  authTokenName?: string;
};
ui?: {
  storageKey?: string;
};
```

If they can share the same browser session intentionally, this can be deferred.

## Suggested First Mini Admin Profile

The exact scope will be decided later, but the first profile can look like this:

```ts
export const miniAdminAccessProfile: AdminAccessProfile = {
  id: 'mini-admin',
  mode: 'restricted',
  allowedRouteIds: [
    'orders.list',
    'orders.detail',
    'customers.list',
    'customers.detail',
  ],
  defaultRouteId: 'orders.list',
  plugins: {
    enabledIds: [],
  },
  surfaces: {
    globalSearch: true,
    notifications: true,
    systemStatus: false,
    extensionsPage: false,
    channelSwitcher: 'auto',
    languageSwitcher: true,
    reindexAction: false,
  },
};
```

The corresponding backend role should contain only the required read/update/create/delete permissions for this business scope. For example, an order-support mini-admin role may need `ReadOrder`, `UpdateOrder`, `ReadCustomer`, and selected catalog read permissions if order detail pages need product data.

## Role And Admin Provisioning UI

The current admin dashboard already has partial support for this:

- `packages/admin-dashboard/src/pages/roles/Detail.tsx` creates and updates roles through `createRole` and `updateRole`.
- `packages/admin-dashboard/src/pages/roles/_components/RoleDetailView.tsx` renders role fields: `code`, `description`, `channelIds`, and `permissions`.
- `packages/admin-dashboard/src/pages/roles/_components/PermissionsTable.tsx` renders permissions from `serverConfig.permissions` and lets the user toggle permissions in a checkbox-like table.
- `packages/admin-dashboard/src/pages/admins/Detail.tsx` creates and updates administrators through `createAdministrator` and `updateAdministrator`.
- `packages/admin-dashboard/src/pages/admins/_components/RolesCard.tsx` lets the user select existing roles and shows the resulting permissions read-only using the same `PermissionsTable`.

What is missing for the mini-admin/business flow:

- There is no single wizard that creates a new administrator and a new role in one flow.
- The admin create form only selects existing roles by `roleIds`; it does not let the user choose permissions directly and create a matching role automatically.
- There are no business presets such as `shop-manager`, `order-support`, or `catalog-editor` that preselect a safe permission set.
- The existing role permission table is functional, but it is raw/technical. It shows backend permission names rather than business-level grouped choices.

Recommended provisioning flow:

1. Add an admin provisioning wizard for restricted/admin-manager use cases.
2. Step one: choose a business preset, for example `shop-manager`.
3. Step two: select channels.
4. Step three: review/tweak permissions in grouped checkboxes.
5. Step four: enter administrator details: first name, last name, email, password.
6. On submit, create or reuse the role, then create the administrator with that role id.

Suggested mutation sequence:

1. Query existing roles by code, for example `shop-manager`.
2. If missing, call `createRole(input: { code, description, channelIds, permissions })`.
3. If present and the user explicitly chose to update it, call `updateRole`.
4. Call `createAdministrator(input: { firstName, lastName, emailAddress, password, roleIds: [roleId] })`.

Important backend constraints still apply:

- The active admin must have `CreateAdministrator` to create both roles and administrators in the current backend model.
- The active admin can only grant permissions they already have on the target channels.
- `SuperAdmin`, `Owner`, and `Public` must not be offered as selectable permissions in this wizard.
- The wizard should use `serverConfig.permissions` as the source of assignable permission metadata, not a hardcoded enum list.

This is not required for route-level mini-admin filtering, but it is required for a complete operational workflow: create a business role and immediately create an administrator assigned to it.

## Implementation Phases

### Phase 1: Access Model And Route Registry

- Add `AdminAccessProfile`, `AdminRouteDefinition`, and `canAccessAdminItem`.
- Convert built-in routes from dynamic discovery to explicit route definitions.
- Preserve current full-admin behavior with a default full profile.
- Add unit tests for access helper behavior.

### Phase 2: Router, Navigation, Search

- Filter router children before `createBrowserRouter`.
- Build navigation from allowed route definitions.
- Filter global search with the same definitions.
- Add an access-denied or not-found fallback for disallowed deep links.
- Ensure brand logo/default redirects use the profile default route.

### Phase 3: Topbar, Notifications, Root Bootstrap

- Gate topbar quick links, reindex action, global search trigger, notifications, and plugin topbar actions.
- Make Root bootstrap conditional enough to avoid avoidable unauthorized calls.
- Make built-in notifications access-aware.

### Phase 4: Plugin Metadata

- Add optional `access` metadata to plugin nav links, pages, notifications, widgets, and topbar actions/components.
- Filter plugin surfaces in `PluginStore` or in a derived access-aware view of the plugin store.
- Update at least one official plugin as an example.

### Phase 5: Admin Provisioning Wizard

- Keep the existing role and admin detail pages for advanced/full-admin usage.
- Add a guided flow for creating a business role and administrator together.
- Add business presets such as `shop-manager` with preselected permission sets.
- Reuse `PermissionsTable` or replace it with a more business-friendly grouped permission selector.
- Exclude non-assignable/internal permissions such as `SuperAdmin`, `Owner`, and `Public`.
- Create or reuse the selected role before calling `createAdministrator`.

### Phase 6: App-Level Mini Admin Configuration

- Add a mini-admin profile in `apps/panel` or a separate `apps/mini-panel` if deployment separation is required.
- Wire environment/config selection, for example `VITE_ADMIN_ACCESS_PROFILE=mini-admin`.
- Optionally give mini-admin a different base path, branding, plugin list, and storage key.

### Phase 7: Tests And Verification

- Unit-test access helper and route filtering.
- Component-test navigation/search filtering if the project has suitable React test setup.
- Test the admin provisioning wizard mutation sequence and validation.
- Run TypeScript build for `@deenruv/admin-dashboard` and `@deenruv/react-ui-devkit`.
- Manually verify with a restricted backend role that hidden routes are not mounted and direct URLs do not expose pages.
- Verify API still rejects unauthorized operations even if a route/action is forced manually.

## Files Likely To Change

- `packages/admin-dashboard/src/DeenruvAdminPanel.tsx`
- `packages/admin-dashboard/src/root.d.ts`
- `packages/admin-dashboard/src/pages/Root.tsx`
- `packages/admin-dashboard/src/pages/index.tsx`
- `packages/admin-dashboard/src/components/Menu/Navigation.tsx`
- `packages/admin-dashboard/src/components/Menu/index.tsx`
- `packages/admin-dashboard/src/components/GlobalSearch.tsx`
- `packages/admin-dashboard/src/components/Menu/NavigationFooter.tsx`
- `packages/admin-dashboard/src/components/Menu/Notifications.tsx`
- `packages/admin-dashboard/src/pages/admins/Detail.tsx`
- `packages/admin-dashboard/src/pages/admins/_components/AdminDetailView.tsx`
- `packages/admin-dashboard/src/pages/admins/_components/RolesCard.tsx`
- `packages/admin-dashboard/src/pages/roles/Detail.tsx`
- `packages/admin-dashboard/src/pages/roles/_components/RoleDetailView.tsx`
- `packages/admin-dashboard/src/pages/roles/_components/PermissionsTable.tsx`
- `packages/react-ui-devkit/src/DeenruvAdminPanelSettingsTypes.ts`
- `packages/react-ui-devkit/src/plugins/types.ts`
- `packages/react-ui-devkit/src/plugins/plugin-store.ts`
- `packages/react-ui-devkit/src/plugins/plugin-context.tsx`
- `packages/react-ui-devkit/src/state/settings.ts` if separate storage keys are needed
- `apps/panel/src/App.tsx`
- `apps/panel/src/plugins/enabled.ts` if profile-specific plugin enabling is needed

New files likely to add:

- `packages/admin-dashboard/src/access/types.ts`
- `packages/admin-dashboard/src/access/access-profile.ts`
- `packages/admin-dashboard/src/access/built-in-routes.tsx`
- `packages/admin-dashboard/src/access/access-context.tsx`
- `packages/admin-dashboard/src/access/can-access-admin-item.spec.ts`
- `packages/admin-dashboard/src/pages/admins/provisioning/AdminProvisioningPage.tsx`
- `packages/admin-dashboard/src/pages/admins/provisioning/admin-presets.ts`

## Acceptance Criteria

- Full admin behaves the same when no access profile is provided.
- Mini-admin mounts only allowed routes.
- Hidden mini-admin routes are not visible in menu or global search.
- Direct URL access to a disallowed route does not render the page.
- Topbar quick links/actions do not point to disallowed pages or unauthorized mutations.
- Plugin pages/nav/actions/widgets/notifications can be hidden by profile and permissions.
- Backend roles and `@Allow(...)` remain the final security boundary.
- Restricted users do not see avoidable authorization error toasts during initial load.
- The implementation supports future profiles without copying the whole admin app.
- Full admins can create a `shop-manager` style administrator from a guided UI flow without manually visiting separate role and admin pages.

## Open Decisions

- Which exact mini-admin persona is first: order support, merchant/seller, warehouse, content/catalog editor, or another role?
- Should mini-admin be the same `apps/panel` deployment with a different profile, or a separate `apps/mini-panel` with its own base path and branding?
- Should full admin and mini-admin share browser login state, or should the storage key/token names be separated?
- Should route permissions be checked globally across all roles, as today, or should the frontend become selected-channel-aware?
- Which plugin surfaces must be supported in the first version?
- Should the role/admin provisioning wizard create a new role every time, reuse an existing role by code, or let the user choose either behavior?
- Should business presets be hardcoded in `admin-dashboard`, provided by app settings, or supplied by plugins?
