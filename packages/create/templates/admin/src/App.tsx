import {
  DeenruvAdminPanel,
  type DeenruvAdminPanelSettings,
} from "@deenruv/admin-dashboard";
import "./App.css";

const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL?.trim();

const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: "Deenruv Admin",
  },
  api: {
    uri: import.meta.env.VITE_ADMIN_HOST_URL || "http://localhost:6100",
    authTokenName: "deenruv-auth-token",
    channelTokenName: "deenruv-token",
  },
  ui: storefrontUrl
    ? {
        resolveStorefrontEntityUrl: (context) => {
          switch (context.entityType) {
            case "product":
              return new globalThis.URL(
                `/products/${encodeURIComponent(context.slug)}`,
                storefrontUrl,
              ).href;
            case "collection":
              return new globalThis.URL(
                `/collections/${encodeURIComponent(context.slug)}`,
                storefrontUrl,
              ).href;
            default:
              return undefined;
          }
        },
      }
    : undefined,
};

function App() {
  return <DeenruvAdminPanel plugins={[]} settings={settings} />;
}

export default App;
