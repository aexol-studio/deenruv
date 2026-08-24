import { describe, expect, it } from 'vitest';

import { buildMenuBreadcrumbs } from './Breadcrumbs.js';

describe('menu breadcrumbs', () => {
  const groups = [{ id: 'shop', label: 'Sklep', permitted: true }];
  const links = [
    {
      href: 'admin-ui/extensions/alur/menu',
      groupId: 'shop',
      label: 'Menu',
      permitted: true,
    },
  ];

  it('uses translated plugin navigation metadata without linking the group', () => {
    expect(
      buildMenuBreadcrumbs({
        pathname: '/admin-ui/extensions/alur/menu',
        groups,
        links,
        extensions: { label: 'Rozszerzenia', href: '/admin-ui/extensions', permitted: true },
        fallbackLabels: [],
      }),
    ).toEqual([
      { label: 'Rozszerzenia', href: '/admin-ui/extensions', current: false },
      { label: 'Sklep', current: false },
      { label: 'Menu', current: true },
    ]);
  });

  it('omits an unpermitted extensions link while retaining current-page semantics', () => {
    expect(
      buildMenuBreadcrumbs({
        pathname: '/admin-ui/extensions/alur/menu',
        groups,
        links,
        extensions: { label: 'Extensions', href: '/admin-ui/extensions', permitted: false },
        fallbackLabels: [],
      }),
    ).toEqual([
      { label: 'Sklep', current: false },
      { label: 'Menu', current: true },
    ]);
  });

  it('never makes synthesized or unpermitted fallback prefixes clickable', () => {
    const breadcrumbs = buildMenuBreadcrumbs({
      pathname: '/admin-ui/extensions/private-plugin/settings',
      groups,
      links: links.map((link) => ({ ...link, permitted: false })),
      extensions: { label: 'Extensions', href: '/admin-ui/extensions', permitted: true },
      fallbackLabels: ['Admin UI', 'Extensions', 'Private plugin', 'Settings'],
    });

    expect(breadcrumbs.every((breadcrumb) => breadcrumb.href === undefined)).toBe(true);
    expect(breadcrumbs.at(-1)).toEqual({ label: 'Settings', current: true });
  });
});
