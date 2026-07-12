import {
  FULL_ADMIN_ACCESS_PROFILE,
  MINI_ADMIN_ACCESS_PROFILE,
  SHOP_MANAGER_ACCESS_PROFILE,
  type AdminAccessProfile,
} from '@deenruv/admin-dashboard';

const accessProfiles = {
  'full-admin': FULL_ADMIN_ACCESS_PROFILE,
  full: FULL_ADMIN_ACCESS_PROFILE,
  'mini-admin': MINI_ADMIN_ACCESS_PROFILE,
  'shop-manager': SHOP_MANAGER_ACCESS_PROFILE,
} as const satisfies Record<string, AdminAccessProfile>;

export function resolveAdminAccessProfile(
  profileId: string | undefined,
  warn: (message: string) => void = console.warn,
): AdminAccessProfile {
  const normalizedProfileId = profileId?.trim();

  if (!normalizedProfileId) {
    return FULL_ADMIN_ACCESS_PROFILE;
  }

  const profile = accessProfiles[normalizedProfileId as keyof typeof accessProfiles];
  if (profile) {
    return profile;
  }

  warn(
    `[access-profile] Unknown VITE_ADMIN_ACCESS_PROFILE: ${normalizedProfileId}. ` +
      `Available profiles: ${Object.keys(accessProfiles).join(', ')}`,
  );
  return FULL_ADMIN_ACCESS_PROFILE;
}

export function getAdminAccessProfile(): AdminAccessProfile {
  const env = import.meta.env as { VITE_ADMIN_ACCESS_PROFILE?: string } | undefined;
  return resolveAdminAccessProfile(env?.VITE_ADMIN_ACCESS_PROFILE);
}
