import { DeenruvAdminPanel } from '@deenruv/admin-dashboard';

import { UIPlugin } from '@deenruv/deenruv-examples-plugin/plugin-ui';
import { UIPlugin as SecondUIPlugin } from '@deenruv/deenruv-second-plugin/plugin-ui';
import { UIPlugin as CMSPlugin } from '@deenruv/content-management-plugin/plugin-ui';
import { DeenruvLogo } from './DeenruvLogo';
import { DeenruvAdminPanelSettings, DeenruvUIPlugin } from '@deenruv/react-ui-devkit';

const plugins: Array<DeenruvUIPlugin> = [UIPlugin, SecondUIPlugin, CMSPlugin];
const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: 'Deenruv',
    logo: {
      full: <DeenruvLogo isCollapsed={false} />,
      collapsed: <DeenruvLogo isCollapsed={true} />,
    },
  },
  api: { uri: 'http://localhost:3000' },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
