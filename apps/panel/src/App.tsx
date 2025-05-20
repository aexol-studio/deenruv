import { DeenruvAdminPanel, DeenruvAdminPanelSettings, DeenruvUIPlugin } from '@deenruv/admin-dashboard';
import '@deenruv/admin-dashboard/dist/index.css';

// import { UIPlugin as ExampleUiPlugin } from '@deenruv/deenruv-examples-plugin/plugin-ui';
import { ReplicateUiPlugin } from '@deenruv/replicate-plugin/plugin-ui';
// import { ReplicateSimpleBGUiPlugin } from '@deenruv/replicate-simple-bg-plugin/plugin-ui';
import { UIPlugin as DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin/plugin-ui';
// import { BadgesUiPlugin } from '@deenruv/product-badges-plugin/plugin-ui';
import { FacetHarmonicaUiPlugin } from '@deenruv/facet-harmonica-plugin/plugin-ui';
import { UIPlugin as CopyOrderUIPlugin } from '@deenruv/copy-order-plugin/plugin-ui';
import { InRealizationUIPlugin } from '@deenruv/in-realization-plugin/plugin-ui';
import { OrderLineAttributesUiPlugin } from '@deenruv/order-line-attributes-plugin/plugin-ui';
import { WFirmaUIPlugin } from '@deenruv/wfirma-plugin/plugin-ui';
import { Przelewy24UIPlugin } from '@deenruv/przelewy24-plugin/plugin-ui';
import { DeenruvLogo } from './DeenruvLogo';
// const plugins: Array<DeenruvUIPlugin> = [ExampleUiPlugin, CMSPlugin, BadgesUiPlugin, DashboardWidgetsPlugin];
const plugins: Array<DeenruvUIPlugin> = [
  DashboardWidgetsPlugin,
  // ReplicateUiPlugin,
  // ReplicateSimpleBGUiPlugin,
  // InRealizationUIPlugin,
  // CopyOrderUIPlugin,
  // FacetHarmonicaUiPlugin,
  // OrderLineAttributesUiPlugin,
  // WFirmaUIPlugin,
  // Przelewy24UIPlugin,
];
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
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
