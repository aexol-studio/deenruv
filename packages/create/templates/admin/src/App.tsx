import {
  DeenruvAdminPanel,
  DeenruvAdminPanelSettings,
} from "@deenruv/admin-dashboard";
import "./App.css";

const settings: DeenruvAdminPanelSettings = {
  branding: {
    name: "Deenruv Admin",
  },
  api: {
    uri: import.meta.env.VITE_ADMIN_HOST_URL || "http://localhost:3000",
    authTokenName: "deenruv-auth-token",
    channelTokenName: "deenruv-token",
  },
};

function App() {
  return <DeenruvAdminPanel plugins={[]} settings={settings} />;
}

export default App;
