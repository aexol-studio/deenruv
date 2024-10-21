import { adminApiMutation, apiCall } from '@/graphql/client';
import { Stack } from '@/components/Stack';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductDetailSelector, ProductDetailType } from '@/graphql/products';
import { resetCache } from '@/lists/cache';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { LanguageCode, Selector, SortOrder, ValueTypes } from '@/zeus';
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
import { Button } from '@/components';
import { CustomFieldsComponent } from '@/custom_fields';
import { useServer } from '@/state';
import { CustomFieldConfigType } from '@/graphql/base';

function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  Object.keys(source).forEach((key) => {
    const targetValue = (target as any)[key];
    const sourceValue = (source as any)[key];

    if (Array.isArray(sourceValue)) {
      (target as any)[key] = [...(Array.isArray(targetValue) ? targetValue : []), ...sourceValue];
    } else if (isObject(sourceValue)) {
      (target as any)[key] = deepMerge(isObject(targetValue) ? targetValue : {}, sourceValue);
    } else {
      (target as any)[key] = sourceValue;
    }
  });

  return target as T & U;
}

function mergeSelectors<T extends object, K extends keyof ValueTypes>(
  selectorA: T,
  key: K,
  customFields?: CustomFieldConfigType[],
): T {
  const selectorB = Selector(key)(generateCustomFieldsSelector(customFields || []) as any);
  return deepMerge(selectorA, selectorB);
}

const generateCustomFieldsSelector = (customFields: CustomFieldConfigType[]) => {
  const reduced = customFields.reduce(
    (acc, field) => {
      if (field.type === 'relation') {
        // TODO
        return acc;
      }
      if (field.type === 'localeString' || field.type === 'localeText') {
        acc.translations = {
          ...acc.translations,
          customFields: {
            ...acc.translations?.customFields,
            [field.name]: true,
          },
        };
      } else {
        acc.customFields = {
          ...acc.customFields,
          [field.name]: true,
        };
      }
      return acc;
    },
    { translations: { customFields: {} }, customFields: {} } as {
      translations?: { customFields: Record<string, boolean> };
      customFields?: Record<string, boolean>;
    },
  );
  if (!Object.keys(reduced.translations?.customFields || {}).length) delete reduced.translations;
  if (!Object.keys(reduced.customFields || {}).length) delete reduced.customFields;
  return reduced;
};

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
    'customFields',
    'assetIds',
    'facetValueIds',
  )({});
  const [currentTranslationLng, setCurrentTranslationLng] = useState(LanguageCode.en);
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  const entityCustomFields = useServer((p) => p.serverConfig?.entityCustomFields);

  const productCustomFields = useMemo(
    () => entityCustomFields?.find((el) => el.entityName === 'Product')?.customFields || [],
    [entityCustomFields],
  );

  const fetchProduct = useCallback(async () => {
    const mergedSelector = mergeSelectors(ProductDetailSelector, 'Product', productCustomFields);
    const response = await apiCall()('query')({ product: [{ id }, mergedSelector] });

    if (!response.product) {
      toast.error(t('toasts.fetchProductErrorToast'));
      return;
    }

    const customFields = 'customFields' in response.product ? response.product.customFields : {};
    setField('customFields', customFields);

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
            customFields: state.customFields?.validatedValue,
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
            customFields: state.customFields?.validatedValue,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTranslationLng, translations],
  );

  const setTranslationCustomField = useCallback(
    (translationCustomField: string, data: string | undefined) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          customFields: {
            ...translations.find((t) => t.languageCode === currentTranslationLng)?.customFields,
            [translationCustomField]: data,
          },
          languageCode: currentTranslationLng,
        }),
      );
      // setCustomField(translationCustomField, data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTranslationLng, translations],
  );

  const setCustomField = useCallback(
    (customField: string, e: string | undefined) => {
      setField('customFields', { ...state.customFields?.value, [customField]: e });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.customFields],
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
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
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
              <h4 className="ml-6 text-sm font-semibold text-gray-500">{t('details.customFields')}</h4>
              <CustomFieldsComponent
                data={{}}
                value={state.customFields?.value}
                translation={currentTranslationValue}
                setValue={(field, data) => {
                  const translatable = field.type === 'localeText' || field.type === 'localeString';
                  if (translatable) setTranslationCustomField(field.name, data as string);
                  else setCustomField(field.name, data as string);
                }}
                customFields={productCustomFields}
                language={currentTranslationValue?.languageCode || LanguageCode.pl}
              />
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
                onEnabledChange={(e) => {
                  setField('enabled', e);
                }}
                onCurrentLanguageChange={(e) => {
                  setCurrentTranslationLng(e as LanguageCode);
                }}
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
