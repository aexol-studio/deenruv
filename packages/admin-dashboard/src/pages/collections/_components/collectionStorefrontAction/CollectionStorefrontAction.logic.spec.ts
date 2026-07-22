import { LanguageCode } from '@deenruv/admin-types';
import type { StorefrontEntityUrlContext } from '@deenruv/react-ui-devkit';
import { describe, expect, it, vi } from 'vitest';

import {
  getCollectionStorefrontActionState,
  type CollectionStorefrontActionInput,
} from './CollectionStorefrontAction.logic';

const collection = {
  id: 'collection-1',
  isPrivate: false,
  breadcrumbs: [
    { id: 'root', slug: 'root' },
    { id: 'parent', slug: 'chairs' },
    { id: 'collection-1', slug: 'stale-current-slug' },
  ],
  translations: [{ languageCode: LanguageCode.en, slug: 'red-chairs' }],
};

const createInput = (overrides: Partial<CollectionStorefrontActionInput> = {}): CollectionStorefrontActionInput => ({
  collection,
  selectedChannelCode: 'default-channel',
  languageCode: LanguageCode.en,
  formTranslations: [{ languageCode: LanguageCode.en, slug: 'red-chairs' }],
  formIsPrivate: false,
  resolveStorefrontEntityUrl: ({ slug }) => `https://shop.example/collections/${slug}`,
  ...overrides,
});

describe('getCollectionStorefrontActionState', () => {
  it('resolves a ready context with rootless ancestor-to-current breadcrumbs', () => {
    const resolver = vi.fn((context: StorefrontEntityUrlContext) => `https://shop.example/collections/${context.slug}`);

    expect(getCollectionStorefrontActionState(createInput({ resolveStorefrontEntityUrl: resolver }))).toEqual({
      kind: 'ready',
      context: {
        entityType: 'collection',
        entityId: 'collection-1',
        slug: 'red-chairs',
        channelCode: 'default-channel',
        languageCode: LanguageCode.en,
        breadcrumbs: [
          { id: 'parent', slug: 'chairs' },
          { id: 'collection-1', slug: 'red-chairs' },
        ],
      },
      url: 'https://shop.example/collections/red-chairs',
    });
  });

  it('disables the action for a private saved collection', () => {
    expect(
      getCollectionStorefrontActionState(
        createInput({ collection: { ...collection, isPrivate: true }, formIsPrivate: true }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'collectionPrivate' });
  });

  it('disables the action when the selected channel is missing', () => {
    expect(getCollectionStorefrontActionState(createInput({ selectedChannelCode: null }))).toEqual({
      kind: 'disabled',
      reason: 'missingChannel',
    });
  });

  it('disables the action when the selected translation has no persisted slug', () => {
    expect(
      getCollectionStorefrontActionState(createInput({ collection: { ...collection, translations: [] } })),
    ).toEqual({ kind: 'disabled', reason: 'missingSlug' });
  });

  it('disables the action when the form privacy differs from the saved collection', () => {
    expect(getCollectionStorefrontActionState(createInput({ formIsPrivate: true }))).toEqual({
      kind: 'disabled',
      reason: 'unsavedPrivate',
    });
  });

  it('disables the action when the selected-language form slug is unsaved', () => {
    expect(
      getCollectionStorefrontActionState(
        createInput({
          formTranslations: [{ languageCode: LanguageCode.en, slug: 'draft-red-chairs' }],
        }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'unsavedSlug' });
  });

  it('hides the action when the resolver does not support collections', () => {
    expect(
      getCollectionStorefrontActionState(
        createInput({
          collection: { ...collection, isPrivate: true },
          formIsPrivate: true,
          resolveStorefrontEntityUrl: () => undefined,
        }),
      ),
    ).toEqual({ kind: 'hidden' });
  });

  it('disables the action when the resolver returns null', () => {
    expect(getCollectionStorefrontActionState(createInput({ resolveStorefrontEntityUrl: () => null }))).toEqual({
      kind: 'disabled',
      reason: 'resolverEmpty',
    });
  });

  it('disables the action when the resolver throws', () => {
    expect(
      getCollectionStorefrontActionState(
        createInput({
          resolveStorefrontEntityUrl: () => {
            throw new Error('invalid configuration');
          },
        }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'resolverFailed' });
  });

  it('rejects relative and non-http resolver URLs', () => {
    expect(
      getCollectionStorefrontActionState(createInput({ resolveStorefrontEntityUrl: () => '/collections/red-chairs' })),
    ).toEqual({ kind: 'disabled', reason: 'urlNotAbsolute' });
    expect(
      getCollectionStorefrontActionState(
        createInput({ resolveStorefrontEntityUrl: () => 'ftp://shop.example/collections/red-chairs' }),
      ),
    ).toEqual({ kind: 'disabled', reason: 'unsupportedProtocol' });
  });
});
