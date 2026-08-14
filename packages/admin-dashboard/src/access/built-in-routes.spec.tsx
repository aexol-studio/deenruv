import { Permission } from '@deenruv/admin-types';
import { describe, expect, it } from 'vitest';
import { catalogRoutePermissions, settingsRoutePermissions } from './built-in-route-permissions.js';

describe('built-in Catalog and Settings route permissions', () => {
  it('uses Catalog alternatives for representative read and create routes', () => {
    expect(catalogRoutePermissions.products.read).toEqual([Permission.ReadProduct, Permission.ReadCatalog]);
    expect(catalogRoutePermissions.products.create).toEqual([Permission.CreateProduct, Permission.CreateCatalog]);
    expect(catalogRoutePermissions.collections.create).toEqual([Permission.CreateCollection, Permission.CreateCatalog]);
  });

  it.each([
    ['zones', [Permission.ReadZone, Permission.ReadSettings], [Permission.CreateZone, Permission.CreateSettings]],
    [
      'paymentMethods',
      [Permission.ReadPaymentMethod, Permission.ReadSettings],
      [Permission.CreatePaymentMethod, Permission.CreateSettings],
    ],
  ] as const)('uses Settings alternatives for %s', (key, read, create) => {
    expect(settingsRoutePermissions[key].read).toEqual(read);
    expect(settingsRoutePermissions[key].create).toEqual(create);
  });

  it('keeps unsupported channel and stock-location alternatives out of shared permission maps', () => {
    expect('channels' in settingsRoutePermissions).toBe(false);
    expect('stockLocations' in settingsRoutePermissions).toBe(false);
  });
});
