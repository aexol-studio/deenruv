import React from 'react';
import { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { TestComponent } from './components';

export const tabs: DeenruvUIPlugin['tabs'] = [
    { id: 'products-detail-view', name: 'test', label: 'Test', component: <TestComponent /> },
];
