import { useTranslation, useOrder, priceFormatter, CardFooter, ChangesRegistry } from '@deenruv/react-ui-devkit';
import { ShieldCheck } from 'lucide-react';
import React, { useMemo } from 'react';

export const PriceChangedInfo: React.FC<{ changes: ChangesRegistry | undefined }> = ({ changes }) => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  const priceDifference = useMemo(() => {
    const totalWithTaxChange = changes?.rest.find((ch) => ch.path === 'totalWithTax');
    console.log('TOTAL', totalWithTaxChange);
    if (!totalWithTaxChange) return 0;

    return +totalWithTaxChange.added - +totalWithTaxChange.removed;
  }, [changes]);

  return priceDifference ? (
    <CardFooter className="flex flex-col border-t pt-4">
      {/* {priceDifference < 0 && <RefundCard {...{ priceDifference }} />} */}
      <div className="w-full rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-5 text-amber-500" />
          <div>
            {t('modify.priceDifference')} {priceDifference > 0 && '+'}
            {priceFormatter(priceDifference, order?.currencyCode)}
          </div>
        </div>
      </div>
    </CardFooter>
  ) : null;
};
