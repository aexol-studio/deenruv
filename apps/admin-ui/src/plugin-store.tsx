import { UIPlugin } from '@deenruv/deenruv-first-plugin/plugin-ui';
import { PluginStore } from '@deenruv/react-ui-devkit';

const store = new PluginStore();
store.installPlugins([UIPlugin]);
export { store };
