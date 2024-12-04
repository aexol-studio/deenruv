import { DeenruvAdminPanel, DeenruvAdminPanelSettings, DeenruvUIPlugin } from '@deenruv/admin-dashboard';

// import { UIPlugin as ExampleUiPlugin } from '@deenruv/deenruv-examples-plugin/plugin-ui';
// import { UIPlugin as CMSPlugin } from '@deenruv/content-management-plugin/plugin-ui';
// import { UIPlugin as DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin/plugin-ui';
// import { BadgesUiPlugin } from '@deenruv/product-badges-plugin/plugin-ui';

import { DeenruvLogo } from './DeenruvLogo';
import { LanguageCode } from '@deenruv/admin-types';

// const plugins: Array<DeenruvUIPlugin> = [ExampleUiPlugin, CMSPlugin, BadgesUiPlugin, DashboardWidgetsPlugin];
const plugins: Array<DeenruvUIPlugin> = [];
const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: 'Deenruv',
    logo: {
      full: <DeenruvLogo isCollapsed={false} />,
      collapsed: <DeenruvLogo isCollapsed={true} />,
    },
  },
  ui: {
    defaultChannelCode: 'de-channel',
    defaultLanguageCode: LanguageCode.pl,
    defaultTranslationLanguageCode: LanguageCode.pl,
  },
  api: {
    uri: 'http://localhost:3000',
    authTokenName: 'deenruv-auth-token',
    channelTokenName: 'deenruv-token',
  },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
