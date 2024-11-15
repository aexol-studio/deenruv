import type { DeenruvUIPlugin, DeenruvAdminPanelSettings } from '@deenruv/react-ui-devkit';

export function DeenruvAdminPanel({
  plugins,
  settings,
}: {
  plugins: Array<DeenruvUIPlugin>;
  settings: DeenruvAdminPanelSettings;
}): JSX.Element;
