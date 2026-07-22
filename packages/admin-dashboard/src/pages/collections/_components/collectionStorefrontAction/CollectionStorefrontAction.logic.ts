import type { LanguageCode } from '@deenruv/admin-types';
import type { StorefrontEntityUrlContext, StorefrontEntityUrlResolver } from '@deenruv/react-ui-devkit';

import {
  getStorefrontEntityUrlState,
  type StorefrontEntityUrlDisabledReason,
} from '../../../../components/storefrontAction/StorefrontAction.logic';

type CollectionStorefrontUrlContext = Extract<StorefrontEntityUrlContext, { entityType: 'collection' }>;

interface StorefrontCollection {
  id: string;
  isPrivate: boolean;
  breadcrumbs: ReadonlyArray<{ id: string; slug: string }>;
  translations: ReadonlyArray<{
    languageCode: LanguageCode;
    slug?: string | null;
  }>;
}

export type CollectionStorefrontActionDisabledReason =
  | 'collectionPrivate'
  | 'missingChannel'
  | 'missingSlug'
  | 'unsavedPrivate'
  | 'unsavedSlug'
  | StorefrontEntityUrlDisabledReason;

export interface CollectionStorefrontActionInput {
  collection: StorefrontCollection;
  selectedChannelCode?: string | null;
  languageCode?: LanguageCode | null;
  formTranslations: unknown;
  formIsPrivate: unknown;
  resolveStorefrontEntityUrl: StorefrontEntityUrlResolver;
}

export type CollectionStorefrontActionState =
  | { kind: 'hidden' }
  | { kind: 'disabled'; reason: CollectionStorefrontActionDisabledReason }
  | { kind: 'ready'; context: CollectionStorefrontUrlContext; url: string };

const getFormSlug = (formTranslations: unknown, languageCode: LanguageCode): string | undefined => {
  if (!Array.isArray(formTranslations)) return undefined;

  const translation = formTranslations.find(
    (value): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && 'languageCode' in value && value.languageCode === languageCode,
  );

  return typeof translation?.slug === 'string' ? translation.slug : undefined;
};

export const normalizeCollectionBreadcrumbs = (
  collection: Pick<StorefrontCollection, 'id' | 'breadcrumbs'>,
  persistedSlug: string,
): CollectionStorefrontUrlContext['breadcrumbs'] => {
  const ancestors = collection.breadcrumbs
    .slice(1)
    .filter(({ id }) => id !== collection.id)
    .map(({ id, slug }) => ({ id, slug }));

  return [...ancestors, { id: collection.id, slug: persistedSlug }];
};

export const getCollectionStorefrontActionState = ({
  collection,
  selectedChannelCode,
  languageCode,
  formTranslations,
  formIsPrivate,
  resolveStorefrontEntityUrl,
}: CollectionStorefrontActionInput): CollectionStorefrontActionState => {
  if (!selectedChannelCode) return { kind: 'disabled', reason: 'missingChannel' };

  const persistedTranslation = languageCode
    ? collection.translations.find((translation) => translation.languageCode === languageCode)
    : undefined;
  if (!languageCode || typeof persistedTranslation?.slug !== 'string' || !persistedTranslation.slug.trim()) {
    return { kind: 'disabled', reason: 'missingSlug' };
  }

  const context: CollectionStorefrontUrlContext = {
    entityType: 'collection',
    entityId: collection.id,
    slug: persistedTranslation.slug,
    channelCode: selectedChannelCode,
    languageCode,
    breadcrumbs: normalizeCollectionBreadcrumbs(collection, persistedTranslation.slug),
  };

  const urlState = getStorefrontEntityUrlState(context, resolveStorefrontEntityUrl);
  if (urlState.kind === 'hidden') return urlState;

  if (collection.isPrivate) return { kind: 'disabled', reason: 'collectionPrivate' };
  if (formIsPrivate !== collection.isPrivate) {
    return { kind: 'disabled', reason: 'unsavedPrivate' };
  }

  if (getFormSlug(formTranslations, languageCode) !== persistedTranslation.slug) {
    return { kind: 'disabled', reason: 'unsavedSlug' };
  }

  return urlState.kind === 'ready' ? { ...urlState, context } : urlState;
};
