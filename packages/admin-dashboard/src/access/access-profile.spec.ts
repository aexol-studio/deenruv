import { Permission } from '@deenruv/admin-types';
import { describe, expect, it } from 'vitest';

import {
  canAccessAdminItem,
  FULL_ADMIN_ACCESS_PROFILE,
  hasRequiredPermissions,
  isAccessSurfaceEnabled,
  isRouteAllowedByProfile,
  MINI_ADMIN_ACCESS_PROFILE,
  normalizeAccessProfile,
  SHOP_MANAGER_ACCESS_PROFILE,
} from './access-profile';

describe('admin access profile', () => {
  it('keeps full admin unrestricted by default', () => {
    const profile = normalizeAccessProfile();

    expect(profile).toEqual(FULL_ADMIN_ACCESS_PROFILE);
    expect(isRouteAllowedByProfile('global-settings.route', profile)).toBe(true);
    expect(isAccessSurfaceEnabled(profile, 'systemStatus')).toBe(true);
  });

  it('defines shop-manager as a restricted operational profile', () => {
    expect(SHOP_MANAGER_ACCESS_PROFILE).toMatchObject({
      id: 'shop-manager',
      mode: 'restricted',
      defaultRouteId: 'orders.list',
      plugins: { enabledIds: [] },
    });

    expect(SHOP_MANAGER_ACCESS_PROFILE.allowedRouteIds).toEqual(
      expect.arrayContaining([
        'orders.list',
        'orders.detail',
        'customers.list',
        'products.list',
        'assets.list',
        'paymentMethods.list',
        'shippingMethods.list',
        'stockLocations.list',
        'countries.list',
      ]),
    );
    expect(SHOP_MANAGER_ACCESS_PROFILE.allowedRouteIds).not.toEqual(
      expect.arrayContaining([
        'dashboard',
        'admins.list',
        'roles.list',
        'settings.global',
        'system.status',
        'extensions',
      ]),
    );
  });

  it('uses the same route set for mini-admin alias', () => {
    expect(MINI_ADMIN_ACCESS_PROFILE.id).toBe('mini-admin');
    expect(MINI_ADMIN_ACCESS_PROFILE.allowedRouteIds).toBe(SHOP_MANAGER_ACCESS_PROFILE.allowedRouteIds);
  });

  it('allows only explicitly listed routes for restricted profiles', () => {
    expect(isRouteAllowedByProfile('orders.list', SHOP_MANAGER_ACCESS_PROFILE)).toBe(true);
    expect(isRouteAllowedByProfile('settings.global', SHOP_MANAGER_ACCESS_PROFILE)).toBe(false);
    expect(isRouteAllowedByProfile('admins.provision', SHOP_MANAGER_ACCESS_PROFILE)).toBe(false);
  });

  it('lets denied routes override full access', () => {
    const profile = normalizeAccessProfile({ deniedRouteIds: ['orders.list'] });

    expect(isRouteAllowedByProfile('orders.list', profile)).toBe(false);
    expect(isRouteAllowedByProfile('orders.detail', profile)).toBe(true);
  });

  it('checks required permissions with any and all semantics', () => {
    const userPermissions = [Permission.ReadOrder, Permission.UpdateOrder];

    expect(
      hasRequiredPermissions({
        requiredPermissions: [Permission.ReadOrder, Permission.ReadCustomer],
        userPermissions,
      }),
    ).toBe(true);
    expect(
      hasRequiredPermissions({
        requiredPermissions: [Permission.ReadOrder, Permission.ReadCustomer],
        permissionMatch: 'all',
        userPermissions,
      }),
    ).toBe(false);
    expect(
      hasRequiredPermissions({
        requiredPermissions: [Permission.ReadOrder, Permission.UpdateOrder],
        permissionMatch: 'all',
        userPermissions,
      }),
    ).toBe(true);
  });

  it('combines route profile filtering with permission checks', () => {
    expect(
      canAccessAdminItem({
        item: { requiredPermissions: [Permission.ReadOrder] },
        profile: SHOP_MANAGER_ACCESS_PROFILE,
        routeId: 'orders.list',
        userPermissions: [Permission.ReadOrder],
      }),
    ).toBe(true);
    expect(
      canAccessAdminItem({
        item: { requiredPermissions: [Permission.ReadSettings] },
        profile: SHOP_MANAGER_ACCESS_PROFILE,
        routeId: 'settings.global',
        userPermissions: [Permission.ReadSettings],
      }),
    ).toBe(false);
  });

  it('turns off admin-only surfaces for shop-manager', () => {
    expect(isAccessSurfaceEnabled(SHOP_MANAGER_ACCESS_PROFILE, 'globalSearch')).toBe(true);
    expect(isAccessSurfaceEnabled(SHOP_MANAGER_ACCESS_PROFILE, 'notifications')).toBe(true);
    expect(isAccessSurfaceEnabled(SHOP_MANAGER_ACCESS_PROFILE, 'systemStatus')).toBe(false);
    expect(isAccessSurfaceEnabled(SHOP_MANAGER_ACCESS_PROFILE, 'extensionsPage')).toBe(false);
    expect(isAccessSurfaceEnabled(SHOP_MANAGER_ACCESS_PROFILE, 'reindexAction')).toBe(false);
  });
});
