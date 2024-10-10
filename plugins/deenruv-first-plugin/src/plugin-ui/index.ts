import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';

import { routes } from './routes';
import { Test } from './metrics';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'First Plugin',
    components: [{ location: { id: 'testing' }, component: Test }],
    navigation: [
        {
            name: 'test',
            route: 'test',
            location: { id: 'link.shippingMethods', groupId: 'shipping-group', where: 'below' },
        },
    ],
    routes,
});
