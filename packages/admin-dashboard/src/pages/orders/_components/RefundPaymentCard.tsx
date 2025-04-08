import { Checkbox, CustomCard, Input, Label, priceFormatter, Textarea, useOrder } from '@deenruv/react-ui-devkit';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface RefundPaymentCardProps {
  refundReason: string;
  setRefundReason: (e: string) => void;
  cancelShipping: boolean;
  setCancelShipping: Dispatch<SetStateAction<boolean>>;
  refundAmount: number;
  setRefundAmount: Dispatch<SetStateAction<number>>;
}

export const RefundPaymentCard: React.FC<RefundPaymentCardProps> = ({
  refundReason,
  setRefundReason,
  cancelShipping,
  setCancelShipping,
  refundAmount,
  setRefundAmount,
}) => {
  const { t } = useTranslation('orders');
  const { modifiedOrder } = useOrder();
  const currentPayment = modifiedOrder?.payments?.[0];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <CustomCard title={t('refund.details', 'Refund Details')} notCollapsible>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-2">
              <Checkbox checked={cancelShipping} onCheckedChange={(e) => setCancelShipping(!!e)} />
              <Label>{t('cancelAndRefund.refundShipping')}</Label>
            </div>
          </div>
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
              <p className="font-medium">{priceFormatter(currentPayment?.amount ?? 0, modifiedOrder?.currencyCode)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">{t('refund.refund')}</p>
              <Input
                // type="currency"
                startAdornment={modifiedOrder?.currencyCode}
                adornmentPlain
                value={refundAmount}
                onChange={(e) => setRefundAmount(+e.target.value)}
              />
            </div>
          </div>
        </div>
      </CustomCard>
      <CustomCard title={t('refund.note', 'Refund Note')} notCollapsible>
        <Textarea
          id="note"
          placeholder={t('notePlaceholder', 'Enter optional info of the reason')}
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          className="min-h-[60px] resize-y"
          rows={8}
        />
      </CustomCard>
    </div>
  );
};
