import { Label } from '@deenruv/react-ui-devkit';
import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const OrderSummary: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;

  return (
    <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
      <Label className="text-muted-foreground font-bold">
        {t('create.finalAmount', { value: priceFormatter(order.totalWithTax, order.currencyCode) })}
      </Label>
      <Label className="text-muted-foreground">|</Label>
      <Label className="text-muted-foreground">{t('create.baseInfoCode', { value: order.code })}</Label>
      <Label className="text-muted-foreground">|</Label>
      <Label className="text-muted-foreground">
        {t('create.baseInfoCreated', { value: format(new Date(order.createdAt), 'dd.MM.yyyy hh:mm') })}
      </Label>
      <Label className="text-muted-foreground">|</Label>
      <Label className="text-muted-foreground">
        {t('create.baseInfoUpdated', { value: format(new Date(order.updatedAt), 'dd.MM.yyyy hh:mm') })}
      </Label>
      {/* {order.getRealization && (
        <div className="ml-auto flex flex-row gap-x-4 gap-y-2">
          <Label className="text-muted-foreground text-yellow-600">
            {t('create.realizationPlan', { value: order.getRealization.plannedAt })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground text-yellow-600">
            {t('create.realizationDate', { value: order.getRealization.finalPlannedAt })}
          </Label>
        </div>
      )} */}
    </div>
  );
};
