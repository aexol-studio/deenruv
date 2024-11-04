import { BASE_GROUP_ID, createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { LanguagesIcon } from 'lucide-react';
import { pages } from './pages';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'CMS Plugin',
    pages,
    widgets: [],
    inputs: [],
    translations: {
        ns: translationNS,
        data: { en, pl },
    },
    navMenuGroups: [
        {
            id: 'other-settings',
            labelId: `nav.group`,
            placement: { groupId: BASE_GROUP_ID.SETTINGS },
        },
    ],
    navMenuLinks: [
        {
            id: 'cms',
            href: 'cms',
            labelId: `nav.link`,
            groupId: 'other-settings',
            icon: LanguagesIcon,
        },
    ],
});
