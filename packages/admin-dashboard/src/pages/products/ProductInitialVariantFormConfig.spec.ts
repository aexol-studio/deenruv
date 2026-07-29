import { describe, expect, it } from 'vitest';

import { getProductInitialVariantFormConfig } from './ProductInitialVariantFormConfig';

describe('getProductInitialVariantFormConfig', () => {
  it('excludes create-only initial variant fields when editing a product', () => {
    expect(getProductInitialVariantFormConfig(false, 'SKU is required')).toEqual({});
  });

  it('includes the initial variant fields and defaults when creating a product', () => {
    const config = getProductInitialVariantFormConfig(true, 'SKU is required');

    expect(config).toEqual({
      initialVariantSku: { validate: expect.any(Function) },
      initialVariantPrice: { initialValue: 0 },
      initialVariantName: {},
    });
  });

  it('requires a nonblank initial variant SKU only when creating a product', () => {
    const config = getProductInitialVariantFormConfig(true, 'SKU is required');

    if (!('initialVariantSku' in config)) throw new Error('Expected create-mode SKU config');

    expect(config.initialVariantSku.validate(undefined)).toEqual(['SKU is required']);
    expect(config.initialVariantSku.validate('   ')).toEqual(['SKU is required']);
    expect(config.initialVariantSku.validate('SKU-1')).toBeUndefined();
  });
});
