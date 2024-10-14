import { ChannelType } from '@/graphql/base';
import { LanguageCode } from '@/zeus';
import i18next from 'i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SETTINGS_LOCAL_STORAGE_KEY = 'deenruv-admin-panel-storage';
type ThemeType = 'dark' | 'light' | 'system';

export type LanguageKey =
  | 'bg'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'et'
  | 'fi'
  | 'fr'
  | 'hu'
  | 'it'
  | 'ja'
  | 'lt'
  | 'lv'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'sk'
  | 'sl'
  | 'sv'
  | 'tr'
  | 'uk'
  | 'zh';

export interface Language {
  language: LanguageKey;
  name: string;
}

export const languages: Language[] = [
  // { language: 'bg', name: 'Български' }, TO BE ADDED LATER
  // { language: 'cs', name: 'Čeština' },
  // { language: 'da', name: 'Dansk' },
  // { language: 'de', name: 'Deutsch' },
  // { language: 'el', name: 'Ελληνικά' },
  { language: 'en', name: 'English' },
  // { language: 'es', name: 'Español' },
  // { language: 'et', name: 'Eesti' },
  // { language: 'fi', name: 'Suomi' },
  // { language: 'fr', name: 'Français' },
  // { language: 'hu', name: 'Magyar' },
  // { language: 'it', name: 'Italiano' },
  // { language: 'ja', name: '日本語' },
  // { language: 'lt', name: 'Latviešu' },
  // { language: 'lv', name: 'Lietuvių' },
  // { language: 'nl', name: 'Nederlands' },
  { language: 'pl', name: 'Polski' },
  // { language: 'pt', name: 'Português' },
  // { language: 'ro', name: 'Română' },
  // { language: 'sk', name: 'Slovenčina' },
  // { language: 'sl', name: 'Slovenščina' },
  // { language: 'sv', name: 'Svenska' },
  // { language: 'tr', name: 'Türkçe' },
  // { language: 'uk', name: 'Українська' },
  // { language: 'zh', name: '中文' },
];

interface Settings {
  language: LanguageKey;
  translationsLanguage: LanguageCode;
  token: string | undefined;
  isLoggedIn: boolean;
  selectedChannel: ChannelType | undefined;
  theme: ThemeType;
  availableLanguages: LanguageCode[];
}

interface Actions {
  setLanguage(language: LanguageKey): void;
  logIn(token: string): void;
  logOut(): void;
  setSelectedChannel(selectedChannel: ChannelType): void;
  setTheme(theme: ThemeType): void;
  setTranslationsLanguage(code: LanguageCode): void;
  setAvailableLanguages(languages: LanguageCode[]): void;
}

export const useSettings = create<Settings & Actions>()(
  persist(
    (set) => ({
      translationsLanguage: LanguageCode.en,
      language: 'en',
      token: undefined,
      isLoggedIn: false,
      selectedChannel: undefined,
      theme: 'system',
      availableLanguages: [],
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        i18next.changeLanguage(language as string);
        set({ language });
      },
      logIn: (token) => set({ token, isLoggedIn: true }),
      logOut: () => set({ token: undefined, selectedChannel: undefined, isLoggedIn: false }),
      setSelectedChannel: (selectedChannel) => set({ selectedChannel }),
      setTranslationsLanguage: (translationsLanguage) => set({ translationsLanguage }),
      setAvailableLanguages: (availableLanguages) => set({ availableLanguages }),
    }),
    { name: SETTINGS_LOCAL_STORAGE_KEY },
  ),
);
