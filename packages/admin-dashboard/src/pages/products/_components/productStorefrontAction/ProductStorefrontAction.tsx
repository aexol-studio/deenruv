import { useDetailView, useGlobalStore, useSettings, useTranslation } from '@deenruv/react-ui-devkit';

import { StorefrontAction } from '@/components/storefrontAction';

import {
  getProductStorefrontActionState,
  type ProductStorefrontActionDisabledReason,
} from './ProductStorefrontAction.logic';

const PRODUCT_STOREFRONT_FORM_KEYS = ['CreateProductInput', 'translations', 'enabled'] as const;

export const ProductStorefrontAction = () => {
  const { t } = useTranslation('products');
  const selectedChannelCode = useSettings((state) => state.selectedChannel?.code);
  const languageCode = useSettings((state) => state.translationsLanguage);
  const resolveStorefrontEntityUrl = useGlobalStore((state) => state.ui?.resolveStorefrontEntityUrl);
  const { entity, form, id } = useDetailView('products-detail-view', ...PRODUCT_STOREFRONT_FORM_KEYS);
  const formTranslations: unknown = form.base.watch('translations');
  const formEnabled: unknown = form.base.watch('enabled');

  if (!id || !entity || !resolveStorefrontEntityUrl) return null;

  const state = getProductStorefrontActionState({
    product: entity,
    selectedChannelCode,
    languageCode,
    formTranslations,
    formEnabled,
    resolveStorefrontEntityUrl,
  });
  const label = t('storefrontAction.label');

  if (state.kind === 'hidden') return null;

  const disabledTooltips: Record<ProductStorefrontActionDisabledReason, string> = {
    productDisabled: t('storefrontAction.disabled.productDisabled'),
    missingChannel: t('storefrontAction.disabled.missingChannel'),
    channelNotAssigned: t('storefrontAction.disabled.channelNotAssigned'),
    missingSlug: t('storefrontAction.disabled.missingSlug'),
    unsavedSlug: t('storefrontAction.disabled.unsavedSlug'),
    unsavedEnabled: t('storefrontAction.disabled.unsavedEnabled'),
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
