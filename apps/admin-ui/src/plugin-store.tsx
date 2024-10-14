import { PluginStore } from '@deenruv/react-ui-devkit';
import { UIPlugin } from '@deenruv/deenruv-first-plugin/plugin-ui';
import { UIPlugin as SecondUiPlugin } from '@deenruv/deenruv-second-plugin/plugin-ui';
import i18next from './i18';

const store = new PluginStore();

const plugins = [UIPlugin, SecondUiPlugin];
store.installPlugins(plugins, i18next.addResourceBundle);

export { store };
