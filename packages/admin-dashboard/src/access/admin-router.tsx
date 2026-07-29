import type { ReactElement } from 'react';
import { Routes } from '@deenruv/react-ui-devkit';
import { Navigate, type RouteObject } from 'react-router';
import type { AdminRouteDefinition } from './types.js';

type CreateAdminRouterRoutesInput = {
  permittedRoutes: AdminRouteDefinition[];
  defaultRoute?: AdminRouteDefinition;
  rootElement: ReactElement;
  errorElement: ReactElement;
};

export const createAdminRouterRoutes = ({
  permittedRoutes,
  defaultRoute,
  rootElement,
  errorElement,
}: CreateAdminRouterRoutesInput): RouteObject[] => {
  const children: RouteObject[] = permittedRoutes.map(({ id, path, element }) => ({ id, path, element }));

  if (defaultRoute && !permittedRoutes.some((route) => route.path === Routes.dashboard)) {
    children.push({
      id: 'admin.fallback.dashboard',
      path: Routes.dashboard,
      element: <Navigate to={defaultRoute.path} replace />,
    });
  }
  if (defaultRoute) {
    children.push({
      id: 'admin.fallback.wildcard',
      path: '*',
      element: <Navigate to={defaultRoute.path} replace />,
    });
  }

  return [{ id: 'admin.root', element: rootElement, errorElement, children }];
};
