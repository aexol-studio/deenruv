import { BASE_GROUP_ID, createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { BarChart, Camera, LanguagesIcon } from 'lucide-react';
import { pages } from './pages';
import { SquareIcon } from './assets';
import { widgets } from './widgets';
import { inputs } from './inputs';
import { tables } from './tables';
import { tabs } from './tabs';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'First Plugin',
    pages,
    widgets,
    inputs,
    tables,
    tabs,
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
            groupId: BASE_GROUP_ID.SHIPPING,
            icon: SquareIcon,
            placement: { linkId: 'link-shipping-methods' },
        },
        {
            id: 'placement-2',
            href: 'test',
            labelId: `placement-1`,
            groupId: BASE_GROUP_ID.SHIPPING,
            icon: Camera,
            placement: { linkId: 'link-payment-methods', where: 'above' },
        },
    ],
});
