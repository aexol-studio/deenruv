import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';
import { FacetHarmonica } from './components';

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
    translations: {
        ns: translationNS,
        data: { en, pl },
    },
});
