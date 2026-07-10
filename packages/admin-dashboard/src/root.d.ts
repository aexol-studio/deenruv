import type { AdminAccessProfile, DeenruvUIPlugin, DeenruvAdminPanelSettings } from '@deenruv/react-ui-devkit';

export function DeenruvAdminPanel({
  plugins,
  settings,
  accessProfile,
}: {
  plugins: Array<DeenruvUIPlugin>;
  settings: DeenruvAdminPanelSettings;
  accessProfile?: AdminAccessProfile;
}): JSX.Element;

export const FULL_ADMIN_ACCESS_PROFILE: AdminAccessProfile;
export const MINI_ADMIN_ACCESS_PROFILE: AdminAccessProfile;
export const SHOP_MANAGER_ACCESS_PROFILE: AdminAccessProfile;

export type { AdminAccessProfile, DeenruvAdminPanelSettings, DeenruvUIPlugin };
