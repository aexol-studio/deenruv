import type { Permission } from '@deenruv/admin-types';
import type { AdminRouteDefinition } from './types.js';
import { canAccessAdminItem } from './permission-access.js';

export const getPermittedAdminRoutes = (routes: AdminRouteDefinition[], userPermissions: Permission[]) =>
  routes.filter((route) => canAccessAdminItem({ item: route, userPermissions }));

export const getDefaultAdminRoute = (routes: AdminRouteDefinition[]) =>
  routes.find((route) => route.id === 'dashboard') || routes.find((route) => route.nav) || routes[0];
