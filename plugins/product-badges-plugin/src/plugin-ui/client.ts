import { ADMIN_API_URL } from '@deenruv/react-ui-devkit';
import { Chain, LanguageCode } from './zeus';

export const createClient = (lang: LanguageCode) =>
    Chain(`http://localhost:3000${ADMIN_API_URL}/?languageCode=${lang}`, {
        credentials: 'include',
    });
