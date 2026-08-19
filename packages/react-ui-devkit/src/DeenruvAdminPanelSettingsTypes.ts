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

type ChannelPickerSettings =
  | { showChannelPicker?: true; defaultChannelCode?: string }
  | { showChannelPicker: false; defaultChannelCode: string };

type LanguagePickerSettings =
  | {
      showLanguagePicker?: true;
      defaultLanguageCode?: LanguageCode;
      defaultTranslationLanguageCode?: LanguageCode;
    }
  | {
      showLanguagePicker: false;
      defaultLanguageCode: LanguageCode;
      defaultTranslationLanguageCode: LanguageCode;
    };

type AdminPanelUiCommonSettings = {
  resolveStorefrontEntityUrl?: StorefrontEntityUrlResolver;
  extras?: { orderObservableStates?: string[] };
};

type AdminPanelUiSettings = ChannelPickerSettings &
  LanguagePickerSettings &
  AdminPanelUiCommonSettings;

export type DeenruvAdminPanelSettings = {
  api: { uri: string; channelTokenName?: string; authTokenName?: string };
  ui?: AdminPanelUiSettings;
  branding: {
    name: string;
    showAppVersion?: boolean;
    loginPage?: { logo?: Logo; showAppName?: boolean; hideFormLogo?: boolean };
    logo?: { full: Logo; collapsed?: Logo };
  };
};

export type DeenruvSettingsWindowType = Omit<
  DeenruvAdminPanelSettings,
  "api" | "ui"
> & {
  appVersion: string;
  api: Required<DeenruvAdminPanelSettings["api"]>;
  ui?: AdminPanelUiCommonSettings & {
    showChannelPicker: boolean;
    showLanguagePicker: boolean;
    defaultChannelCode: string;
    defaultLanguageCode: LanguageCode;
    defaultTranslationLanguageCode: LanguageCode;
  };
  i18n: any;
};
