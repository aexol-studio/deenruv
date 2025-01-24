import { SurchargeTable } from './';
import { useOrder } from '@/state/order.js';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  useGFFLP,
} from '@deenruv/react-ui-devkit';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const SurchargeCard: React.FC<{}> = () => {
  const { t } = useTranslation('orders');
  const { setModifyOrderInput, modifyOrderInput, setModifiedOrder, modifiedOrder } = useOrder();
  const { state, setField } = useGFFLP(
    'SurchargeInput',
    'description',
    'price',
    'priceIncludesTax',
    'sku',
    'taxDescription',
    'taxRate',
  )({
    taxRate: {
      initialValue: 0,
    },
  });

  const handleAddSurcharge = useCallback(() => {
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
            price: taxRate?.value && priceIncludesTax ? price?.value / (1 + taxRate.value / 100) : price?.value,
            sku: sku?.value,
            createdAt: new Date().toDateString(),
            priceWithTax:
              taxRate?.value && !priceIncludesTax
                ? +price?.value * (+taxRate?.value / 100) + +price?.value
                : +price?.value,
            taxRate: taxRate?.value || 0,
          },
        ],
      });
    setModifyOrderInput(orderWithSurcharge);

    setField('description', '');
    setField('sku', '');
    setField('price', 0);
    setField('priceIncludesTax', false);
    setField('taxDescription', '');
    setField('taxRate', 0);
  }, [state, modifiedOrder, modifyOrderInput]);

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>{t('surcharge.title')}</CardTitle>
        <CardDescription>{t('surcharge.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <SurchargeTable />
        <div>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <Input
              label={t('surcharge.labels.description')}
              value={state.description?.value}
              onChange={(e) => setField('description', e.target.value)}
            />
            <Input
              label={t('surcharge.labels.sku')}
              value={state.sku?.value || ''}
              onChange={(e) => setField('sku', e.target.value)}
            />
            <Input
              label={t('surcharge.labels.price')}
              value={state.price?.value}
              onChange={(e) => setField('price', +e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="mb-2">{t('surcharge.labels.includesTax', { value: state.taxRate?.value })}</Label>
              <Checkbox
                checked={state.priceIncludesTax?.value}
                onCheckedChange={(e) => setField('priceIncludesTax', Boolean(e))}
              />
            </div>
            <Input
              label={t('surcharge.labels.taxRate')}
              type="number"
              value={state.taxRate?.value || 0}
              onChange={(e) => setField('taxRate', +e.target.value)}
            />
            <Input
              label={t('surcharge.labels.taxDescription')}
              value={state.taxDescription?.value || ''}
              onChange={(e) => setField('taxDescription', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddSurcharge}>{t('surcharge.addButton')}</Button>
      </CardFooter>
    </Card>
  );
};
