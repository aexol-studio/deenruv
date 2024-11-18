import { FromSelectorWithScalars, LanguageCode, Selector } from '@deenruv/admin-types';
import { getI18n } from 'react-i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SETTINGS_LOCAL_STORAGE_KEY = 'deenruv-admin-panel-storage';
type ThemeType = 'dark' | 'light' | 'system';

export const channelSelector = Selector('Channel')({
    id: true,
    code: true,
    token: true,
    currencyCode: true,
    defaultLanguageCode: true,
});

export type ChannelType = FromSelectorWithScalars<typeof channelSelector, 'Channel'>;

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

export const useSettings = create<Settings & Actions>()(
    persist(
        set => ({
            translationsLanguage: LanguageCode.en,
            language: LanguageCode.en,
            token: undefined,
            isLoggedIn: false,
            selectedChannel: undefined,
            theme: 'system',
            availableLanguages: [],
            setTheme: theme => set({ theme }),
            setLanguage: language => {
                getI18n().changeLanguage(language);
                set({ language });
            },
            logIn: token => set({ token, isLoggedIn: true }),
            logOut: () => set({ token: undefined, selectedChannel: undefined, isLoggedIn: false }),
            setSelectedChannel: selectedChannel => set({ selectedChannel }),
            setTranslationsLanguage: translationsLanguage => set({ translationsLanguage }),
            setAvailableLanguages: availableLanguages => set({ availableLanguages }),
        }),
        { name: SETTINGS_LOCAL_STORAGE_KEY },
    ),
);
