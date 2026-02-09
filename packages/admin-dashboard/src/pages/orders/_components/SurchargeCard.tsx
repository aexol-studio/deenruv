'use client';

import { SurchargeTable } from './';
import {
  useTranslation,
  Button,
  Checkbox,
  Input,
  Label,
  useDeenruvForm,
  z,
  useOrder,
  CustomCard,
} from '@deenruv/react-ui-devkit';
import type React from 'react';
import { useCallback, useState } from 'react';
import { PlusCircle, DollarSign, Tag, FileText, Percent, Receipt, Loader2 } from 'lucide-react';

const surchargeSchema = z.object({
  description: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  priceIncludesTax: z.boolean().default(false),
  taxDescription: z.string().default(''),
  taxRate: z.number().default(0),
});

export const SurchargeCard: React.FC<{}> = () => {
  const { t } = useTranslation('orders');
  const { setModifyOrderInput, modifyOrderInput, setModifiedOrder, modifiedOrder } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useDeenruvForm({
    schema: surchargeSchema,
    defaultValues: {
      description: '',
      sku: '',
      price: 0,
      priceIncludesTax: false,
      taxDescription: '',
      taxRate: 0,
    },
  });
  const description = form.watch('description');
  const sku = form.watch('sku');
  const price = form.watch('price');
  const priceIncludesTax = form.watch('priceIncludesTax');
  const taxDescription = form.watch('taxDescription');
  const taxRate = form.watch('taxRate');

  const handleAddSurcharge = useCallback(async () => {
    // Validate all fields
    if (!description || !sku || !price || price <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderWithSurcharge = Object.assign({}, modifyOrderInput);

      const surchargesArray = modifyOrderInput?.surcharges || [];

      surchargesArray.push({
        description: description || '',
        price,
        priceIncludesTax: priceIncludesTax || false,
        sku,
        taxDescription,
        taxRate,
      });

      orderWithSurcharge.surcharges = surchargesArray;

      if (modifiedOrder)
        setModifiedOrder({
          ...modifiedOrder,
          surcharges: [
            ...modifiedOrder.surcharges,
            {
              description: description || '',
              price: taxRate && priceIncludesTax ? price / (1 + taxRate / 100) : price,
              sku,
              createdAt: new Date().toDateString(),
              priceWithTax: taxRate && !priceIncludesTax ? +price * (+taxRate / 100) + +price : +price,
              taxRate: taxRate || 0,
            },
          ],
        });
      setModifyOrderInput(orderWithSurcharge);

      // Reset form fields
      form.reset({
        description: '',
        sku: '',
        price: 0,
        priceIncludesTax: false,
        taxDescription: '',
        taxRate: 0,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    description,
    sku,
    price,
    priceIncludesTax,
    taxDescription,
    taxRate,
    modifiedOrder,
    modifyOrderInput,
    setModifiedOrder,
    setModifyOrderInput,
    form,
  ]);

  return (
    <CustomCard
      color="yellow"
      description={t('surcharge.description', 'Add additional fees or charges to this order')}
      title={t('surcharge.title', 'Order Surcharges')}
      icon={<Receipt className="size-5 text-yellow-500 dark:text-yellow-400" />}
      bottomRight={
        <Button
          onClick={handleAddSurcharge}
          disabled={isSubmitting || !description || !sku || !price || price <= 0}
          className="ml-auto gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t('surcharge.processing', 'Processing...')}
            </>
          ) : (
            <>
              <PlusCircle className="size-4" />
              {t('surcharge.addButton', 'Add Surcharge')}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
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
                  value={description || ''}
                  onChange={(e) => form.setField('description', e.target.value)}
                  className="pl-9"
                  errors={
                    form.formState.errors.description?.message ? [form.formState.errors.description.message] : undefined
                  }
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <FileText className="size-4" />
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
                  value={sku || ''}
                  onChange={(e) => form.setField('sku', e.target.value)}
                  className="pl-9"
                  errors={form.formState.errors.sku?.message ? [form.formState.errors.sku.message] : undefined}
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <Tag className="size-4" />
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
                  value={price || ''}
                  onChange={(e) => form.setField('price', +e.target.value)}
                  className="pl-9"
                  errors={form.formState.errors.price?.message ? [form.formState.errors.price.message] : undefined}
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <DollarSign className="size-4" />
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
                  value={taxRate || 0}
                  onChange={(e) => form.setField('taxRate', +e.target.value)}
                  className="pl-9"
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <Percent className="size-4" />
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
                  value={taxDescription || ''}
                  onChange={(e) => form.setField('taxDescription', e.target.value)}
                  className="pl-9"
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  <FileText className="size-4" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="surcharge-tax-included" className="text-sm font-medium">
                {t('surcharge.labels.includesTax', { value: taxRate })}
              </Label>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="surcharge-tax-included"
                  checked={priceIncludesTax || false}
                  onCheckedChange={(e) => form.setField('priceIncludesTax', Boolean(e))}
                />
                <Label htmlFor="surcharge-tax-included" className="cursor-pointer text-sm">
                  {t('surcharge.placeholders.taxIncluded', 'Tax is included in the price')}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomCard>
  );
};
