import { useDetailView, DetailViewMarker, Spinner, useSettings } from '@deenruv/react-ui-devkit';
import { useCallback, useEffect } from 'react';
import { BasicFieldsCard } from './BasicFieldsCard';
import { EntityCustomFields } from '@/components';
import { AssetsCard } from './AssetsCard';
import { setInArrayBy } from '@/lists/useGflp';

const PRODUCT_FORM_KEYS = ['CreateProductInput', 'translations', 'assetIds', 'featuredAssetId'] as const;

export const ProductDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, view, form } = useDetailView(
    'products-detail-view',
    ({ id, view, form }) => ({
      id,
      view,
      form,
    }),
    ...PRODUCT_FORM_KEYS,
  );

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    else {
      setField('translations', view.entity.translations);
      setField(
        'assetIds',
        view.entity.assets.map((a) => a.id),
      );
      setField('featuredAssetId', view.entity.featuredAsset?.id);
      view.setEntity(view.entity);
    }
  }, [view.entity]);

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === contentLng);
  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== contentLng, {
          [field]: e,
          languageCode: contentLng,
        }),
      );
    },

    [contentLng, translations],
  );

  const handleAddAsset = useCallback((newId: string | undefined) => {
    if (!newId) return;
    const currentIds = state.assetIds?.value || [];
    setField('assetIds', [...currentIds, newId]);
  }, []);

  return view.loading ? (
    <div>
      <Spinner height={'80vh'} />
    </div>
  ) : (
    <div>
      <div className="flex w-full flex-col gap-4">
        <BasicFieldsCard currentTranslationValue={currentTranslationValue} onChange={setTranslationField} />
        <DetailViewMarker position={'products-detail-view'} />
        <EntityCustomFields entityName="product" id={id} currentLanguage={contentLng} />
        <AssetsCard
          onAddAsset={handleAddAsset}
          featuredAssetId={state.featuredAssetId?.value}
          assetsIds={state.assetIds?.value}
          onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
          onAssetsChange={(ids) => setField('assetIds', ids)}
        />
      </div>
    </div>
  );
};
