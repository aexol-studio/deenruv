import { LanguageCode } from "@deenruv/admin-types";
import React from "react";

type Logo = string | React.JSX.Element;
export type DeenruvAdminPanelSettings = {
  api: { uri: string; channelTokenName?: string; authTokenName?: string };
  ui?: {
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
  appVersion: string;
  api: Required<DeenruvAdminPanelSettings["api"]>;
  i18n: any;
};
