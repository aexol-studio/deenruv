import { useDetailView, DetailViewMarker, Spinner, useSettings } from '@deenruv/react-ui-devkit';
import { useCallback, useEffect } from 'react';
import { BasicFieldsCard } from './BasicFieldsCard';
import { EntityCustomFields } from '@/components';
import { AssetsCard } from './AssetsCard';
import { setInArrayBy } from '@/lists/useGflp';
import { useTranslation } from 'react-i18next';

const PRODUCT_FORM_KEYS = [
  'CreateProductInput',
  'translations',
  'facetValueIds',
  'assetIds',
  'featuredAssetId',
] as const;

export const ProductDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, view, form } = useDetailView(
    'products-detail-view',
    ({ id, contentLanguage, setContentLanguage, view, form }) => ({
      id,
      view,
      form,
    }),
    ...PRODUCT_FORM_KEYS,
  );
  const { t } = useTranslation('products');
  const editMode = !!id;

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    view.setEntity(view.entity);
    // setField('translations', view.entity.translations);
    // setField(
    //   'facetValueIds',
    //   view.entity.facetValues.map((f) => f.id),
    // );
    // setField(
    //   'assetIds',
    //   view.entity.assets.map((a) => a.id),
    // );
    // setField('featuredAssetId', view.entity.featuredAsset?.id);
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
          onAddAsset={() => ''}
          featuredAssetId={state.featuredAssetId?.value}
          assetsIds={state.assetIds?.value}
          onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
          onAssetsChange={(ids) => setField('assetIds', ids)}
        />
      </div>
    </div>
  );
};
