import {
  Button,
  CardIcons,
  ConfirmationDialog,
  CustomCard,
  Input,
  apiClient,
  setInArrayBy,
  useDeenruvForm,
  z,
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
  const variantSchema = z.object({
    translations: z.array(z.any()).default([]),
    price: z.any().optional(),
    prices: z.any().optional(),
    sku: z.any().optional(),
    assetIds: z.array(z.string()).default([]),
    featuredAssetId: z.string().nullable().optional(),
    taxCategoryId: z.string().optional(),
    stockLevels: z.array(z.any()).default([]),
    stockOnHand: z.number().optional(),
    outOfStockThreshold: z.number().optional(),
    useGlobalOutOfStockThreshold: z.boolean().optional(),
    trackInventory: z.any().optional(),
    facetValueIds: z.array(z.string()).default([]),
    optionIds: z.array(z.string()).default([]),
    customFields: z.record(z.string(), z.unknown()).default({}),
  });
  const form = useDeenruvForm({
    schema: variantSchema,
    defaultValues: {
      translations: [],
      price: undefined,
      prices: undefined,
      sku: undefined,
      assetIds: [],
      featuredAssetId: undefined,
      taxCategoryId: undefined,
      stockLevels: [],
      stockOnHand: undefined,
      outOfStockThreshold: undefined,
      useGlobalOutOfStockThreshold: undefined,
      trackInventory: undefined,
      facetValueIds: [],
      optionIds: [],
      customFields: {},
    },
  });
  const formValues = form.watch();
  const translations = formValues.translations || [];
  const currentTranslationValue = translations.find(
    (v: { languageCode: LanguageCode }) => v.languageCode === currentTranslationLng,
  );

  useEffect(() => {
    if (!variant) return;

    form.setField('sku', variant.sku);
    form.setField('price', variant.price);
    form.setField('prices', variant.prices);
    form.setField('translations', variant.translations);
    form.setField(
      'assetIds',
      variant.assets.map((a) => a.id),
    );
    form.setField('featuredAssetId', variant.featuredAsset?.id);
    form.setField('taxCategoryId', variant.taxCategory.id);
    form.setField(
      'stockLevels',
      variant.stockLevels.map((sL) => ({ stockLocationId: sL.stockLocationId, stockOnHand: sL.stockOnHand })),
    );
    form.setField('stockOnHand', variant.stockOnHand);
    form.setField('outOfStockThreshold', variant.outOfStockThreshold);
    form.setField('useGlobalOutOfStockThreshold', variant.useGlobalOutOfStockThreshold);
    form.setField('trackInventory', variant.trackInventory);
    form.setField(
      'facetValueIds',
      variant.facetValues.map((f) => f.id),
    );
  }, [variant]);

  const createVariant = useCallback(() => {
    const values = form.getValues();
    const firstPrice = Array.isArray(values.prices) ? values.prices[0]?.price : undefined;
    if (productId && values.sku && values.translations)
      return apiClient('mutation')({
        createProductVariants: [
          {
            input: [
              {
                productId,
                translations: values.translations,
                price: firstPrice,
                sku: values.sku,
                assetIds: values.assetIds,
                featuredAssetId: values.featuredAssetId,
                outOfStockThreshold: values.outOfStockThreshold,
                stockOnHand: values.stockOnHand,
                trackInventory: values.trackInventory,
                taxCategoryId: values.taxCategoryId,
                useGlobalOutOfStockThreshold: values.useGlobalOutOfStockThreshold,
                stockLevels: values.stockLevels,
                facetValueIds: values.facetValueIds,
                optionIds: values.optionIds,
                ...(values.customFields && Object.keys(values.customFields).length > 0
                  ? { customFields: values.customFields }
                  : {}),
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
  }, [form, productId, onActionCompleted, t]);

  const updateVariant = useCallback(() => {
    if (!variant) return;
    const values = form.getValues();
    apiClient('mutation')({
      updateProductVariants: [
        {
          input: [
            {
              id: variant.id,
              translations: values.translations,
              // price: +values.price,
              prices: values.prices,
              sku: values.sku,
              assetIds: values.assetIds,
              featuredAssetId: values.featuredAssetId,
              outOfStockThreshold: values.outOfStockThreshold,
              stockOnHand: values.stockOnHand,
              trackInventory: values.trackInventory,
              taxCategoryId: values.taxCategoryId,
              useGlobalOutOfStockThreshold: values.useGlobalOutOfStockThreshold,
              stockLevels: values.stockLevels,
              facetValueIds: values.facetValueIds,
              ...(values.customFields && Object.keys(values.customFields).length > 0
                ? { customFields: values.customFields }
                : {}),
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
  }, [form, variant]);

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
      const currentValue = translations.find(
        (t: { languageCode: LanguageCode }) => t.languageCode === currentTranslationLng,
      );
      const baseTranslation = currentValue ?? {
        languageCode: currentTranslationLng,
        name: '',
      };

      form.setField(
        'translations',
        setInArrayBy(translations, (t: { languageCode: LanguageCode }) => t.languageCode === currentTranslationLng, {
          ...baseTranslation,
          [field]: e.target.value,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations],
  );

  const handleAddAsset = (id: string | undefined | null) => {
    if (!id) return;

    const newIds = formValues.assetIds || [];
    if (newIds?.includes(id)) return;
    form.setField('assetIds', [...newIds, id]);
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
              priceValue={formValues.price}
              taxRateValue={formValues.taxCategoryId}
              outOfStockThresholdValue={formValues.outOfStockThreshold}
              stockLevelsValue={formValues.stockLevels}
              stockOnHandValue={formValues.stockOnHand}
              useGlobalOutOfStockThresholdValue={formValues.useGlobalOutOfStockThreshold}
              onThresholdChange={(e: ChangeEvent<HTMLInputElement>) =>
                form.setField('outOfStockThreshold', +e.target.value)
              }
              onUseGlobalChange={(e: boolean) => form.setField('useGlobalOutOfStockThreshold', e)}
              onTrackInventoryChange={(e: unknown) => form.setField('trackInventory', e)}
              onStockOnHandChange={(e: ChangeEvent<HTMLInputElement>) => form.setField('stockOnHand', +e.target.value)}
              onStockLocationsChange={(e: Array<{ stockLocationId: string; stockOnHand: number }>) =>
                form.setField('stockLevels', e)
              }
              allStockLocations={variant?.stockLevels}
              stockAllocated={variant?.stockAllocated}
              trackInventoryValue={formValues.trackInventory}
            />
          )}
          <PriceCard
            currencyCode={variant?.currencyCode || CurrencyCode.PLN}
            priceValue={formValues.prices}
            onPriceChange={(e: unknown) => form.setField('prices', e)}
            taxRateValue={formValues.taxCategoryId ?? undefined}
            onTaxRateChange={(id: string) => form.setField('taxCategoryId', id)}
            showDefaultPriceWhenEmpty={!variant}
          />

          <AssetsCard
            onAddAsset={handleAddAsset}
            featuredAssetId={formValues.featuredAssetId}
            assetsIds={formValues.assetIds}
            onFeaturedAssetChange={(id: string | undefined | null) => form.setField('featuredAssetId', id)}
            onAssetsChange={(ids: string[]) => form.setField('assetIds', ids)}
          />
          <EntityCustomFields
            entityName="productVariant"
            id={variant?.id}
            hideButton
            onChange={(customFields: CF, translations?: unknown) => {
              form.setField('customFields', customFields);
              if (translations) form.setField('translations', translations as any);
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
                value={formValues.sku ?? undefined}
                onChange={(e: ChangeEvent<HTMLInputElement>) => form.setField('sku', e.target.value)}
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
            optionIds={formValues.optionIds ?? undefined}
            onChange={(e: string[]) => form.setField('optionIds', e)}
            createMode={!variant}
          />

          {!!variant && (
            <FacetValuesCard
              facetValuesIds={formValues.facetValueIds ?? undefined}
              onChange={(e: string[]) => form.setField('facetValueIds', e)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
