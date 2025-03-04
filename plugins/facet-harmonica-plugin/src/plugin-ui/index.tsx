import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';
import { FacetHarmonica } from './components';
import { tables } from './tables.js';
import { DedicatedButtons } from './components/DedicatedButtons.js';

export const FacetHarmonicaUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Facet Harmonica',
    components: [
        {
            id: 'products-detail-view',
            component: FacetHarmonica,
        },
    ],
    // FacetsAccordions
    tables,
    translations: { ns: translationNS, data: { en, pl } },
    actions: { inline: [{ id: 'orders-detail-view', component: DedicatedButtons }] },
});
