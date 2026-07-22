import { DeenruvAdminPanel, type DeenruvAdminPanelSettings } from '@deenruv/admin-dashboard';

import { getEnabledPlugins } from './plugins/enabled';
import { DeenruvLogo } from './DeenruvLogo';

const plugins = getEnabledPlugins();
const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL?.trim();

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
  ui: storefrontUrl
    ? {
        resolveStorefrontEntityUrl: (context) => {
          switch (context.entityType) {
            case 'product':
              return new globalThis.URL(`/products/${encodeURIComponent(context.slug)}`, storefrontUrl).href;
            case 'collection':
              return new globalThis.URL(`/collections/${encodeURIComponent(context.slug)}`, storefrontUrl).href;
            default:
              return undefined;
          }
        },
      }
    : undefined,
};

function App() {
  return <DeenruvAdminPanel plugins={plugins} settings={settings} />;
}

export default App;
