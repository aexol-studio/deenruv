/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { ORDER_LINE_FRAGMENT } from '@deenruv/admin-ui/core';
import { print } from 'graphql';

import { getOrderLineAsset } from './order-table.component';

describe('getOrderLineAsset()', () => {
    it('keeps the historical order-line snapshot when it is available', () => {
        const snapshot = { preview: 'snapshot.jpg' };

        expect(
            getOrderLineAsset({
                featuredAsset: snapshot,
                productVariant: {
                    featuredAsset: { preview: 'variant.jpg' },
                    product: { featuredAsset: { preview: 'product.jpg' } },
                },
            }),
        ).toBe(snapshot);
    });

    it('uses the variant asset when the order-line snapshot is unavailable', () => {
        const variantAsset = { preview: 'variant.jpg' };

        expect(
            getOrderLineAsset({
                featuredAsset: null,
                productVariant: {
                    featuredAsset: variantAsset,
                    product: { featuredAsset: { preview: 'product.jpg' } },
                },
            }),
        ).toBe(variantAsset);
    });

    it('uses the product asset when both line and variant assets are unavailable', () => {
        const productAsset = { preview: 'product.jpg' };

        expect(
            getOrderLineAsset({
                featuredAsset: null,
                productVariant: {
                    featuredAsset: null,
                    product: { featuredAsset: productAsset },
                },
            }),
        ).toBe(productAsset);
    });

    it('returns no asset so the template can render its placeholder when no fallback exists', () => {
        expect(
            getOrderLineAsset({
                featuredAsset: null,
                productVariant: {
                    featuredAsset: null,
                    product: { featuredAsset: null },
                },
            }),
        ).toBeNull();
    });
});

describe('ORDER_LINE_FRAGMENT', () => {
    it('fetches the variant and product assets needed by the fallback', () => {
        const document = print(ORDER_LINE_FRAGMENT);

        expect(document).toContain(`productVariant {
    id
    name
    sku
    trackInventory
    stockOnHand
    featuredAsset {
      preview
    }
    product {
      featuredAsset {
        preview
      }
    }
  }`);
    });
});
