import type { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';

export type DeenruvUIPlugins = Array<DeenruvUIPlugin>;
export type DeenruvAdminPanelSettings = {
  api: { uri: string };
  branding: { name: string; logo?: string | JSX.Element };
};

export function DeenruvAdminPanel({
  plugins,
  settings,
}: {
  plugins: DeenruvUIPlugins;
  settings: DeenruvAdminPanelSettings;
}): JSX.Element;
