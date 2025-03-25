'use client';

import { SurchargeTable } from './';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Checkbox,
  Input,
  Label,
  useGFFLP,
  useOrder,
  CustomCardHeader,
} from '@deenruv/react-ui-devkit';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, DollarSign, Tag, FileText, Percent, Receipt, Loader2 } from 'lucide-react';

export const SurchargeCard: React.FC<{}> = () => {
  const { t } = useTranslation('orders');
  const { setModifyOrderInput, modifyOrderInput, setModifiedOrder, modifiedOrder } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('C', modifiedOrder?.currencyCode);

  const { state, setField } = useGFFLP(
    'SurchargeInput',
    'description',
    'price',
    'priceIncludesTax',
    'sku',
    'taxDescription',
    'taxRate',
  )({
    description: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('surcharge.validation.descriptionRequired', 'Description is required')];
      },
    },
    sku: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('surcharge.validation.skuRequired', 'SKU is required')];
      },
    },
    price: {
      initialValue: 0,
      validate: (v) => {
        if (v === undefined || v === null) return [t('surcharge.validation.priceRequired', 'Price is required')];
        if (v <= 0) return [t('surcharge.validation.pricePositive', 'Price must be greater than zero')];
      },
    },
    priceIncludesTax: {
      initialValue: false,
    },
    taxDescription: {
      initialValue: '',
    },
    taxRate: {
      initialValue: 0,
    },
  });

  const handleAddSurcharge = useCallback(async () => {
    // Validate all fields
    if (!state.description?.value || !state.sku?.value || !state.price?.value || state.price?.value <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderWithSurcharge = Object.assign({}, modifyOrderInput);
      const { description, price, priceIncludesTax, sku, taxDescription, taxRate } = state;

      const surchargesArray = modifyOrderInput?.surcharges || [];

      surchargesArray.push({
        description: description?.value || '',
        price: price?.value,
        priceIncludesTax: priceIncludesTax?.value || false,
        sku: sku?.value,
        taxDescription: taxDescription?.value,
        taxRate: taxRate?.value,
      });

      orderWithSurcharge.surcharges = surchargesArray;

      if (modifiedOrder)
        setModifiedOrder({
          ...modifiedOrder,
          surcharges: [
            ...modifiedOrder.surcharges,
            {
              description: description?.value || '',
              price:
                taxRate?.value && priceIncludesTax?.value ? price?.value / (1 + taxRate.value / 100) : price?.value,
              sku: sku?.value,
              createdAt: new Date().toDateString(),
              priceWithTax:
                taxRate?.value && !priceIncludesTax?.value
                  ? +price?.value * (+taxRate?.value / 100) + +price?.value
                  : +price?.value,
              taxRate: taxRate?.value || 0,
            },
          ],
        });
      setModifyOrderInput(orderWithSurcharge);

      // Reset form fields
      setField('description', '');
      setField('sku', '');
      setField('price', 0);
      setField('priceIncludesTax', false);
      setField('taxDescription', '');
      setField('taxRate', 0);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, modifiedOrder, modifyOrderInput, setModifiedOrder, setModifyOrderInput, setField]);

  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-yellow-400">
      <CustomCardHeader
        description={t('surcharge.description', 'Add additional fees or charges to this order')}
        title={t('surcharge.title', 'Order Surcharges')}
        icon={<Receipt className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />}
      />
      <CardContent className="space-y-6">
        <SurchargeTable />

        <div>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="surcharge-description" className="text-sm font-medium">
                {t('surcharge.labels.description', 'Description')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="surcharge-description"
                  placeholder={t('surcharge.placeholders.description', 'Enter surcharge description')}
                  value={state.description?.value || ''}
                  onChange={(e) => setField('description', e.target.value)}
                  className="pl-9"
                  errors={state.description?.errors}
                />
                <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surcharge-sku" className="text-sm font-medium">
                {t('surcharge.labels.sku', 'SKU')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="surcharge-sku"
                  placeholder={t('surcharge.placeholders.sku', 'Enter SKU code')}
                  value={state.sku?.value || ''}
                  onChange={(e) => setField('sku', e.target.value)}
                  className="pl-9"
                  errors={state.sku?.errors}
                />
                <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  <Tag className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surcharge-price" className="text-sm font-medium">
                {t('surcharge.labels.price', 'Price')} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="surcharge-price"
                  type="currency"
                  endAdornment={modifiedOrder?.currencyCode}
                  step="0.01"
                  min="0"
                  placeholder={t('surcharge.placeholders.price', 'Enter price')}
                  value={state.price?.value || ''}
                  onChange={(e) => setField('price', +e.target.value)}
                  className="pl-9"
                  errors={state.price?.errors}
                />
                <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surcharge-tax-rate" className="text-sm font-medium">
                {t('surcharge.labels.taxRate', 'Tax Rate (%)')}
              </Label>
              <div className="relative">
                <Input
                  id="surcharge-tax-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('surcharge.placeholders.taxRate', 'Enter tax rate')}
                  value={state.taxRate?.value || 0}
                  onChange={(e) => setField('taxRate', +e.target.value)}
                  className="pl-9"
                />
                <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  <Percent className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surcharge-tax-description" className="text-sm font-medium">
                {t('surcharge.labels.taxDescription', 'Tax Description')}
              </Label>
              <div className="relative">
                <Input
                  id="surcharge-tax-description"
                  placeholder={t('surcharge.placeholders.taxDescription', 'Enter tax description')}
                  value={state.taxDescription?.value || ''}
                  onChange={(e) => setField('taxDescription', e.target.value)}
                  className="pl-9"
                />
                <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surcharge-tax-included" className="text-sm font-medium">
                {t('surcharge.labels.includesTax', { value: state.taxRate?.value })}
              </Label>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="surcharge-tax-included"
                  checked={state.priceIncludesTax?.value || false}
                  onCheckedChange={(e) => setField('priceIncludesTax', Boolean(e))}
                />
                <Label htmlFor="surcharge-tax-included" className="cursor-pointer text-sm">
                  {t('surcharge.placeholders.taxIncluded', 'Tax is included in the price')}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button
          onClick={handleAddSurcharge}
          disabled={
            isSubmitting ||
            !state.description?.value ||
            !state.sku?.value ||
            !state.price?.value ||
            state.price?.value <= 0
          }
          className="ml-auto gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('surcharge.processing', 'Processing...')}
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              {t('surcharge.addButton', 'Add Surcharge')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
