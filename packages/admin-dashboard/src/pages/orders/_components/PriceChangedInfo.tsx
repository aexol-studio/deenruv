import { useOrder, priceFormatter, CardFooter } from '@deenruv/react-ui-devkit';
import { ShieldCheck } from 'lucide-react';
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
  const priceDifference = totalActualOrder && totalModifiedOrder ? totalModifiedOrder - totalActualOrder : 0;

  return priceDifference ? (
    <CardFooter className="border-t pt-4">
      <div className="w-full rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-500" />
          <div>
            {t('modify.priceDifference')} {priceDifference > 0 && '+'}
            {priceFormatter(priceDifference, order?.currencyCode)}
          </div>
        </div>
      </div>
    </CardFooter>
  ) : null;
};
