import { Permission } from '@deenruv/admin-types';
import { describe, expect, it } from 'vitest';
import { canAccessAdminItem, hasRequiredPermissions } from './permission-access.js';
import { getDefaultAdminRoute, getPermittedAdminRoutes } from './permission-routes.js';
import type { AdminRouteDefinition } from './types.js';

describe('permission-based admin access', () => {
  it('matches any required permission by default and supports all matching', () => {
    expect(
      hasRequiredPermissions({
        requiredPermissions: [Permission.ReadOrder, Permission.ReadCustomer],
        userPermissions: [Permission.ReadOrder],
      }),
    ).toBe(true);
    expect(
      hasRequiredPermissions({
        requiredPermissions: [Permission.ReadOrder, Permission.ReadCustomer],
        permissionMatch: 'all',
        userPermissions: [Permission.ReadOrder],
      }),
    ).toBe(false);
  });

  it('filters routes from the authenticated administrator permissions only', () => {
    const routes = [
      { id: 'dashboard', path: '/dashboard', element: null },
      { id: 'orders', path: '/orders', element: null, requiredPermissions: [Permission.ReadOrder] },
      { id: 'admins', path: '/administrators', element: null, requiredPermissions: [Permission.ReadAdministrator] },
    ] as unknown as AdminRouteDefinition[];

    const permittedRoutes = getPermittedAdminRoutes(routes, [Permission.ReadOrder]);

    expect(permittedRoutes.map((route) => route.id)).toEqual(['dashboard', 'orders']);
    expect(getDefaultAdminRoute(permittedRoutes)?.id).toBe('dashboard');
    expect(canAccessAdminItem({ item: routes[2], userPermissions: [Permission.ReadOrder] })).toBe(false);
  });
});
