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

export type { AdminAccessProfile, DeenruvAdminPanelSettings, DeenruvUIPlugin };
