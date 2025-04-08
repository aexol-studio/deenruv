import { useTranslation, useOrder, Label, Renderer } from '@deenruv/react-ui-devkit';
import { format } from 'date-fns';
import React from 'react';

export const OrderSummary: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;

  return (
    <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
      <Label className="text-muted-foreground">{t('create.baseInfoCode', { value: order.code })}</Label>
      <Label className="text-muted-foreground">|</Label>
      <Label className="text-muted-foreground">
        {t('create.baseInfoCreated', { value: format(new Date(order.createdAt), 'dd.MM.yyyy hh:mm') })}
      </Label>
      <Label className="text-muted-foreground">|</Label>
      <Label className="text-muted-foreground">
        {t('create.baseInfoUpdated', { value: format(new Date(order.updatedAt), 'dd.MM.yyyy hh:mm') })}
      </Label>
      <Renderer position="orders-summary" />
    </div>
  );
};
