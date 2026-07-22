import type { LanguageCode } from '@deenruv/admin-types';
import type { StorefrontEntityUrlContext, StorefrontEntityUrlResolver } from '@deenruv/react-ui-devkit';

import {
  getStorefrontEntityUrlState,
  type StorefrontEntityUrlDisabledReason,
} from '../../../../components/storefrontAction/StorefrontAction.logic';

type ProductStorefrontUrlContext = Extract<StorefrontEntityUrlContext, { entityType: 'product' }>;

interface StorefrontProduct {
  id: string;
  enabled: boolean;
  channels: ReadonlyArray<{ code: string }>;
  translations: ReadonlyArray<{
    languageCode: LanguageCode;
    slug?: string | null;
  }>;
}

export type ProductStorefrontActionDisabledReason =
  | 'productDisabled'
  | 'missingChannel'
  | 'channelNotAssigned'
  | 'missingSlug'
  | 'unsavedSlug'
  | 'unsavedEnabled'
  | StorefrontEntityUrlDisabledReason;

export interface ProductStorefrontActionInput {
  product: StorefrontProduct;
  selectedChannelCode?: string | null;
  languageCode?: LanguageCode | null;
  formTranslations: unknown;
  formEnabled: unknown;
  resolveStorefrontEntityUrl: StorefrontEntityUrlResolver;
}

export type ProductStorefrontActionState =
  | { kind: 'hidden' }
  | {
      kind: 'ready';
      context: ProductStorefrontUrlContext;
      url: string;
    }
  | {
      kind: 'disabled';
      reason: ProductStorefrontActionDisabledReason;
    };

const getFormSlug = (formTranslations: unknown, languageCode: LanguageCode): string | undefined => {
  if (!Array.isArray(formTranslations)) return undefined;

  const translation = formTranslations.find(
    (value): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && 'languageCode' in value && value.languageCode === languageCode,
  );

  return typeof translation?.slug === 'string' ? translation.slug : undefined;
};

export const getProductStorefrontActionState = ({
  product,
  selectedChannelCode,
  languageCode,
  formTranslations,
  formEnabled,
  resolveStorefrontEntityUrl,
}: ProductStorefrontActionInput): ProductStorefrontActionState => {
  if (!selectedChannelCode) return { kind: 'disabled', reason: 'missingChannel' };

  const persistedTranslation = languageCode
    ? product.translations.find((translation) => translation.languageCode === languageCode)
    : undefined;
  if (!languageCode || typeof persistedTranslation?.slug !== 'string' || !persistedTranslation.slug.trim()) {
    return { kind: 'disabled', reason: 'missingSlug' };
  }

  const context: ProductStorefrontUrlContext = {
    entityType: 'product',
    entityId: product.id,
    slug: persistedTranslation.slug,
    channelCode: selectedChannelCode,
    languageCode,
  };

  const urlState = getStorefrontEntityUrlState(context, resolveStorefrontEntityUrl);
  if (urlState.kind === 'hidden') return urlState;

  if (!product.enabled) return { kind: 'disabled', reason: 'productDisabled' };
  if (!product.channels.some(({ code }) => code === selectedChannelCode)) {
    return { kind: 'disabled', reason: 'channelNotAssigned' };
  }

  if (formEnabled !== product.enabled) {
    return { kind: 'disabled', reason: 'unsavedEnabled' };
  }

  if (getFormSlug(formTranslations, languageCode) !== persistedTranslation.slug) {
    return { kind: 'disabled', reason: 'unsavedSlug' };
  }

  return urlState.kind === 'ready' ? { ...urlState, context } : urlState;
};
