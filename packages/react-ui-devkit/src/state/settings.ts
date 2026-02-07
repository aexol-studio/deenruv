import { ChannelType } from "@/selectors";
import { LanguageCode } from "@deenruv/admin-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SETTINGS_LOCAL_STORAGE_KEY = "deenruv-admin-panel-storage";
type ThemeType = "dark" | "light" | "system";

interface Settings {
  language: LanguageCode;
  translationsLanguage: LanguageCode;
  token: string | undefined;
  isLoggedIn: boolean;
  selectedChannel: ChannelType | undefined;
  theme: ThemeType;
  availableLanguages: LanguageCode[];
}

interface Actions {
  setLanguage(language: LanguageCode): void;
  logIn(token: string): void;
  logOut(): void;
  setSelectedChannel(selectedChannel: ChannelType): void;
  setTheme(theme: ThemeType): void;
  setTranslationsLanguage(code: LanguageCode): void;
  setAvailableLanguages(languages: LanguageCode[]): void;
}

const storage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str);
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useSettings = create<Settings & Actions>()(
  persist(
    (set) => ({
      translationsLanguage: LanguageCode.en,
      language: LanguageCode.en,
      token: undefined,
      isLoggedIn: false,
      selectedChannel: undefined,
      theme: "system",
      availableLanguages: [],
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        window.__DEENRUV_SETTINGS__.i18n.changeLanguage(language);
        set({ language });
      },
      logIn: (token) => set({ token, isLoggedIn: true }),
      logOut: () =>
        set({
          token: undefined,
          selectedChannel: undefined,
          isLoggedIn: false,
        }),
      setSelectedChannel: (selectedChannel) => set({ selectedChannel }),
      setTranslationsLanguage: (translationsLanguage) =>
        set({ translationsLanguage }),
      setAvailableLanguages: (availableLanguages) =>
        set({ availableLanguages }),
    }),
    { name: SETTINGS_LOCAL_STORAGE_KEY, storage },
  ),
);
