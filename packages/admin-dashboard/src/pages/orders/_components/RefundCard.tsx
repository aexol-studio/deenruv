import { useTranslation, cn, priceFormatter, Textarea, useOrder } from '@deenruv/react-ui-devkit';
import { CreditCard, FileText } from 'lucide-react';
import React, { useState } from 'react';

interface RefundCardProps {
  priceDifference: number;
  refundReason: string;
  setRefundReason: (e: string) => void;
}

export const RefundCard: React.FC<RefundCardProps> = ({ priceDifference, refundReason, setRefundReason }) => {
  const { t } = useTranslation('orders');
  const { modifiedOrder } = useOrder();
  const currentPayment = modifiedOrder?.payments?.[0];
  const [activeTab, setActiveTab] = useState<'details' | 'note'>('details');

  return (
    <div className="border-border bg-muted/20 space-y-4 rounded-md border p-4">
      <div className="flex items-center gap-6">
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2',
            activeTab === 'details' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
          )}
          onClick={() => setActiveTab('details')}
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <CreditCard className="size-4 text-blue-500 dark:text-blue-400" />
          </div>
          <h4 className="font-medium">{t('refund.details', 'Refund Details')}</h4>
        </div>

        <div
          className={cn(
            'flex cursor-pointer items-center gap-2',
            activeTab === 'note' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
          )}
          onClick={() => setActiveTab('note')}
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <FileText className="size-4 text-blue-500 dark:text-blue-400" />
          </div>
          <h4 className="font-medium">{t('refund.note', 'Refund Note')}</h4>
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">{t('refund.method')}</p>
              <p className="font-medium">{currentPayment?.method}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('refund.id')}</p>
              <p className="font-medium">{currentPayment?.transactionId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">{t('refund.amount')}</p>
              <p className="font-medium">${priceFormatter(currentPayment?.amount ?? 0, modifiedOrder?.currencyCode)}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">{t('refund.refund')}</p>
              <p className="font-medium">${priceFormatter(priceDifference * -1, modifiedOrder?.currencyCode)}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'note' && (
        <div className="space-y-2">
          <Textarea
            id="note"
            placeholder={t('notePlaceholder', 'Enter optional info of the reason')}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="min-h-[60px] resize-y"
          />
        </div>
      )}
    </div>
  );
};
