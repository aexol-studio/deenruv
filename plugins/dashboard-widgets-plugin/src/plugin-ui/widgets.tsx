import React from 'react';
import {
    OrdersWidget,
    OrdersSummaryWidget,
    ProductsChartWidget,
    CategoriesChartWidget,
    LatestOrdersWidget,
} from './components';

export const widgets = [
    {
        id: '1',
        name: 'Orders Summary Widget',
        component: <OrdersSummaryWidget />,
        visible: true,
        size: { width: 12, height: 4 },
        sizes: [{ width: 12, height: 4 }],
    },
    {
        id: '2',
        name: 'Orders Widget',
        component: <OrdersWidget />,
        visible: true,
        size: { width: 12, height: 8 },
        sizes: [{ width: 12, height: 8 }],
    },
    {
        id: '3',
        name: 'Products Widget',
        component: <ProductsChartWidget />,
        visible: true,
        size: { width: 6, height: 10 },
        sizes: [{ width: 6, height: 10 }],
    },
    {
        id: '4',
        name: 'Categories Widget',
        component: <CategoriesChartWidget />,
        visible: true,
        size: { width: 6, height: 10 },
        sizes: [{ width: 6, height: 10 }],
    },
    {
        id: '5',
        name: 'Latest Orders Widget',
        component: <LatestOrdersWidget />,
        visible: true,
        size: { width: 6, height: 10 },
        sizes: [{ width: 6, height: 10 }],
    },
];
