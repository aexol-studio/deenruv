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

export function getAdminAccessProfile(): AdminAccessProfile {
  const profileId = import.meta.env.VITE_ADMIN_ACCESS_PROFILE?.trim();

  if (!profileId) {
    return FULL_ADMIN_ACCESS_PROFILE;
  }

  const profile = accessProfiles[profileId as keyof typeof accessProfiles];
  if (profile) {
    return profile;
  }

  console.warn(
    `[access-profile] Unknown VITE_ADMIN_ACCESS_PROFILE: ${profileId}. ` +
      `Available profiles: ${Object.keys(accessProfiles).join(', ')}`,
  );
  return FULL_ADMIN_ACCESS_PROFILE;
}
