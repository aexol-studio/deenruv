import { DeenruvAdminPanel, DeenruvAdminPanelSettings, DeenruvUIPlugin } from '@deenruv/admin-dashboard';

import { UIPlugin as ExampleUiPlugin } from '@deenruv/deenruv-examples-plugin/plugin-ui';
import { UIPlugin as CMSPlugin } from '@deenruv/content-management-plugin/plugin-ui';
import { UIPlugin as DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin/plugin-ui';
import { BadgesUiPlugin } from '@deenruv/product-badges-plugin/plugin-ui';

import { DeenruvLogo } from './DeenruvLogo';

const plugins: Array<DeenruvUIPlugin> = [ExampleUiPlugin, CMSPlugin, BadgesUiPlugin, DashboardWidgetsPlugin];
const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: 'Deenruv',
    logo: {
      full: <DeenruvLogo isCollapsed={false} />,
      collapsed: <DeenruvLogo isCollapsed={true} />,
    },
  },
  api: {
    uri: 'https://shop.samarite.eu',
    authTokenName: 'deenruv-auth-token',
    channelTokenName: 'deenruv-token',
  },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
