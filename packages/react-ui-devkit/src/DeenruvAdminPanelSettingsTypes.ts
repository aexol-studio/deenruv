import type { LanguageCode } from "@deenruv/admin-types";
import type React from "react";

type Logo = string | React.JSX.Element;

export type StorefrontEntityUrlContext =
  | {
      entityType: "product";
      entityId: string;
      slug: string;
      channelCode: string;
      languageCode: LanguageCode;
    }
  | {
      entityType: "collection";
      entityId: string;
      slug: string;
      channelCode: string;
      languageCode: LanguageCode;
      breadcrumbs: ReadonlyArray<{ id: string; slug: string }>;
    };

export type StorefrontEntityUrlResolver = (
  context: StorefrontEntityUrlContext,
) => string | null | undefined;

export type DeenruvAdminPanelSettings = {
  api: { uri: string; channelTokenName?: string; authTokenName?: string };
  ui?: {
    defaultChannelCode?: string;
    defaultLanguageCode?: LanguageCode;
    defaultTranslationLanguageCode?: LanguageCode;
    resolveStorefrontEntityUrl?: StorefrontEntityUrlResolver;
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
