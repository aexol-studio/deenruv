import { isValidElement } from 'react';
import { Permission } from '@deenruv/admin-types';
import { Routes } from '@deenruv/react-ui-devkit';
import { createMemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { createAdminRouterRoutes } from './admin-router.js';
import { getDefaultAdminRoute, getPermittedAdminRoutes } from './permission-routes.js';
import type { AdminRouteDefinition } from './types.js';

const storefrontEditorPath = 'admin-ui/extensions/storefront-modal-plugin/storefront-editor';
const storefrontEditorUrl = `/${storefrontEditorPath}`;
const storefrontEditorRouteId = `plugin.storefront-modal-plugin.${storefrontEditorPath}`;

const CustomerGroupsListPage = () => <div>CustomerGroupsListPage</div>;
const StorefrontEditor = () => <div>Storefront editor</div>;

const dashboardElement = <div>Dashboard</div>;
const customerGroupsListPageElement = <CustomerGroupsListPage />;
const storefrontEditorElement = <StorefrontEditor />;

const customerGroupsRoute: AdminRouteDefinition = {
  id: 'customerGroups.list',
  path: Routes.customerGroups.list,
  element: customerGroupsListPageElement,
  requiredPermissions: [Permission.ReadCustomerGroup],
};
const storefrontEditorRoute: AdminRouteDefinition = {
  id: storefrontEditorRouteId,
  path: storefrontEditorPath,
  element: storefrontEditorElement,
};
const routeDefinitions: AdminRouteDefinition[] = [
  { id: 'dashboard', path: Routes.dashboard, element: dashboardElement },
  customerGroupsRoute,
  storefrontEditorRoute,
];

const createRouterForPermissions = (userPermissions: Permission[]) => {
  const permittedRoutes = getPermittedAdminRoutes(routeDefinitions, userPermissions);
  return createMemoryRouter(
    createAdminRouterRoutes({
      permittedRoutes,
      defaultRoute: getDefaultAdminRoute(permittedRoutes),
      rootElement: <div>Admin root</div>,
      errorElement: <div>Not found</div>,
    }),
    { initialEntries: [storefrontEditorUrl] },
  );
};

const expectRedirectTo = (element: unknown, path: string) => {
  expect(isValidElement<{ replace?: boolean; to: string }>(element)).toBe(true);
  if (isValidElement<{ replace?: boolean; to: string }>(element)) {
    expect(element.props).toMatchObject({ to: path, replace: true });
  }
};

describe('admin router route identity', () => {
  it('keeps the storefront editor deep link owned by its plugin after CustomerGroupsListPage becomes permitted', () => {
    const initialRouter = createRouterForPermissions([]);
    const fullPermissionRouter = createRouterForPermissions([Permission.ReadCustomerGroup]);

    const initialPluginMatch = initialRouter.state.matches.find(
      (match) => match.route.element === storefrontEditorElement,
    );
    const fullPermissionPluginMatch = fullPermissionRouter.state.matches.find(
      (match) => match.route.element === storefrontEditorElement,
    );

    expect(initialRouter.state.location.pathname).toBe(storefrontEditorUrl);
    expect(fullPermissionRouter.state.location.pathname).toBe(storefrontEditorUrl);
    expect(initialPluginMatch?.route.element).toBe(storefrontEditorElement);
    expect(fullPermissionPluginMatch?.route.element).toBe(storefrontEditorElement);
    expect(initialPluginMatch?.route.id).toBe(storefrontEditorRouteId);
    expect(fullPermissionPluginMatch?.route.id).toBe(initialPluginMatch?.route.id);

    const fullRouteWithInitialPluginId = fullPermissionRouter.routes[0].children?.find(
      (route) => route.id === initialPluginMatch?.route.id,
    );
    expect(fullRouteWithInitialPluginId?.element).toBe(storefrontEditorElement);
    expect(fullRouteWithInitialPluginId?.element).not.toBe(customerGroupsListPageElement);
  });

  it('keeps representative built-in, storefront plugin, root, and wildcard IDs globally unique', () => {
    const permittedRoutes = routeDefinitions;
    const defaultRoute = getDefaultAdminRoute(permittedRoutes);
    const [rootRoute] = createAdminRouterRoutes({
      permittedRoutes,
      defaultRoute,
      rootElement: <div>Admin root</div>,
      errorElement: <div>Not found</div>,
    });
    const children = rootRoute.children ?? [];
    const routeIds = [rootRoute.id, ...children.map((route) => route.id)];

    expect(rootRoute.id).toBe('admin.root');
    expect(routeIds.every(Boolean)).toBe(true);
    expect(new Set(routeIds).size).toBe(routeIds.length);
    for (const builtInRoute of [routeDefinitions[0], customerGroupsRoute]) {
      const configuredRoute = children.find((route) => route.id === builtInRoute.id);
      expect(configuredRoute?.path).toBe(builtInRoute.path);
      expect(configuredRoute?.element).toBe(builtInRoute.element);
    }
    expect(children.find((route) => route.id === storefrontEditorRouteId)?.element).toBe(storefrontEditorElement);

    const wildcardFallback = children.find((route) => route.id === 'admin.fallback.wildcard');
    expect(wildcardFallback?.path).toBe('*');
    expectRedirectTo(wildcardFallback?.element, defaultRoute?.path ?? '');
    expect(children.some((route) => route.id === 'admin.fallback.dashboard')).toBe(false);
  });

  it('uses stable dashboard and wildcard fallback config when dashboard is absent', () => {
    const [rootRoute] = createAdminRouterRoutes({
      permittedRoutes: [storefrontEditorRoute],
      defaultRoute: storefrontEditorRoute,
      rootElement: <div>Admin root</div>,
      errorElement: <div>Not found</div>,
    });
    const children = rootRoute.children ?? [];
    const dashboardFallback = children.find((route) => route.id === 'admin.fallback.dashboard');
    const wildcardFallback = children.find((route) => route.id === 'admin.fallback.wildcard');
    const routeIds = [rootRoute.id, ...children.map((route) => route.id)];

    expect(dashboardFallback?.path).toBe(Routes.dashboard);
    expect(wildcardFallback?.path).toBe('*');
    expectRedirectTo(dashboardFallback?.element, storefrontEditorPath);
    expectRedirectTo(wildcardFallback?.element, storefrontEditorPath);
    expect(routeIds.every(Boolean)).toBe(true);
    expect(new Set(routeIds).size).toBe(routeIds.length);
  });
});
