import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { pages } from './pages';
import { Test } from './metrics';
import { BarChart, Camera, LanguagesIcon } from 'lucide-react';
import { SquareIcon } from './assets';
import { widgets } from './widgets';
import pl from './locales/pl';
import en from './locales/en';

export const translationNs = 'first-plugin';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'First Plugin',
    pages,
    widgets,
    components: [{ id: 'testing', component: Test }],
    translations: {
        ns: translationNs,
        data: {
            en,
            pl,
        },
    },
    navMenuGroups: [
        {
            id: 'other-settings',
            labelId: `nav.group`,
            placement: { groupId: 'settings-group' },
        },
    ],
    navMenuLinks: [
        {
            id: 'locale-test',
            href: 'locale-test',
            labelId: `nav.link`,
            groupId: 'other-settings',
            icon: LanguagesIcon,
        },
        {
            id: 'couriers',
            href: 'test',
            labelId: `couriers`,
            groupId: 'other-settings',
            icon: BarChart,
        },
        {
            id: 'placement-1',
            href: 'test',
            labelId: `placement-2`,
            groupId: 'shipping-group',
            icon: SquareIcon,
            placement: { linkId: 'link-shipping-methods' },
        },
        {
            id: 'placement-2',
            href: 'test',
            labelId: `placement-1`,
            groupId: 'shipping-group',
            icon: Camera,
            placement: { linkId: 'link-payment-methods', where: 'above' },
        },
    ],
});
