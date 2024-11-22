import type { LanguageCode } from '@deenruv/admin-types';

export const getLanguageName = (lng: LanguageCode, languageOfName?: LanguageCode) => {
    const languageName =
        new Intl.DisplayNames(languageOfName || lng, { type: 'language' }).of(lng) || 'error';
    return languageName?.charAt(0).toUpperCase() + languageName?.slice(1);
};
