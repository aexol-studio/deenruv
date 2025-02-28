import { useOrder, priceFormatter } from '@deenruv/react-ui-devkit';
import { Info } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const PriceChangedInfo: React.FC = () => {
  const { order, modifiedOrder } = useOrder();
  const { t } = useTranslation('orders');
  const totalActualLines = order?.lines.reduce((acc, curr) => acc + curr.unitPriceWithTax * curr.quantity, 0);
  const totalModifiedLines = modifiedOrder?.lines.reduce((acc, curr) => acc + curr.unitPriceWithTax * curr.quantity, 0);
  const totalActualSurcharges = order?.surcharges.reduce((acc, curr) => acc + curr.priceWithTax, 0);
  const totalModifiedSurcharges = modifiedOrder?.surcharges.reduce((acc, curr) => acc + curr.priceWithTax, 0);
  const totalActualOrder = (totalActualLines || 0) + (totalActualSurcharges || 0);
  const totalModifiedOrder = (totalModifiedLines || 0) + (totalModifiedSurcharges || 0);

  console.log(order?.lines, modifiedOrder?.lines);

  const priceDifference = totalActualOrder && totalModifiedOrder ? totalModifiedOrder - totalActualOrder : 0;

  return priceDifference ? (
    <div className="flex w-full gap-2 rounded-md bg-blue-200 p-4 text-blue-700">
      <Info />
      <p>
        {t('modify.priceDifference')} {priceDifference > 0 && '+'}
        {priceFormatter(priceDifference, order?.currencyCode)}
      </p>
    </div>
  ) : null;
};
