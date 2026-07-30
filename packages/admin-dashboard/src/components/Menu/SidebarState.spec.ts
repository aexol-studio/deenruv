import { describe, expect, it } from 'vitest';

import { mergeOpenGroupIds, parseStoredCollapsed, parseStoredGroupIds } from './SidebarState.js';

describe('sidebar state', () => {
  it('parses only valid persisted collapsed values', () => {
    expect(parseStoredCollapsed('true')).toBe(true);
    expect(parseStoredCollapsed('false', true)).toBe(false);
    expect(parseStoredCollapsed('broken')).toBe(false);
    expect(parseStoredCollapsed(null, true)).toBe(true);
  });

  it('defensively parses and de-duplicates persisted group ids', () => {
    expect(parseStoredGroupIds('["shop-group","settings-group","shop-group",2]')).toEqual([
      'shop-group',
      'settings-group',
    ]);
    expect(parseStoredGroupIds('{broken')).toEqual([]);
    expect(parseStoredGroupIds('{"id":"shop-group"}')).toEqual([]);
  });

  it('forces active groups open without losing manually open groups', () => {
    expect(mergeOpenGroupIds(['settings-group'], ['shop-group', 'settings-group'])).toEqual([
      'settings-group',
      'shop-group',
    ]);
  });

  it('keeps group state stable when the same persisted state is shared by multiple navigation views', () => {
    const manuallyOpen = parseStoredGroupIds('["settings-group"]');

    expect(mergeOpenGroupIds(manuallyOpen, ['shop-group'])).toEqual(['settings-group', 'shop-group']);
    expect(mergeOpenGroupIds(manuallyOpen, ['users-group'])).toEqual(['settings-group', 'users-group']);
  });
});
