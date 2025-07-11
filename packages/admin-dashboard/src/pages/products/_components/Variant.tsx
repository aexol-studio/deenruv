import {
  Button,
  CardIcons,
  ConfirmationDialog,
  CustomCard,
  Input,
  apiClient,
  setInArrayBy,
  useGFFLP,
  CF,
  EntityCustomFields,
  useTranslation,
  useSettings,
  EntityChannelManager,
} from '@deenruv/react-ui-devkit';

import { ProductVariantType } from '@/graphql/products';
import { CurrencyCode, LanguageCode } from '@deenruv/admin-types';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { AssetsCard } from '@/pages/products/_components/AssetsCard';
import { PriceCard } from '@/pages/products/_components/PriceCard';
import { StockCard } from '@/pages/products/_components/StockCard';
import { OptionsCard } from '@/pages/products/_components/OptionsCard';
import { FacetValuesCard } from '@/pages/products/_components/FacetValuesCard';

interface VariantProps {
  productId: string;
  variant?: ProductVariantType;
  currentTranslationLng: LanguageCode;
  onActionCompleted: () => void;
}

export const Variant: React.FC<VariantProps> = ({ variant, currentTranslationLng, onActionCompleted, productId }) => {
  const { t } = useTranslation('products');
  const { state, setField } = useGFFLP(
    'UpdateProductVariantInput',
    'translations',
    'price',
    'prices',
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
    'optionIds',
    'customFields',
  )({});
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    if (!variant) return;

    setField('sku', variant.sku);
    setField('price', variant.price);
    setField('prices', variant.prices);
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
  }, [variant]);

  const createVariant = useCallback(() => {
    if (productId && state.sku?.validatedValue && state.translations?.validatedValue)
      return apiClient('mutation')({
        createProductVariants: [
          {
            input: [
              {
                productId,
                translations: state.translations?.validatedValue,
                // price: +state.price?.validatedValue,
                prices: state.prices?.validatedValue,
                sku: state.sku?.validatedValue,
                assetIds: state.assetIds?.validatedValue,
                featuredAssetId: state.featuredAssetId?.validatedValue,
                outOfStockThreshold: state.outOfStockThreshold?.validatedValue,
                stockOnHand: state.stockOnHand?.validatedValue,
                trackInventory: state.trackInventory?.validatedValue,
                taxCategoryId: state.taxCategoryId?.validatedValue,
                useGlobalOutOfStockThreshold: state.useGlobalOutOfStockThreshold?.validatedValue,
                stockLevels: state.stockLevels?.validatedValue,
                facetValueIds: state.facetValueIds?.validatedValue,
                optionIds: state.optionIds?.validatedValue,
                ...(state.customFields?.validatedValue ? { customFields: state.customFields?.validatedValue } : {}),
              },
            ],
          },
          {
            id: true,
          },
        ],
      })
        .then(() => {
          toast(t('toasts.createProductVariantSuccessToast'));
          onActionCompleted();
        })
        .catch(() => {
          toast(t('toasts.createProductVariantErrorToast'));
        });
  }, [state, productId, onActionCompleted, t]);

  const updateVariant = useCallback(() => {
    if (!variant) return;
    apiClient('mutation')({
      updateProductVariants: [
        {
          input: [
            {
              id: variant.id,
              translations: state.translations?.validatedValue,
              // price: +state.price?.validatedValue,
              prices: state.prices?.validatedValue,
              sku: state.sku?.validatedValue,
              assetIds: state.assetIds?.validatedValue,
              featuredAssetId: state.featuredAssetId?.validatedValue,
              outOfStockThreshold: state.outOfStockThreshold?.validatedValue,
              stockOnHand: state.stockOnHand?.validatedValue,
              trackInventory: state.trackInventory?.validatedValue,
              taxCategoryId: state.taxCategoryId?.validatedValue,
              useGlobalOutOfStockThreshold: state.useGlobalOutOfStockThreshold?.validatedValue,
              stockLevels: state.stockLevels?.validatedValue,
              facetValueIds: state.facetValueIds?.validatedValue,
              ...(state.customFields?.validatedValue ? { customFields: state.customFields?.validatedValue } : {}),
            },
          ],
        },
        { id: true },
      ],
    })
      .then(() => {
        onActionCompleted();
        toast(t('toasts.updateProductSuccessToast'), {
          description: new Date().toLocaleString(),
        });
      })
      .catch(() => toast.error(t('toasts.updateProductErrorToast')));
  }, [state, variant]);

  const deleteVariant = useCallback(() => {
    if (!variant) return;
    apiClient('mutation')({
      deleteProductVariant: [{ id: variant.id }, { message: true }],
    })
      .then(() => {
        onActionCompleted();
        toast(t('toasts.deleteProductVariantSuccessToast'), {
          description: new Date().toLocaleString(),
        });
      })
      .catch(() => toast.error(t('toasts.deleteProductVariantErrorToast')));
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

    [currentTranslationLng, translations],
  );

  const handleAddAsset = (id: string | undefined | null) => {
    if (!id) return;

    const newIds = state.assetIds?.value || [];
    if (newIds?.includes(id)) return;
    newIds?.push(id);
    setField('assetIds', newIds);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex gap-3 self-end">
        {variant ? (
          <>
            <ConfirmationDialog onConfirm={deleteVariant}>
              <Button variant={'destructive'}>{t('forms.removeVariant')}</Button>
            </ConfirmationDialog>
            <Button onClick={updateVariant}>{t('forms.updateVariant')}</Button>
          </>
        ) : (
          <Button onClick={createVariant}>{t('addVariantDialog.add')}</Button>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex w-2/3 flex-col gap-4">
          {!!variant && (
            <StockCard
              priceValue={state.price?.value}
              taxRateValue={state.taxCategoryId?.value}
              outOfStockThresholdValue={state.outOfStockThreshold?.value}
              stockLevelsValue={state.stockLevels?.value}
              stockOnHandValue={state.stockOnHand?.value}
              useGlobalOutOfStockThresholdValue={state.useGlobalOutOfStockThreshold?.value}
              onThresholdChange={(e) => setField('outOfStockThreshold', +e.target.value)}
              onUseGlobalChange={(e) => setField('useGlobalOutOfStockThreshold', e)}
              onTrackInventoryChange={(e) => setField('trackInventory', e)}
              onStockOnHandChange={(e) => setField('stockOnHand', +e.target.value)}
              onStockLocationsChange={(e) => setField('stockLevels', e)}
              allStockLocations={variant?.stockLevels}
              stockAllocated={variant?.stockAllocated}
              trackInventoryValue={state.trackInventory?.value}
            />
          )}
          <PriceCard
            currencyCode={variant?.currencyCode || CurrencyCode.PLN}
            priceValue={state.prices?.value}
            onPriceChange={(e) => setField('prices', e)}
            taxRateValue={state.taxCategoryId?.value ?? undefined}
            onTaxRateChange={(id) => setField('taxCategoryId', id)}
          />

          <AssetsCard
            onAddAsset={handleAddAsset}
            featuredAssetId={state.featuredAssetId?.value}
            assetsIds={state.assetIds?.value}
            onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
            onAssetsChange={(ids) => setField('assetIds', ids)}
          />
          <EntityCustomFields
            entityName="productVariant"
            id={variant?.id}
            hideButton
            onChange={(customFields, translations) => {
              setField('customFields', customFields);
              if (translations) setField('translations', translations as any);
            }}
            initialValues={
              variant && 'customFields' in variant
                ? { customFields: variant.customFields as CF, translations: variant.translations as any }
                : { customFields: {} }
            }
          />
        </div>
        <div className="flex w-1/3 flex-col gap-4">
          <CustomCard title={t('name')} icon={<CardIcons.basic />} color="purple">
            <div className="flex flex-col gap-y-4">
              <Input
                label={t('sku')}
                placeholder={t('sku')}
                value={state?.sku?.value ?? undefined}
                onChange={(e) => setField('sku', e.target.value)}
              />
              <Input
                label={t('name')}
                placeholder={t('name')}
                value={currentTranslationValue?.name ?? undefined}
                onChange={(e) => setTranslationField('name', e)}
              />
            </div>
          </CustomCard>
          <EntityChannelManager
            entity="productVariant"
            entityId={variant?.id}
            entityChannels={variant?.channels ?? []}
            onRemoveSuccess={onActionCompleted}
            entityName={variant?.name}
            entityVariantList={{
              items: [
                { price: variant?.price, priceWithTax: variant?.priceWithTax, currencyCode: variant?.currencyCode },
              ],
            }}
          />
          <OptionsCard
            optionGroups={variant?.options || []}
            productId={productId}
            optionIds={state.optionIds?.value ?? undefined}
            onChange={(e) => setField('optionIds', e)}
            createMode={!variant}
          />

          {!!variant && (
            <FacetValuesCard
              facetValuesIds={state.facetValueIds?.value ?? undefined}
              onChange={(e) => setField('facetValueIds', e)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
