import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
  getRefundablePayments,
  getRefundedQuantities,
  Input,
  planOrderRefund,
  priceFormatter,
  RefundAllocation,
  Textarea,
  useOrder,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Undo2 } from 'lucide-react';
import { ProductsTable, RefundLineSelection } from './ProductsTable.js';

interface CancelAndRefundDialogProps {
  onConfirm: (input: {
    cancelLines: Array<{ orderLineId: string; quantity: number }>;
    refundLines: Array<{ orderLineId: string; quantity: number }>;
    allocations: RefundAllocation[];
    reason: string;
    shipping: number;
    cancelShipping: boolean;
    adjustment: number;
  }) => Promise<void>;
}

export const CancelAndRefundDialog: React.FC<CancelAndRefundDialogProps> = ({ onConfirm }) => {
  const { t } = useTranslation('orders');
  const { order } = useOrder();
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, RefundLineSelection>>({});
  const [reason, setReason] = useState('');
  const [refundShipping, setRefundShipping] = useState(false);
  const [cancelShipping, setCancelShipping] = useState(false);
  const [manualAmount, setManualAmount] = useState<string>('');
  const [allocationOverrides, setAllocationOverrides] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const capacities = useMemo(() => getRefundablePayments(order?.payments ?? []), [order?.payments]);
  const refundedQuantities = useMemo(() => getRefundedQuantities(order?.payments ?? []), [order?.payments]);

  const reset = () => {
    setSelections({});
    setReason('');
    setRefundShipping(false);
    setCancelShipping(false);
    setManualAmount('');
    setAllocationOverrides({});
    setError('');
    setSubmitting(false);
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    setOpen(false);
    reset();
  }, [order?.id]);

  if (!order) return null;
  const itemAmount = order.lines.reduce(
    (total, line) => total + line.proratedUnitPriceWithTax * (selections[line.id]?.refundQuantity ?? 0),
    0,
  );
  const shipping = refundShipping ? order.shipping : 0;
  const suggestedAmount = itemAmount + shipping;
  const hasCancellationLines = Object.values(selections).some((selection) => selection.cancelQuantity > 0);

  useEffect(() => {
    if (!hasCancellationLines) setCancelShipping(false);
  }, [hasCancellationLines]);

  const submit = async () => {
    try {
      setError('');
      const overrides = Object.entries(allocationOverrides)
        .filter(([, amount]) => amount !== '')
        .map(([paymentId, amount]) => ({ paymentId, amount: Number(amount) }));
      const plan = planOrderRefund({
        lines: order.lines.map((line) => ({
          id: line.id,
          maxRefundQuantity: Math.max(0, line.orderPlacedQuantity - (refundedQuantities[line.id] ?? 0)),
          maxCancelQuantity: line.quantity,
          unitPriceWithTax: line.proratedUnitPriceWithTax,
        })),
        selections,
        shippingAmount: shipping,
        cancelShipping,
        reason,
        capacities,
        amountOverride: manualAmount === '' ? undefined : Number(manualAmount),
        allocationOverrides: overrides.length > 0 ? overrides : undefined,
      });
      setSubmitting(true);
      await onConfirm({
        cancelLines: plan.cancelLines,
        refundLines: plan.refundLines,
        allocations: plan.allocations,
        reason: reason.trim(),
        shipping,
        cancelShipping,
        adjustment: plan.totalAmount - plan.itemAmount - shipping,
      });
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('cancelAndRefund.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem asChild onSelect={(event) => event.preventDefault()}>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 text-red-400 hover:text-red-400">
            {t('cancelAndRefund.trigger')}
          </Button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-[90vw] flex-col gap-4 overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('cancelAndRefund.title')}</DialogTitle>
        </DialogHeader>
        <ProductsTable selections={selections} setSelections={setSelections} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex gap-2">
              <input type="checkbox" checked={refundShipping} onChange={(e) => setRefundShipping(e.target.checked)} />
              {t('cancelAndRefund.refundShipping')}
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={cancelShipping}
                disabled={!hasCancellationLines}
                onChange={(e) => setCancelShipping(e.target.checked)}
              />
              {t('cancelAndRefund.cancelShipping')}
            </label>
            {!hasCancellationLines && (
              <p className="text-xs text-muted-foreground">{t('cancelAndRefund.cancelShippingRequiresLines')}</p>
            )}
            <label className="block text-sm">{t('refund.amount')}</label>
            <Input
              type="number"
              min={0}
              step={1}
              value={manualAmount}
              placeholder={String(suggestedAmount)}
              onChange={(e) => setManualAmount(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t('cancelAndRefund.suggestedAmount')}: {priceFormatter(suggestedAmount, order.currencyCode)}
            </p>
          </div>
          <div className="space-y-3">
            <label className="block text-sm">{t('cancelAndRefund.reason')}</label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
            {capacities.map((payment) => (
              <div key={payment.paymentId} className="grid grid-cols-[1fr_140px] items-center gap-2 text-sm">
                <span>
                  {payment.paymentId} ({priceFormatter(payment.capacity, order.currencyCode)})
                </span>
                <Input
                  type="number"
                  min={0}
                  max={payment.capacity}
                  step={1}
                  placeholder={t('cancelAndRefund.auto')}
                  value={allocationOverrides[payment.paymentId] ?? ''}
                  onChange={(e) =>
                    setAllocationOverrides((current) => ({ ...current, [payment.paymentId]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter className="mt-auto">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('payments.cancel')}
          </Button>
          <Button disabled={submitting} onClick={submit}>
            <Undo2 className="mr-2 h-4 w-4" />
            {t('cancelAndRefund.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
