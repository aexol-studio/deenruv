import React from 'react';
import { OrdersSummaryWidget } from './widgets/OrdersSummaryWidget';

export const widgets = [
    {
        id: '1',
        name: 'Test',
        component: <OrdersSummaryWidget />,
        visible: true,
        size: { width: 12, height: 4 },
        sizes: [{ width: 12, height: 4 }],
    },
];
