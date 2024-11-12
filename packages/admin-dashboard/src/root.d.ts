import type { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';

type Logo = string | JSX.Element;
export type DeenruvUIPlugins = Array<DeenruvUIPlugin>;
export type DeenruvAdminPanelSettings = {
  api: { uri: string };
  branding: {
    name: string;
    logo?: {
      full: Logo;
      collapsed?: Logo;
    };
  };
};

export function DeenruvAdminPanel({
  plugins,
  settings,
}: {
  plugins: DeenruvUIPlugins;
  settings: DeenruvAdminPanelSettings;
}): JSX.Element;
