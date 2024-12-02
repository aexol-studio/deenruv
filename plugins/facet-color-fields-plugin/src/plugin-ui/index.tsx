import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { tables } from './tables';

export const FacetColorFieldsUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Facet Color Fields Plugin',
    tables,
});
