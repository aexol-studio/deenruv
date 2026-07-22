import { useDetailView, useGlobalStore, useSettings, useTranslation } from '@deenruv/react-ui-devkit';

import { StorefrontAction } from '@/components/storefrontAction';

import {
  getCollectionStorefrontActionState,
  type CollectionStorefrontActionDisabledReason,
} from './CollectionStorefrontAction.logic';

const COLLECTION_STOREFRONT_FORM_KEYS = ['CreateCollectionInput', 'translations', 'isPrivate'] as const;

export const CollectionStorefrontAction = () => {
  const { t } = useTranslation('collections');
  const selectedChannelCode = useSettings((state) => state.selectedChannel?.code);
  const languageCode = useSettings((state) => state.translationsLanguage);
  const resolveStorefrontEntityUrl = useGlobalStore((state) => state.ui?.resolveStorefrontEntityUrl);
  const { entity, form, id, loading } = useDetailView('collections-detail-view', ...COLLECTION_STOREFRONT_FORM_KEYS);
  const formTranslations: unknown = form.base.watch('translations');
  const formIsPrivate: unknown = form.base.watch('isPrivate');

  if (!id || loading || !entity || !resolveStorefrontEntityUrl) return null;

  const state = getCollectionStorefrontActionState({
    collection: entity,
    selectedChannelCode,
    languageCode,
    formTranslations,
    formIsPrivate,
    resolveStorefrontEntityUrl,
  });
  const label = t('storefrontAction.label');

  if (state.kind === 'hidden') return null;

  const disabledTooltips: Record<CollectionStorefrontActionDisabledReason, string> = {
    collectionPrivate: t('storefrontAction.disabled.collectionPrivate'),
    missingChannel: t('storefrontAction.disabled.missingChannel'),
    missingSlug: t('storefrontAction.disabled.missingSlug'),
    unsavedPrivate: t('storefrontAction.disabled.unsavedPrivate'),
    unsavedSlug: t('storefrontAction.disabled.unsavedSlug'),
    resolverFailed: t('storefrontAction.disabled.resolverFailed'),
    resolverEmpty: t('storefrontAction.disabled.resolverEmpty'),
    urlNotAbsolute: t('storefrontAction.disabled.urlNotAbsolute'),
    unsupportedProtocol: t('storefrontAction.disabled.unsupportedProtocol'),
  };

  return (
    <StorefrontAction
      label={label}
      state={
        state.kind === 'ready'
          ? { kind: 'ready', url: state.url }
          : { kind: 'disabled', tooltip: disabledTooltips[state.reason] }
      }
    />
  );
};
