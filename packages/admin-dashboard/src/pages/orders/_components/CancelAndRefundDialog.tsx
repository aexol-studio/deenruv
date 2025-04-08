import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  useOrder,
} from '@deenruv/react-ui-devkit';
import { Undo2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductsTable } from '@/pages/orders/_components';
import { RefundPaymentCard } from '@/pages/orders/_components/RefundPaymentCard.js';

interface CancelAndRefundDialogProps {
  refundReason: string;
  setRefundReason: Dispatch<SetStateAction<string>>;
  onConfirm: (
    amount: number,
    lines: { orderLineId: string; quantity: number }[],
    reason: string,
    shipping: number,
    cancelShipping: boolean,
    adjustment: number,
  ) => void;
}

export const CancelAndRefundDialog: React.FC<CancelAndRefundDialogProps> = ({
  refundReason,
  setRefundReason,
  onConfirm,
}) => {
  const { t } = useTranslation('orders');
  const { order } = useOrder();
  const [open, setOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundLines, setRefundLines] = useState<{ orderLineId: string; quantity: number }[]>([]);
  const [cancelShipping, setCancelShipping] = useState(false);

  useEffect(() => {
    if (!order) return;
    const wholeLines = order?.lines.filter((l) => refundLines.some((rL) => l.id === rL.orderLineId)) ?? [];
    let _refundAmount = refundLines
      .map((rL, i) => wholeLines[i].discountedUnitPriceWithTax * rL.quantity)
      .reduce((prev, acc) => prev + acc, 0);

    if (cancelShipping && order?.shipping) {
      _refundAmount = +order?.shipping;
    }

    console.log('RA', _refundAmount);

    setRefundAmount(_refundAmount);
  }, [cancelShipping, refundLines, order]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-red-400 hover:text-red-400 dark:text-red-400 dark:hover:text-red-400"
          >
            {t('cancelAndRefund.trigger')}
          </Button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-w-[80vw] flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <Undo2 className="h-5 w-5 text-rose-500 dark:text-rose-400" />
            <DialogTitle>{t('cancelAndRefund.title')}</DialogTitle>
          </div>
        </DialogHeader>

        <ProductsTable {...{ refundLines, setRefundLines }} />
        <RefundPaymentCard
          {...{ refundReason, setRefundReason, cancelShipping, setCancelShipping, refundAmount, setRefundAmount }}
        />

        <DialogFooter className="mt-auto gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t('payments.cancel')}</Button>
          </DialogClose>
          <Button
            type="submit"
            className="gap-2"
            onClick={() => onConfirm(refundAmount, refundLines, refundReason, 0, cancelShipping, 0)}
          >
            <Undo2 className="h-4 w-4" />
            {t('cancelAndRefund.refund')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
