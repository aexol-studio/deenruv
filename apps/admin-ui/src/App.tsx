import { DeenruvAdminPanel } from './DeenruvAdminPanel';
import { PluginStore } from '@deenruv/react-ui-devkit';
import { UIPlugin } from '@deenruv/deenruv-first-plugin/plugin-ui';
import { UIPlugin as SecondUiPlugin } from '@deenruv/deenruv-second-plugin/plugin-ui';
import i18next from './i18';

const plugins = new PluginStore(i18next);
plugins.install([UIPlugin, SecondUiPlugin]);

const settings = {
  settings: {
    branding: {
      name: 'Deenruv',
      logo: '',
    },
  },
  plugins,
};

export default function App() {
  return <DeenruvAdminPanel {...settings} />;
}
