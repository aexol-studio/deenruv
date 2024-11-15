import { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { TestComponent } from './components';

export const tabs: DeenruvUIPlugin['tabs'] = [
    { id: 'products-detail-view', label: 'TEST', component: TestComponent },
];
