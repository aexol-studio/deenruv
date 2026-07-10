import { DeenruvAdminPanel, type DeenruvAdminPanelSettings } from '@deenruv/admin-dashboard';

import { getAdminAccessProfile } from './access-profile';
import { getEnabledPlugins } from './plugins/enabled';
import { DeenruvLogo } from './DeenruvLogo';

const plugins = getEnabledPlugins();
const accessProfile = getAdminAccessProfile();

const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: 'Deenruv',
    logo: {
      full: <DeenruvLogo isCollapsed={false} />,
      collapsed: <DeenruvLogo isCollapsed={true} />,
    },
  },
  api: {
    uri: 'http://localhost:3000',
    authTokenName: 'deenruv-auth-token',
    channelTokenName: 'deenruv-token',
  },
  ui: {
    accessProfile,
  },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
