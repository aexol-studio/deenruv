import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';

export const UIPlugin = createDeenruvUIPlugin<{}>({
    version: '1.0.0',
    name: 'Copy Order Plugin',
    translations: {
        ns: 'copy-order-plugin',
        data: { en, pl },
    },
});
