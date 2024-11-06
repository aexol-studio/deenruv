import { adminApiMutation, apiCall } from '@/graphql/client';
import { Stack } from '@/components/Stack';
import { ProductDetailSelector, ProductDetailType } from '@/graphql/products';
import { resetCache } from '@/lists/cache';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Routes } from '@/utils';
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
} from '@deenruv/react-ui-devkit';
import { LanguageCode, SortOrder } from '@deenruv/admin-types';
import { EntityCustomFields } from '@/components';

export const ProductsDetailPage = () => {
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

  // const productCustomFields = useMemo(
  //   () => entityCustomFields?.find((el) => el.entityName === 'Product')?.customFields || [],
  //   [entityCustomFields],
  // );

  const fetchProduct = useCallback(async () => {
    // const mergedSelector = mergeSelectorWithCustomFields(ProductDetailSelector, 'Product', productCustomFields);
    const response = await apiCall()('query')({ product: [{ id }, ProductDetailSelector] });

    if (!response.product) {
      toast.error(t('toasts.fetchProductErrorToast'));
      return;
    }

    // const customFields = 'customFields' in response.product ? response.product.customFields : {};
    // setField('customFields', customFields);

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
      facets: [
        {
          options: {
            sort: {
              createdAt: SortOrder.ASC,
              // usedForProductCreations: SortOrder.ASC,
            },
          },
        },
        FacetListOptionsSelector,
      ],
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

    console.log('ąstate.translations', state.translations);

    apiCall()('mutation')({
      createProduct: [
        {
          input: {
            translations: state.translations.validatedValue,
            assetIds: state.assetIds?.validatedValue,
            // customFields: state.customFields?.validatedValue,
            // customFields: {
            //   discountBy:
            //     state.customFields?.validatedValue?.discountBy && +state.customFields?.validatedValue?.discountBy,
            //   // facebookImageId: state.customFields?.validatedValue?.facebookImageId,
            //   hoverProductImageId: state.customFields?.validatedValue?.hoverProductImageId,
            //   mainProductImageId: state.customFields?.validatedValue?.mainProductImageId,
            //   optionsOrder: state.customFields?.validatedValue?.optionsOrder,
            //   // searchMetricsScore:
            //   //   state.customFields?.validatedValue?.searchMetricsScore &&
            //   //   +state.customFields?.validatedValue?.searchMetricsScore,
            //   // twitterImageId: state.customFields?.validatedValue?.twitterImageId,
            // },
            enabled: state.enabled?.validatedValue,
            facetValueIds: state.facetValueIds?.validatedValue,
            featuredAssetId: state.featuredAssetId?.validatedValue,
          },
        },
        {
          name: true,
          id: true,
        },
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
            // customFields: state.customFields?.validatedValue,
            // customFields: {
            //   discountBy:
            //     state.customFields?.validatedValue?.discountBy && +state.customFields?.validatedValue?.discountBy,
            //   // facebookImageId: state.customFields?.validatedValue?.facebookImageId,
            //   hoverProductImageId: state.customFields?.validatedValue?.hoverProductImageId,
            //   mainProductImageId: state.customFields?.validatedValue?.mainProductImageId,
            //   optionsOrder: state.customFields?.validatedValue?.optionsOrder,

            //   // searchMetricsScore:
            //   //   state.customFields?.validatedValue?.searchMetricsScore &&
            //   //   +state.customFields?.validatedValue?.searchMetricsScore,
            //   // twitterImageId: state.customFields?.validatedValue?.twitterImageId,
            // },
          },
        },
        {
          name: true,
        },
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
    <Stack column className="gap-y-4">
      <PageHeader editMode={editMode} product={product} onCreate={createProduct} />
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="product">{t('product')}</TabsTrigger>
          <TabsTrigger value="options">{t('options')}</TabsTrigger>
          <TabsTrigger value="variants">{t('variants')}</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="product">
          {editMode && (
            <Stack className="-mt-16 mb-4">
              <Button variant={'action'} onClick={saveChanges} className="ml-auto justify-self-end">
                {t('editProduct')}
              </Button>
            </Stack>
          )}
          <Stack className="gap-4">
            <Stack className="w-3/4 flex-col gap-4">
              <BasicFieldsCard
                currentTranslationLng={currentTranslationLng}
                currentTranslationValue={currentTranslationValue}
                onNameChange={(e) => setTranslationField('name', e.target.value)}
                onSlugChange={(e) => setTranslationField('slug', e.target.value)}
                onDescChange={(e) => setTranslationField('description', e)}
              />
              {id && <EntityCustomFields entityName="product" id={id} currentLanguage={currentTranslationLng} />}
              {/* <CustomFieldsComponent
                value={state.customFields?.value}
                translation={currentTranslationValue}
                setValue={(field, data) => {
                  const translatable = field.type === 'localeText' || field.type === 'localeString';
                  if (translatable) setTranslationCustomField(field.name, data as string);
                  else setCustomField(field.name, data as string);
                }}
                customFields={productCustomFields}
              /> */}

              {/* <Stack className="grid grid-cols-3 gap-4">
                <TextCard
                  label={t('customFields.textCards.completionDate')}
                  value={currentTranslationValue?.customFields?.realization}
                  onChange={(e) => setTranslationCustomField('realization', e)}
                />
                <TextCard
                  label={t('customFields.textCards.delivery')}
                  value={currentTranslationValue?.customFields?.delivery}
                  onChange={(e) => setTranslationCustomField('delivery', e)}
                />
                <TextCard
                  label={t('customFields.textCards.payment')}
                  value={currentTranslationValue?.customFields?.payment}
                  onChange={(e) => setTranslationCustomField('payment', e)}
                />
                <TextCard
                  label={t('customFields.textCards.materials')}
                  value={currentTranslationValue?.customFields?.materials}
                  onChange={(e) => setTranslationCustomField('materials', e)}
                />
                <TextCard
                  label={t('customFields.textCards.finish')}
                  value={currentTranslationValue?.customFields?.finish}
                  onChange={(e) => setTranslationCustomField('finish', e)}
                />
                <TextCard
                  label={t('customFields.textCards.sizes')}
                  value={currentTranslationValue?.customFields?.sizes}
                  onChange={(e) => setTranslationCustomField('sizes', e)}
                />
              </Stack> */}
              {/* <ImagesCard
                customFields={state.customFields?.value}
                onHoverImageChange={(e) => {
                  setCustomField('hoverProductImageId', e?.id);
                  setCustomField('hoverProductImage', e as unknown as string);
                }}
                onMainImageChange={(e) => {
                  setCustomField('mainProductImageId', e?.id);
                  setCustomField('mainProductImage', e as unknown as string);
                }}
              /> */}
              <AssetsCard
                onAddAsset={() => ''}
                featuredAssetId={state.featuredAssetId?.value}
                assetsIds={state.assetIds?.value}
                onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
                onAssetsChange={(ids) => setField('assetIds', ids)}
              />
              {/* <SeoCard
                currentTranslationValue={currentTranslationValue}
                facebookImageId={state.customFields?.validatedValue?.facebookImageId}
                twitterImageId={state.customFields?.validatedValue?.twitterImageId}
                onTitleChange={(e) => setTranslationCustomField('seoTitle', e)}
                onDescriptionChange={(e) => setTranslationCustomField('seoDescription', e)}
                onFacebookImageChange={(e) => {
                  setCustomField('facebookImageId', e?.id);
                  setCustomField('facebookImage', e as unknown as string);
                }}
                onTwitterImageChange={(e) => {
                  setCustomField('twitterImageId', e?.id);
                  setCustomField('twitterImage', e as unknown as string);
                }}
              /> */}
              <FacetsAccordions
                facetsOptions={facetsOptions}
                handleFacetCheckboxChange={handleFacetCheckboxChange}
                checkedFacetsIds={state.facetValueIds?.value}
              />
            </Stack>
            <Stack className="w-1/4 flex-col gap-4">
              <SettingsCard
                currentTranslationLng={currentTranslationLng}
                enabledValue={state.enabled?.value}
                onEnabledChange={(e) => setField('enabled', e)}
                onCurrentLanguageChange={setCurrentTranslationLng}
              />
              {/* <DiscountRatingCard
                discountByValue={state.customFields?.value?.discountBy}
                onDiscountByChange={(e) => setCustomField('discountBy', e.target.value)}
                searchMetricsScoreValue={state.customFields?.value?.searchMetricsScore}
                onSearchMetricsScoreChange={(e) => setCustomField('searchMetricsScore', e.target.value)}
              /> */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-row justify-between text-base">{t('channels')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack className="flex-wrap gap-2">
                    {product?.channels.map((p) => <Badge key={p.id}>{p.code}</Badge>)}
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-row justify-between text-base">{t('collections')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack className="flex-wrap gap-2">
                    {product?.collections.map((c) => <Badge key={c.slug}>{c.name}</Badge>)}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </TabsContent>
        <TabsContent value="options">
          <OptionsTab currentTranslationLng={currentTranslationLng} />
        </TabsContent>
        <TabsContent value="variants">
          <VariantsTab currentTranslationLng={currentTranslationLng} facetsOptions={facetsOptions} productId={id} />
        </TabsContent>
      </Tabs>
    </Stack>
  );
};
