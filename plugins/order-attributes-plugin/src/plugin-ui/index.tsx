import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';
import { AttributesInput } from './components/AttributesInput';
import { FunctionComponent } from 'react';

export const OrderLineAttributesUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Order Line Attributes',
    inputs: [{ id: 'attributes-input', component: AttributesInput as FunctionComponent<{}> }], // TODO Fix types when ready
    translations: {
        ns: translationNS,
        data: { en, pl },
    },
});
