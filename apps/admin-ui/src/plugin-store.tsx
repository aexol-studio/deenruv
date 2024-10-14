import { PluginStore } from '@deenruv/react-ui-devkit';
import { UIPlugin } from '@deenruv/deenruv-first-plugin/plugin-ui';

const store = new PluginStore();
store.installPlugins([UIPlugin]);
export { store };
