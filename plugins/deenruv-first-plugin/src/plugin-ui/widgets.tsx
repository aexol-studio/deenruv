import React from 'react';
import { OrdersWidget, OrdersSummaryWidget } from './components';

export const widgets = [
    {
        id: '1',
        name: 'Orders Summary Widget',
        component: <OrdersSummaryWidget />,
        visible: true,
        size: { width: 4, height: 8 },
        sizes: [{ width: 4, height: 8 }],
    },
    {
        id: '2',
        name: 'Orders Widget',
        component: <OrdersWidget />,
        visible: true,
        size: { width: 12, height: 8 },
        sizes: [{ width: 12, height: 8 }],
    },
];
