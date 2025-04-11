import { LanguageCode } from "@deenruv/admin-types";

type Logo = string | JSX.Element;
export type DeenruvAdminPanelSettings = {
  api: { uri: string; channelTokenName?: string; authTokenName?: string };
  ui?: {
    base?: string;
    defaultChannelCode?: string;
    defaultLanguageCode?: LanguageCode;
    defaultTranslationLanguageCode?: LanguageCode;
    extras?: { orderObservableStates?: string[] };
  };
  branding: {
    name: string;
    showAppVersion?: boolean;
    loginPage?: { logo?: Logo; showAppName?: boolean; hideFormLogo?: boolean };
    logo?: { full: Logo; collapsed?: Logo };
  };
};

export type DeenruvSettingsWindowType = DeenruvAdminPanelSettings & {
  base: string;
  appVersion: string;
  api: Required<DeenruvAdminPanelSettings["api"]>;
  i18n: any;
};
