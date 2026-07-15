import { describe, expect, it } from 'vitest';
import {
  getActiveNavigationGroupIds,
  getActiveNavigationLinkIds,
  getNavigationLinkActivePaths,
  insertNavigationLink,
  isNavigationLinkActive,
  matchesNavigationPath,
} from './navigation.js';
import type { AdminRouteDefinition } from './types.js';

describe('admin navigation', () => {
  it('matches static and parameterized route paths without matching sibling paths', () => {
    expect(matchesNavigationPath('/orders', '/orders')).toBe(true);
    expect(matchesNavigationPath('/orders/123', '/orders/:id')).toBe(true);
    expect(matchesNavigationPath('/orders/new', '/orders/:id')).toBe(true);
    expect(matchesNavigationPath('/orders/123/lines', '/orders/:id')).toBe(false);
    expect(matchesNavigationPath('/orders-extra', '/orders')).toBe(false);
  });

  it('keeps a CRUD list link active for its detail and create routes', () => {
    const routes = [
      { id: 'orders.list', path: '/orders' },
      { id: 'orders.detail', path: '/orders/:id' },
      { id: 'orders.create', path: '/orders/new' },
      { id: 'customers.list', path: '/customers' },
    ] as AdminRouteDefinition[];
    const activePaths = getNavigationLinkActivePaths(routes[0], routes);
    const ordersLink = { id: 'orders', href: '/orders', groupId: 'shop-group', activePaths };

    expect(activePaths).toEqual(['/orders', '/orders/new', '/orders/:id']);
    expect(isNavigationLinkActive(ordersLink, '/orders/123')).toBe(true);
    expect(isNavigationLinkActive(ordersLink, '/customers')).toBe(false);
    expect(getActiveNavigationGroupIds([ordersLink], '/orders/new')).toEqual(['shop-group']);

    const dashboardLink = { id: 'dashboard', href: '/', groupId: 'shop-group' };
    expect(getActiveNavigationLinkIds([dashboardLink, ordersLink], '/orders/new').map((link) => link.id)).toEqual([
      'orders',
    ]);
  });

  it('appends plugin links when their requested placement anchor is unavailable', () => {
    const links = [{ id: 'orders' }, { id: 'customers' }];

    expect(insertNavigationLink(links, { id: 'plugin' }, { linkId: 'missing' })).toEqual([
      { id: 'orders' },
      { id: 'customers' },
      { id: 'plugin' },
    ]);
    expect(insertNavigationLink(links, { id: 'plugin' }, { linkId: 'orders', where: 'under' })).toEqual([
      { id: 'orders' },
      { id: 'plugin' },
      { id: 'customers' },
    ]);
  });
});
