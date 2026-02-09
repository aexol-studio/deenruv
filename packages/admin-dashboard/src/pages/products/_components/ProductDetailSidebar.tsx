import { EntityChannelManager, Routes, useDetailView } from '@deenruv/react-ui-devkit';
import { ReactNode, useEffect, useRef } from 'react';

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
  const { base } = form;
  // Guard: only set creation-mode defaults once to avoid rerender churn.
  const creationDefaultsApplied = useRef(false);

  useEffect(() => {
    if (!entity) {
      if (!creationDefaultsApplied.current) {
        creationDefaultsApplied.current = true;
        base.setField('facetValueIds', []);
        base.setField('enabled', true);
      }
      return;
    }
    // When entity arrives, reset the guard so a subsequent unmount/remount
    // of the sidebar (e.g. tab switch) can reinitialise if needed.
    creationDefaultsApplied.current = false;
    base.setField(
      'facetValueIds',
      entity.facetValues.map((f) => f.id),
    );
    base.setField('enabled', entity.enabled);
  }, [entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsCard
        enabledValue={base.watch('enabled') ?? undefined}
        onEnabledChange={(e) => base.setField('enabled', e)}
      />
      <FacetValuesCard
        facetValuesIds={base.watch('facetValueIds') ?? undefined}
        onChange={(e) => base.setField('facetValueIds', e)}
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
