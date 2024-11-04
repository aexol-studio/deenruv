import { DeenruvAdminPanel, DeenruvUIPlugins, DeenruvAdminPanelSettings } from '@deenruv/admin-dashboard';

import { UIPlugin as FirstUIPlugin } from '@deenruv/deenruv-first-plugin/plugin-ui';
import { UIPlugin as SecondUIPlugin } from '@deenruv/deenruv-second-plugin/plugin-ui';
import { UIPlugin as CMSPlugin } from '@deenruv/content-management-plugin/plugin-ui';
import { DeenruvLogo } from './DeenruvLogo';

const plugins: DeenruvUIPlugins = [FirstUIPlugin, SecondUIPlugin, CMSPlugin];
const settings: DeenruvAdminPanelSettings = {
  branding: { name: 'Deenruv', logo: <DeenruvLogo /> },
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
