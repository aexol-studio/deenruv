import { useDetailView } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

import { SettingsCard } from './SettingsCard';
import { ChannelsCard } from '@/pages/products/_components/ChannelsCard';
import { CollectionsCard } from '@/pages/products/_components/CollectionsCard';
import { FacetValuesCard } from '@/pages/products/_components/FacetValuesCard';

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
    'facetValueIds',
    'enabled',
  );
  const {
    base: { state, setField },
  } = form;

  useEffect(() => {
    if (!view.entity) return;
    setField(
      'facetValueIds',
      view.entity.facetValues.map((f) => f.id),
    );
    setField('enabled', view.entity.enabled);
  }, [view.entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsCard
        currentTranslationLng={contentLanguage}
        enabledValue={state.enabled?.value}
        onEnabledChange={(e) => setField('enabled', e)}
        onCurrentLanguageChange={setContentLanguage}
      />
      <FacetValuesCard facetValuesIds={state.facetValueIds?.value} onChange={(e) => setField('facetValueIds', e)} />
      {view.entity?.channels?.length && <ChannelsCard channels={view.entity.channels} />}
      {view.entity?.collections?.length && <CollectionsCard collections={view.entity.collections} />}
    </div>
  );
};
