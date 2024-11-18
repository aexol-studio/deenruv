import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { widgets } from './widgets';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';

export const UIPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Dashboard Widgets Plugin',
    widgets,
    translations: {
        ns: translationNS,
        data: { en, pl },
    },
});
