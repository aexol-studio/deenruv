import { EntityChannelManager, Routes, useDetailView } from '@deenruv/react-ui-devkit';
import { ReactNode, useEffect } from 'react';

import { SettingsCard } from './SettingsCard';

import { CollectionsCard } from '@/pages/products/_components/CollectionsCard';
import { FacetValuesCard } from '@/pages/products/_components/FacetValuesCard';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const {
    base: { state, setField },
  } = form;

  useEffect(() => {
    if (!entity) {
      setField('facetValueIds', []);
      setField('enabled', true);
      return;
    }
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
      {!!entity?.channels?.length && (
        <EntityChannelManager
          entity="product"
          entityChannels={entity.channels}
          entityId={entity.id}
          onRemoveSuccess={() => navigate(Routes.products.list)}
          entitySlug={entity.slug}
          entityName={entity.name}
        />
      )}
      {!!entity?.collections?.length && <CollectionsCard collections={entity.collections} />}
    </div>
  );
};
