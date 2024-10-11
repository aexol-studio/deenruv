import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';

import { pages } from './pages';
import { Test } from './metrics';
import { BarChart, Camera } from 'lucide-react';

import { SquareIcon } from './assets';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'First Plugin',
    pages,
    components: [{ elementId: 'testing', component: Test }],
    navMenuGroups: [
        { id: 'other-settings', label: 'Inne Ustawienia', placement: { groupId: 'settings-group' } },
    ],
    navMenuLinks: [
        {
            id: 'other settings',
            href: 'test',
            label: 'Couriers',
            groupId: 'other-settings',
            icon: BarChart,
        },
        {
            id: 'placement-1',
            href: 'test',
            label: 'Placement Link',
            groupId: 'shipping-group',
            icon: SquareIcon,
            placement: { linkId: 'link-shipping-methods' },
        },
        {
            id: 'placement-2',
            href: 'test',
            label: 'Placement Link two',
            groupId: 'shipping-group',
            icon: Camera,
            placement: { linkId: 'placement-1', where: 'above' },
        },
    ],
});
