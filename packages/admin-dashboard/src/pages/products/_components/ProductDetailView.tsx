import { useDetailView, DetailViewMarker, Spinner, useSettings } from '@deenruv/react-ui-devkit';
import { useCallback, useEffect } from 'react';
import { BasicFieldsCard } from './BasicFieldsCard';
import { EntityCustomFields } from '@/components';
import { AssetsCard } from './AssetsCard';
import { setInArrayBy } from '@/lists/useGflp';

export const PRODUCT_FORM_KEYS = [
  'CreateProductInput',
  'translations',
  'assetIds',
  'featuredAssetId',
  'facetValueIds',
  'enabled',
] as const;

export const ProductDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, form, loading, fetchEntity } = useDetailView('products-detail-view', ...PRODUCT_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;
      setField('translations', res.translations);
      setField(
        'assetIds',
        res.assets.map((a) => a.id),
      );
      setField('featuredAssetId', res.featuredAsset?.id);
    })();
  }, [contentLng]);

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

  const handleAddAsset = useCallback(
    (newId: string | undefined | null) => {
      if (!newId) return;
      const currentIds = state.assetIds?.value || [];
      setField('assetIds', [...currentIds, newId]);
    },
    [state.assetIds?.value, setField],
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-4">
        <BasicFieldsCard
          currentTranslationValue={currentTranslationValue}
          onChange={setTranslationField}
          errors={state.translations?.errors}
        />
        <DetailViewMarker position={'products-detail-view'} />
        <EntityCustomFields entityName="product" id={id} currentLanguage={contentLng} queue />
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
