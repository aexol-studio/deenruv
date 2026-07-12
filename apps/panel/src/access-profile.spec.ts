import {
  FULL_ADMIN_ACCESS_PROFILE,
  MINI_ADMIN_ACCESS_PROFILE,
  SHOP_MANAGER_ACCESS_PROFILE,
} from '@deenruv/admin-dashboard';
import { describe, expect, it, vi } from 'vitest';

import { resolveAdminAccessProfile } from './access-profile';

describe('resolveAdminAccessProfile', () => {
  it('defaults to full admin when env is missing or empty', () => {
    expect(resolveAdminAccessProfile(undefined)).toBe(FULL_ADMIN_ACCESS_PROFILE);
    expect(resolveAdminAccessProfile('')).toBe(FULL_ADMIN_ACCESS_PROFILE);
    expect(resolveAdminAccessProfile('   ')).toBe(FULL_ADMIN_ACCESS_PROFILE);
  });

  it('resolves known profile ids', () => {
    expect(resolveAdminAccessProfile('full-admin')).toBe(FULL_ADMIN_ACCESS_PROFILE);
    expect(resolveAdminAccessProfile('full')).toBe(FULL_ADMIN_ACCESS_PROFILE);
    expect(resolveAdminAccessProfile('mini-admin')).toBe(MINI_ADMIN_ACCESS_PROFILE);
    expect(resolveAdminAccessProfile('shop-manager')).toBe(SHOP_MANAGER_ACCESS_PROFILE);
  });

  it('trims the env value before resolving', () => {
    expect(resolveAdminAccessProfile(' shop-manager ')).toBe(SHOP_MANAGER_ACCESS_PROFILE);
  });

  it('warns and falls back to full admin for unknown profile ids', () => {
    const warn = vi.fn();

    expect(resolveAdminAccessProfile('unknown-profile', warn)).toBe(FULL_ADMIN_ACCESS_PROFILE);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('Unknown VITE_ADMIN_ACCESS_PROFILE: unknown-profile');
    expect(warn.mock.calls[0][0]).toContain('shop-manager');
  });
});
