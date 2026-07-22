import { LanguageCode } from '@deenruv/admin-types';
import type { StorefrontEntityUrlContext } from '@deenruv/react-ui-devkit';
import { describe, expect, it } from 'vitest';

import { getStorefrontEntityUrlState } from './StorefrontAction.logic';

const context: StorefrontEntityUrlContext = {
  entityType: 'product',
  entityId: 'product-1',
  slug: 'red-chair',
  channelCode: 'default-channel',
  languageCode: LanguageCode.en,
};

describe('getStorefrontEntityUrlState', () => {
  it('returns a normalized ready URL', () => {
    expect(getStorefrontEntityUrlState(context, () => 'https://shop.example/products/red-chair')).toEqual({
      kind: 'ready',
      url: 'https://shop.example/products/red-chair',
    });
  });

  it('disables the action when the resolver throws', () => {
    expect(
      getStorefrontEntityUrlState(context, () => {
        throw new Error('invalid configuration');
      }),
    ).toEqual({ kind: 'disabled', reason: 'resolverFailed' });
  });

  it('hides the action when the resolver does not support the entity type', () => {
    expect(getStorefrontEntityUrlState(context, () => undefined)).toEqual({ kind: 'hidden' });
  });

  it('disables the action when the resolver returns null', () => {
    expect(getStorefrontEntityUrlState(context, () => null)).toEqual({
      kind: 'disabled',
      reason: 'resolverEmpty',
    });
  });

  it('rejects a relative URL', () => {
    expect(getStorefrontEntityUrlState(context, () => '/products/red-chair')).toEqual({
      kind: 'disabled',
      reason: 'urlNotAbsolute',
    });
  });

  it('rejects a non-http URL', () => {
    expect(getStorefrontEntityUrlState(context, () => 'ftp://shop.example/products/red-chair')).toEqual({
      kind: 'disabled',
      reason: 'unsupportedProtocol',
    });
  });
});
