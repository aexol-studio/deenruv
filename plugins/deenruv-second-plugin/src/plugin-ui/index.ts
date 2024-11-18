import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { pages } from './pages';
import { LanguagesIcon } from 'lucide-react';
import pl from './locales/pl';
import en from './locales/en';

export const translationNs = 'second-plugin';

export const DeenruvSecondUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Second Plugin',
    pages,
    translations: {
        ns: translationNs,
        data: {
            en,
            pl,
        },
    },
    navMenuGroups: [
        {
            id: 'product-settings',
            labelId: `nav.group`,
            placement: { groupId: 'shop-group' },
        },
    ],
    navMenuLinks: [
        {
            id: 'locale-test-two',
            href: 'locale-test-two',
            labelId: `nav.link`,
            groupId: 'product-settings',
            icon: LanguagesIcon,
        },
    ],
});
