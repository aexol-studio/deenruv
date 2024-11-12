import { DeenruvAdminPanel, DeenruvUIPlugins, DeenruvAdminPanelSettings } from '@deenruv/admin-dashboard';

import { UIPlugin as ExamplesUiPlugin } from '@deenruv/deenruv-examples-plugin/plugin-ui';
import { UIPlugin as SecondUIPlugin } from '@deenruv/deenruv-second-plugin/plugin-ui';
import { UIPlugin as CMSPlugin } from '@deenruv/content-management-plugin/plugin-ui';
import { DeenruvLogo } from './DeenruvLogo';

const plugins: DeenruvUIPlugins = [ExamplesUiPlugin, SecondUIPlugin, CMSPlugin];
const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: 'Deenruv',
    logo: {
      full: <DeenruvLogo isCollapsed={false} />,
      // collapsed: <DeenruvLogo isCollapsed={true} />,
    },
  },
  api: { uri: 'http://localhost:3000' },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
