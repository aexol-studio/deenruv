import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';
import { FacetHarmonica } from './components';
import { tables } from './tables.js';
import { DedicatedButtons } from './components/DedicatedButtons.js';
import { AttributesInput } from './components/AttributesInput.js';
import { InRealizationStateModal } from './components/InRealizationStateModal.js';

export const FacetHarmonicaUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Facet Harmonica',
    components: [
        {
            id: 'products-detail-view',
            component: FacetHarmonica.bind(null, {
                // Change when there is a way to communicate plugin with app
                facetsOptions: [],
                checkedFacetsIds: [],
                handleFacetCheckboxChange: () => {},
            }),
        },
    ],
    tables,
    translations: { ns: translationNS, data: { en, pl } },
    inputs: [{ id: 'attributes-input', component: AttributesInput }],
    actions: { inline: [{ id: 'orders-detail-view', component: DedicatedButtons }] },
    modals: [{ id: 'manual-order-state', component: InRealizationStateModal }],
});
