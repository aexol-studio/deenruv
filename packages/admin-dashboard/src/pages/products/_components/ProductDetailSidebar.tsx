import { useDetailView } from '@deenruv/react-ui-devkit';
import { ReactNode, useEffect } from 'react';

import { SettingsCard } from './SettingsCard';
import { ChannelsCard } from '@/pages/products/_components/ChannelsCard';
import { CollectionsCard } from '@/pages/products/_components/CollectionsCard';
import { FacetValuesCard } from '@/pages/products/_components/FacetValuesCard';

const PRODUCT_FORM_KEYS = [
  'CreateProductInput',
  'translations',
  'assetIds',
  'featuredAssetId',
  'facetValueIds',
  'enabled',
] as const;

export const ProductDetailSidebar: React.FC<{ marker?: ReactNode }> = ({ marker }) => {
  const { form, entity } = useDetailView('products-detail-view', ...PRODUCT_FORM_KEYS);
  const {
    base: { state, setField },
  } = form;

  useEffect(() => {
    if (!entity) return;
    setField(
      'facetValueIds',
      entity.facetValues.map((f) => f.id),
    );
    setField('enabled', entity.enabled);
  }, [entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsCard enabledValue={state.enabled?.value ?? undefined} onEnabledChange={(e) => setField('enabled', e)} />
      <FacetValuesCard
        facetValuesIds={state.facetValueIds?.value ?? undefined}
        onChange={(e) => setField('facetValueIds', e)}
      />
      {!!entity?.channels?.length && <ChannelsCard channels={entity.channels} />}
      {!!entity?.collections?.length && <CollectionsCard collections={entity.collections} />}
    </div>
  );
};
