import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DetailViewMarker,
  Spinner,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';
import { BasicFieldsCard } from './BasicFieldsCard';
import { EntityCustomFields } from '@/components';
import { AssetsCard } from './AssetsCard';
import { SettingsCard } from './SettingsCard';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { useTranslation } from 'react-i18next';
import { ProductDetailSelector, ProductDetailType } from '@/graphql/products';
import { useDetailViewStore } from '@/state/detail-view';
import { toast } from 'sonner';
import { apiCall } from '@/graphql/client';

export const ProductDetailView = () => {
  const { id, contentLanguage, setContentLanguage } = useDetailViewStore(
    ({ id, contentLanguage, setContentLanguage }) => ({
      id,
      contentLanguage,
      setContentLanguage,
    }),
  );
  const { t } = useTranslation('products');
  const editMode = !!id;
  const [loading, setLoading] = useState(id ? true : false);
  const [product, setProduct] = useState<ProductDetailType>();

  const fetchProduct = useCallback(async () => {
    const response = await apiCall()('query')({ product: [{ id }, ProductDetailSelector] });
    if (!response.product) {
      toast.error(t('toasts.fetchProductErrorToast'));
      return;
    }
    setProduct(response.product);
    setLoading(false);
    setField('translations', response.product.translations);
    setField(
      'facetValueIds',
      response.product.facetValues.map((f) => f.id),
    );
    setField(
      'assetIds',
      response.product.assets.map((a) => a.id),
    );
    setField('featuredAssetId', response.product.featuredAsset?.id);
  }, []);

  useEffect(() => {
    if (!id) return;

    try {
      setLoading(true);
      fetchProduct();
    } finally {
      setLoading(false);
    }
  }, [id]);

  const { state, setField } = useGFFLP(
    'UpdateProductInput',
    'translations',
    'featuredAssetId',
    'enabled',
    'assetIds',
    'facetValueIds',
  )({});
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === contentLanguage);
  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== contentLanguage, {
          [field]: e,
          languageCode: contentLanguage,
        }),
      );
    },

    [contentLanguage, translations],
  );

  const saveChanges = () => {};
  return loading ? (
    <div>
      <Spinner height={'80vh'} />
    </div>
  ) : (
    <div>
      {editMode && (
        <div className="mb-4 flex">
          <Button variant="action" onClick={saveChanges} className="ml-auto justify-self-end">
            {t('editProduct')}
          </Button>
        </div>
      )}
      <div className="flex w-full gap-4">
        <div className="flex w-full flex-col gap-4">
          <BasicFieldsCard currentTranslationValue={currentTranslationValue} onChange={setTranslationField} />
          <DetailViewMarker position={'products-detail-view'} />
          <EntityCustomFields entityName="product" id={id} currentLanguage={contentLanguage} />
          <AssetsCard
            onAddAsset={() => ''}
            featuredAssetId={state.featuredAssetId?.value}
            assetsIds={state.assetIds?.value}
            onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
            onAssetsChange={(ids) => setField('assetIds', ids)}
          />
        </div>
        <div className="flex w-1/4 flex-col gap-4">
          <SettingsCard
            currentTranslationLng={contentLanguage}
            enabledValue={state.enabled?.value}
            onEnabledChange={(e) => setField('enabled', e)}
            onCurrentLanguageChange={setContentLanguage}
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('channels')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product?.channels.map((p) => <Badge key={p.id}>{p.code}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('collections')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product?.collections.map((c) => <Badge key={c.slug}>{c.name}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
