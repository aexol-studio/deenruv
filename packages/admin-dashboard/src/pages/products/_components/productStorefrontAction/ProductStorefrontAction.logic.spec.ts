import { LanguageCode } from '@deenruv/admin-types';
import type { StorefrontEntityUrlContext } from '@deenruv/react-ui-devkit';
import { describe, expect, it, vi } from 'vitest';

import { getProductStorefrontActionState, type ProductStorefrontActionInput } from './ProductStorefrontAction.logic';

const product = {
  id: 'product-1',
  enabled: true,
  channels: [{ code: 'default-channel' }],
  translations: [{ languageCode: LanguageCode.en, slug: 'red-chair' }],
};

const createInput = (overrides: Partial<ProductStorefrontActionInput> = {}): ProductStorefrontActionInput => ({
  product,
  selectedChannelCode: 'default-channel',
  languageCode: LanguageCode.en,
  formTranslations: [{ languageCode: LanguageCode.en, slug: 'red-chair' }],
  formEnabled: true,
  resolveStorefrontEntityUrl: ({ slug }) => `https://shop.example/products/${slug}`,
  ...overrides,
});

describe('getProductStorefrontActionState', () => {
  it('resolves a valid absolute URL with the saved product context', () => {
    const resolver = vi.fn((context: StorefrontEntityUrlContext) => `https://shop.example/products/${context.slug}`);

    expect(getProductStorefrontActionState(createInput({ resolveStorefrontEntityUrl: resolver }))).toEqual({
      kind: 'ready',
      context: {
        entityType: 'product',
        entityId: 'product-1',
        slug: 'red-chair',
        channelCode: 'default-channel',
        languageCode: LanguageCode.en,
      },
      url: 'https://shop.example/products/red-chair',
    });
    expect(resolver).toHaveBeenCalledWith({
      entityType: 'product',
      entityId: 'product-1',
      slug: 'red-chair',
      channelCode: 'default-channel',
      languageCode: LanguageCode.en,
    });
  });

  it('uses the persisted translation matching the selected language', () => {
    const resolver = vi.fn(() => 'https://shop.example/products/czerwone-krzeslo');
    const translations = [
      { languageCode: LanguageCode.en, slug: 'red-chair' },
      { languageCode: LanguageCode.pl, slug: 'czerwone-krzeslo' },
    ];

    const state = getProductStorefrontActionState(
      createInput({
        product: { ...product, translations },
        languageCode: LanguageCode.pl,
        formTranslations: translations,
        resolveStorefrontEntityUrl: resolver,
      }),
    );

    expect(state).toMatchObject({
      kind: 'ready',
      context: { languageCode: LanguageCode.pl, slug: 'czerwone-krzeslo' },
    });
  });

  it('allows a selected channel when the saved product has multiple channel assignments', () => {
    const resolver = vi.fn(() => 'https://shop.example/products/red-chair');
    const state = getProductStorefrontActionState(
      createInput({
        product: { ...product, channels: [{ code: 'default-channel' }, { code: 'secondary-channel' }] },
        selectedChannelCode: 'secondary-channel',
        resolveStorefrontEntityUrl: resolver,
      }),
    );

    expect(state).toMatchObject({
      kind: 'ready',
      context: { channelCode: 'secondary-channel' },
    });
  });

  it('disables the action when the selected channel is missing', () => {
    expect(getProductStorefrontActionState(createInput({ selectedChannelCode: null }))).toEqual({
      kind: 'disabled',
      reason: 'missingChannel',
    });
  });

  it('disables the action when the selected translation has no persisted slug', () => {
    expect(getProductStorefrontActionState(createInput({ product: { ...product, translations: [] } }))).toEqual({
      kind: 'disabled',
      reason: 'missingSlug',
    });
  });

  it('disables the action for a disabled saved product', () => {
    expect(
      getProductStorefrontActionState(createInput({ product: { ...product, enabled: false }, formEnabled: false })),
    ).toEqual({ kind: 'disabled', reason: 'productDisabled' });
  });

  it('disables the action when the saved product is not assigned to the selected channel', () => {
    expect(getProductStorefrontActionState(createInput({ product: { ...product, channels: [] } }))).toEqual({
      kind: 'disabled',
      reason: 'channelNotAssigned',
    });
  });

  it('disables the action when the current form slug differs from the persisted slug', () => {
    expect(
      getProductStorefrontActionState(
        createInput({
          formTranslations: [{ languageCode: LanguageCode.en, slug: 'draft-red-chair' }],
        }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'unsavedSlug' });
  });

  it('disables the action when the current enabled state differs from the persisted state', () => {
    expect(getProductStorefrontActionState(createInput({ formEnabled: false }))).toEqual({
      kind: 'disabled',
      reason: 'unsavedEnabled',
    });
  });

  it('disables the action when the resolver throws or returns no URL', () => {
    expect(
      getProductStorefrontActionState(
        createInput({
          resolveStorefrontEntityUrl: () => {
            throw new Error('invalid configuration');
          },
        }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'resolverFailed' });
    expect(getProductStorefrontActionState(createInput({ resolveStorefrontEntityUrl: () => null }))).toEqual({
      kind: 'disabled',
      reason: 'resolverEmpty',
    });
  });

  it('hides the action when the resolver does not support products', () => {
    expect(
      getProductStorefrontActionState(
        createInput({
          product: { ...product, enabled: false },
          formEnabled: false,
          resolveStorefrontEntityUrl: () => undefined,
        }),
      ),
    ).toEqual({ kind: 'hidden' });
  });

  it('rejects a relative URL', () => {
    expect(
      getProductStorefrontActionState(createInput({ resolveStorefrontEntityUrl: () => '/products/red-chair' })),
    ).toEqual({ kind: 'disabled', reason: 'urlNotAbsolute' });
  });

  it('rejects a non-http URL', () => {
    expect(
      getProductStorefrontActionState(
        createInput({ resolveStorefrontEntityUrl: () => 'ftp://shop.example/products/red-chair' }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'unsupportedProtocol' });
  });
});
