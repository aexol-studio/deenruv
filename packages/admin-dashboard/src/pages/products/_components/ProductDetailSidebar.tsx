import { Badge, Card, CardContent, CardHeader, CardTitle, useDetailView } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

import { SettingsCard } from './SettingsCard';
import { useTranslation } from 'react-i18next';
import { ChannelsCard } from '@/pages/products/_components/ChannelsCard';
import { CollectionsCard } from '@/pages/products/_components/CollectionsCard';
import { FacetsCard } from '@/pages/products/_components/FacetsCard';

export const ProductDetailSidebar = () => {
  const { contentLanguage, setContentLanguage, view, form } = useDetailView(
    'products-detail-view',
    ({ contentLanguage, setContentLanguage, view, form }) => ({
      contentLanguage,
      setContentLanguage,
      view,
      form,
    }),
    'CreateProductInput',
  );
  const { t } = useTranslation('products');
  const {
    base: { state, setField },
  } = form;

  useEffect(() => {
    if (!view.entity) return;
    setField('translations', view.entity.translations);
    setField(
      'facetValueIds',
      view.entity.facetValues.map((f) => f.id),
    );
    setField(
      'assetIds',
      view.entity.assets.map((a) => a.id),
    );
    setField('featuredAssetId', view.entity.featuredAsset?.id);
  }, [view.entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsCard
        currentTranslationLng={contentLanguage}
        enabledValue={state.enabled?.value}
        onEnabledChange={(e) => setField('enabled', e)}
        onCurrentLanguageChange={setContentLanguage}
      />
      <FacetsCard facetsIds={state.facetValueIds?.value} onChange={(e) => setField('facetValueIds', e)} />
      {view.entity?.channels?.length && <ChannelsCard channels={view.entity.channels} />}
      {view.entity?.collections?.length && <CollectionsCard collections={view.entity.collections} />}
    </div>
  );
};
