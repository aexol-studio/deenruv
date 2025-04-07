import { typedGql } from "../zeus/typedDocumentNode";
import { $, SortOrder } from "../zeus";
import { scalars } from "@deenruv/admin-types";
import { LatestOrderSelector, SummaryOrdersSelector } from "./selectors";
import { ORDER_STATE } from "@deenruv/react-ui-devkit";
export const OrdersSummaryQuery = typedGql("query", { scalars })({
  orders: [
    {
      options: $("options", "OrderListOptions"),
    },
    { totalItems: true, items: SummaryOrdersSelector },
  ],
});

export const CategoriesMetricQuery = typedGql("query", { scalars })({
  chartMetric: [
    {
      input: $("input", "ChartMetricInput!"),
    },
    {
      data: {
        title: true,
        type: true,
        entries: {
          intervalTick: true,
          value: true,
          additionalData: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    },
  ],
});

export const ChartMetricQuery = typedGql("query", { scalars })({
  __alias: {
    prevChartMetric: {
      chartMetric: [
        {
          input: $("prevInput", "ChartMetricInput!"),
        },
        {
          data: {
            title: true,
            type: true,
            entries: {
              intervalTick: true,
              value: true,
              additionalData: {
                id: true,
                name: true,
                quantity: true,
              },
            },
          },
        },
      ],
    },
  },
  chartMetric: [
    {
      input: $("input", "ChartMetricInput!"),
    },
    {
      data: {
        title: true,
        type: true,
        entries: {
          intervalTick: true,
          value: true,
          additionalData: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    },
  ],
});

export const BarChartMetricQuery = typedGql("query", { scalars })({
  chartMetric: [
    {
      input: $("input", "ChartMetricInput!"),
    },
    {
      data: {
        title: true,
        type: true,
        entries: {
          intervalTick: true,
          value: true,
          additionalData: {
            id: true,
            name: true,
            quantity: true,
          },
        },
      },
    },
  ],
});

export const OrderSummaryMetricsQuery = typedGql("query", { scalars })({
  __alias: {
    prevOrderSummaryMetric: {
      orderSummaryMetric: [
        { input: $("prevInput", "OrderSummaryMetricInput!") },
        {
          __typename: true,
          data: {
            __typename: true,
            currencyCode: true,
            averageOrderValue: true,
            averageOrderValueWithTax: true,
            orderCount: true,
            total: true,
            totalWithTax: true,
            productCount: true,
          },
        },
      ],
    },
  },
  orderSummaryMetric: [
    { input: $("input", "OrderSummaryMetricInput!") },
    {
      __typename: true,
      data: {
        __typename: true,
        currencyCode: true,
        averageOrderValue: true,
        averageOrderValueWithTax: true,
        orderCount: true,
        total: true,
        totalWithTax: true,
        productCount: true,
      },
    },
  ],
});
export const ProductCollectionsQuery = typedGql("query", { scalars })({
  products: [
    {
      options: {
        filter: {
          id: {
            in: $("in", "[String!]"),
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

export const LatestOrdersQuery = typedGql("query", { scalars })({
  orders: [
    {
      options: {
        take: 5,
        filter: {
          active: { eq: false },
          state: { notIn: LATEST_ORDERS_EXCLUDED_STATUSES },
        },
        sort: { createdAt: SortOrder.DESC },
      },
    },
    {
      items: LatestOrderSelector,
      totalItems: true,
    },
  ],
});
