import { adminApiMutation, apiCall } from '@/graphql/client';
import { ProductDetailSelector, ProductDetailType } from '@/graphql/products';
import { resetCache } from '@/lists/cache';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { FacetListOptionsSelector, FacetListOptionsType } from '@/graphql/facets';
import { PageHeader } from '@/pages/products/_components/PageHeader';
import { SettingsCard } from '@/pages/products/_components/SettingsCard';
import { BasicFieldsCard } from '@/pages/products/_components/BasicFieldsCard';
import { AssetsCard } from '@/pages/products/_components/AssetsCard';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { FacetsAccordions } from '@/pages/products/_components/FacetsAccordions';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { useServer } from '@/state';
import {
  Routes,
  Spinner,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DetailViewMaker,
} from '@deenruv/react-ui-devkit';
import { LanguageCode, SortOrder } from '@deenruv/admin-types';
import { EntityCustomFields } from '@/components';

export const ProductVariantsDetailPage = () => {
  const { id } = useParams();
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('products');
  const [loading, setLoading] = useState(id ? true : false);
  const [product, setProduct] = useState<ProductDetailType>();
  const [facetsOptions, setFacetsOptions] = useState<FacetListOptionsType['items']>();
  const navigate = useNavigate();
  const { state, setField } = useGFFLP(
    'UpdateProductInput',
    'translations',
    'featuredAssetId',
    'enabled',
    'assetIds',
    'facetValueIds',
  )({});
  const [currentTranslationLng, setCurrentTranslationLng] = useState(LanguageCode.en);
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  const entityCustomFields = useServer((p) => p.serverConfig?.entityCustomFields);

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
  }, [entityCustomFields]);

  const fetchFacetOptions = useCallback(async () => {
    const response = await apiCall()('query')({
      facets: [{ options: { sort: { createdAt: SortOrder.ASC } } }, FacetListOptionsSelector],
    });

    setFacetsOptions(response.facets.items);
  }, []);

  useEffect(() => {
    if (!id || !entityCustomFields) return;

    try {
      setLoading(true);
      fetchProduct();
      fetchFacetOptions();
    } finally {
      setLoading(false);
    }
  }, [entityCustomFields]);

  const createProduct = useCallback(() => {
    if (!state.translations?.validatedValue) return;
    apiCall()('mutation')({
      createProduct: [
        {
          input: {
            translations: state.translations.validatedValue,
            assetIds: state.assetIds?.validatedValue,
            enabled: state.enabled?.validatedValue,
            facetValueIds: state.facetValueIds?.validatedValue,
            featuredAssetId: state.featuredAssetId?.validatedValue,
          },
        },
        { name: true, id: true },
      ],
    })
      .then((res) => {
        toast.message(t('toasts.createProductSuccessToast'));
        resetCache('products');
        navigate(Routes.products.to(res.createProduct.id));
      })
      .catch(() => toast.error(t('toasts.createProductErrorToast')));
  }, [state, navigate, t]);

  const saveChanges = useCallback(() => {
    if (!product || !state.translations?.validatedValue) return;

    adminApiMutation({
      updateProduct: [
        {
          input: {
            id: id!,
            translations: state.translations.validatedValue,
            facetValueIds: state.facetValueIds?.validatedValue,
            enabled: state.enabled?.validatedValue,
            assetIds: state.assetIds?.validatedValue,
            featuredAssetId: state.featuredAssetId?.validatedValue,
          },
        },
        { name: true },
      ],
    })
      .then(() => {
        fetchProduct();
        resetCache('products');
        toast(t('toasts.updateProductSuccessToast'), {
          description: new Date().toLocaleString(),
        });
      })
      .catch(() => toast.error(t('toasts.updateProductErrorToast')));
  }, [state, resetCache, fetchProduct, id, t]);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations],
  );

  const handleFacetCheckboxChange = (itemId: string, checked: boolean) => {
    const current = state.facetValueIds?.value;
    if (checked) {
      current?.push(itemId);
      setField('facetValueIds', current);
    } else {
      const filtered = current?.filter((id) => id !== itemId.toString());
      setField('facetValueIds', filtered);
    }
  };

  return loading ? (
    <Spinner height={'80vh'} />
  ) : (
    <div className="relative flex flex-col gap-y-4">
      <Tabs defaultValue="product">
        <TabsList className="fixed z-50 h-12 w-full items-center justify-start rounded-none px-4 shadow-xl">
          <TabsTrigger value="product">{t('product')}</TabsTrigger>
          <TabsTrigger disabled={!id} value="options">
            {t('options')}
          </TabsTrigger>
          <TabsTrigger disabled={!id} value="variants">
            {t('variants')}
          </TabsTrigger>
        </TabsList>
        <div className="mt-12 px-4 py-2 md:px-8 md:py-4">
          <PageHeader editMode={editMode} product={product} onCreate={createProduct} />
          <TabsContent className="w-full" value="product">
            {editMode && (
              <div className="mb-4 flex">
                <Button variant={'action'} onClick={saveChanges} className="ml-auto justify-self-end">
                  {t('editProduct')}
                </Button>
              </div>
            )}
            <div className="flex w-full gap-4">
              <div className="flex w-full flex-col gap-4">
                <BasicFieldsCard
                  currentTranslationLng={currentTranslationLng}
                  currentTranslationValue={currentTranslationValue}
                  onNameChange={(e) => setTranslationField('name', e.target.value)}
                  onSlugChange={(e) => setTranslationField('slug', e.target.value)}
                  onDescChange={(e) => setTranslationField('description', e)}
                />
                <EntityCustomFields entityName="product" id={id} currentLanguage={currentTranslationLng} />
                <DetailViewMaker position="products-detail-view" />
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
                  currentTranslationLng={currentTranslationLng}
                  enabledValue={state.enabled?.value}
                  onEnabledChange={(e) => setField('enabled', e)}
                  onCurrentLanguageChange={setCurrentTranslationLng}
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
          </TabsContent>
          <TabsContent value="options">
            <OptionsTab currentTranslationLng={currentTranslationLng} />
          </TabsContent>
          <TabsContent value="variants">
            <VariantsTab currentTranslationLng={currentTranslationLng} facetsOptions={facetsOptions} productId={id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
