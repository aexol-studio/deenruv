import { Button, ConfirmationDialog, Input, Stack } from '@/components';
import { apiCall } from '@/graphql/client';
import { ProductVariantType } from '@/graphql/products';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { LanguageCode } from '@deenruv/admin-types';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { resetCache } from '@/lists/cache';
import { toast } from 'sonner';
import { AssetsCard } from '@/pages/products/_components/AssetsCard';
import { PriceCard } from '@/pages/products/_components/PriceCard';
import { StockCard } from '@/pages/products/_components/StockCard';
import { OptionsCard } from '@/pages/products/_components/OptionsCard';
import { FacetsAccordions } from '@/pages/products/_components/FacetsAccordions';
import { FacetListOptionsType } from '@/graphql/facets';

interface VariantProps {
  variant: ProductVariantType;
  currentTranslationLng: LanguageCode;
  facetsOptions: FacetListOptionsType['items'] | undefined;
  onActionCompleted: () => void;
}

export const Variant: React.FC<VariantProps> = ({
  variant,
  currentTranslationLng,
  facetsOptions,
  onActionCompleted,
}) => {
  const { t } = useTranslation('products');
  const { state, setField } = useGFFLP(
    'UpdateProductVariantInput',
    'translations',
    'price',
    'sku',
    'assetIds',
    'featuredAssetId',
    'taxCategoryId',
    'stockLevels',
    'stockOnHand',
    'outOfStockThreshold',
    'useGlobalOutOfStockThreshold',
    'trackInventory',
    'facetValueIds',
  )({});
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    setField('sku', variant.sku);
    setField('price', variant.price);
    setField('translations', variant.translations);
    setField(
      'assetIds',
      variant.assets.map((a) => a.id),
    );
    setField('featuredAssetId', variant.featuredAsset?.id);
    setField('taxCategoryId', variant.taxCategory.id);
    setField(
      'stockLevels',
      variant.stockLevels.map((sL) => ({ stockLocationId: sL.stockLocationId, stockOnHand: sL.stockOnHand })),
    );
    setField('stockOnHand', variant.stockOnHand);
    setField('outOfStockThreshold', variant.outOfStockThreshold);
    setField('useGlobalOutOfStockThreshold', variant.useGlobalOutOfStockThreshold);
    setField('trackInventory', variant.trackInventory);
    setField(
      'facetValueIds',
      variant.facetValues.map((f) => f.id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const updateVariant = useCallback(() => {
    apiCall()('mutation')({
      updateProductVariants: [
        {
          input: [
            {
              id: variant.id,
              translations: state.translations?.validatedValue,
              price: +state.price?.validatedValue,
              sku: state.sku?.validatedValue,
              assetIds: state.assetIds?.validatedValue,
              featuredAssetId: state.featuredAssetId?.validatedValue,
              outOfStockThreshold: state.outOfStockThreshold?.validatedValue,
              stockOnHand: state.stockOnHand?.validatedValue,
              trackInventory: state.trackInventory?.validatedValue,
              taxCategoryId: state.taxCategoryId?.validatedValue,
              useGlobalOutOfStockThreshold: state.useGlobalOutOfStockThreshold?.validatedValue,
              facetValueIds: state.facetValueIds?.validatedValue,
              stockLevels: state.stockLevels?.validatedValue,
            },
          ],
        },
        { id: true },
      ],
    })
      .then(() => {
        resetCache('products');
        onActionCompleted();
        toast(t('toasts.updateProductSuccessToast'), {
          description: new Date().toLocaleString(),
        });
      })
      .catch(() => toast.error(t('toasts.updateProductErrorToast')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, variant]);

  const deleteVariant = useCallback(() => {
    apiCall()('mutation')({
      deleteProductVariant: [
        {
          id: variant.id,
        },
        {
          message: true,
        },
      ],
    })
      .then(() => {
        resetCache('products');
        onActionCompleted();
        toast(t('toasts.deleteProductVariantSuccessToast'), {
          description: new Date().toLocaleString(),
        });
      })
      .catch(() => toast.error(t('toasts.deleteProductVariantErrorToast')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const setTranslationField = useCallback(
    (field: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          [field]: e.target.value,
          languageCode: currentTranslationLng,
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAddAsset = (id: string | undefined) => {
    if (!id) return;

    const newIds = state.assetIds?.value;
    if (newIds?.includes(id)) return;
    newIds?.push(id);
    setField('assetIds', newIds);
  };

  return (
    <Stack column className="mt-4 gap-4">
      <Stack className="gap-3 self-end">
        <ConfirmationDialog onConfirm={deleteVariant}>
          <Button variant={'destructive'}>{t('forms.removeVariant')}</Button>
        </ConfirmationDialog>
        <Button variant={'action'} onClick={updateVariant}>
          {t('forms.updateVariant')}
        </Button>
      </Stack>

      <Stack className="gap-4">
        <Stack className="w-1/2 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('name')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack column key={variant.id} className="gap-y-4">
                <Input
                  label={t('sku')}
                  placeholder={t('sku')}
                  key={currentTranslationLng}
                  value={state?.sku?.value}
                  onChange={(e) => setField('sku', e.target.value)}
                />
                <Input
                  label={t('name')}
                  placeholder={t('name')}
                  key={currentTranslationLng}
                  value={currentTranslationValue?.name}
                  onChange={(e) => setTranslationField('name', e)}
                />
              </Stack>
            </CardContent>
          </Card>
          <FacetsAccordions
            facetsOptions={facetsOptions}
            handleFacetCheckboxChange={handleFacetCheckboxChange}
            checkedFacetsIds={state.facetValueIds?.value}
          />
        </Stack>
        <Stack className="w-1/2 flex-col gap-4">
          <PriceCard
            currencyCode={variant.currencyCode}
            priceValue={state.price?.value}
            onPriceChange={(e) => setField('price', e.target.value)}
            taxRateValue={state.taxCategoryId?.value}
            onTaxRateChange={(id) => setField('taxCategoryId', id)}
          />
          <StockCard
            priceValue={state.price?.value}
            taxRateValue={state.taxCategoryId?.value}
            outOfStockThresholdValue={state.outOfStockThreshold?.value}
            stockLevelsValue={state.stockLevels?.value}
            stockOnHandValue={state.stockOnHand?.value}
            stockAllocated={variant.stockAllocated}
            useGlobalOutOfStockThresholdValue={state.useGlobalOutOfStockThreshold?.value}
            trackInventoryValue={state.trackInventory?.value}
            onThresholdChange={(e) => setField('outOfStockThreshold', +e.target.value)}
            onUseGlobalChange={(e) => setField('useGlobalOutOfStockThreshold', e)}
            onTrackInventoryChange={(e) => setField('trackInventory', e)}
            allStockLocations={variant.stockLevels}
            onStockOnHandChange={(e) => setField('stockOnHand', +e.target.value)}
            onStockLocationsChange={(e) => setField('stockLevels', e)}
          />
          <AssetsCard
            onAddAsset={handleAddAsset}
            featuredAssetId={state.featuredAssetId?.value}
            assetsIds={state.assetIds?.value}
            onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
            onAssetsChange={(ids) => setField('assetIds', ids)}
          />
          <OptionsCard optionGroups={variant.options} />
        </Stack>
      </Stack>
    </Stack>
  );
};
