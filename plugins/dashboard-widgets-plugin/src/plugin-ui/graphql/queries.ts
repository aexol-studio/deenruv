import { typedGql } from '../zeus/typedDocumentNode';
import { $, SortOrder } from '../zeus';
import { scalars } from '@deenruv/admin-types';
import { LatestOrderSelector, SummaryOrdersSelector } from './selectors';
import { ORDER_STATE } from '@deenruv/react-ui-devkit';

export const OrdersSummaryQuery = typedGql('query', { scalars })({
    orders: [
        {
            options: $('options', 'OrderListOptions'),
        },
        { totalItems: true, items: SummaryOrdersSelector },
    ],
});

export const BetterMetricsQuery = typedGql('query', { scalars })({
    betterMetricSummary: [
        {
            input: $('input', 'BetterMetricSummaryInput!'),
        },
        {
            data: {
                title: true,
                interval: true,
                type: true,
                entries: {
                    label: true,
                    value: true,
                    additionalData: { id: true, name: true, quantity: true },
                },
            },
            lastCacheRefreshTime: true,
        },
    ],
});

export const ProductCollectionsQuery = typedGql('query', { scalars })({
    products: [
        {
            options: {
                filter: {
                    id: {
                        in: $('in', '[String!]'),
                    },
                },
            },
        },
        { items: { collections: { slug: true } } },
    ],
});

const LATEST_ORDERS_EXCLUDED_STATUSES = [
    ORDER_STATE.CANCELLED,
    ORDER_STATE.DRAFT,
    ORDER_STATE.MODIFYING,
    ORDER_STATE.ADDING_ITEMS,
];

export const LatestOrdersQuery = typedGql('query', { scalars })({
    orders: [
        {
            options: {
                take: 5,
                filter: { active: { eq: false }, state: { notIn: LATEST_ORDERS_EXCLUDED_STATUSES } },
                sort: { createdAt: SortOrder.DESC },
            },
        },
        {
            items: LatestOrderSelector,
            totalItems: true,
        },
    ],
});
