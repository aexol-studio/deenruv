'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  useOrder,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Separator,
  DryRunOptions,
  ChangesRegistry,
  useGFFLP,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { PriceChangedInfo } from '@/pages/orders/_components/PriceChangedInfo.js';
import { FileEdit, Truck, Tag, CreditCard, AlertCircle, Save, Loader2, RefreshCw } from 'lucide-react';
import { RefundCard } from '@/pages/orders/_components/RefundCard.js';

interface ModifyingCardProps {
  onNoteModified?: (e: boolean) => void;
  onOptionsChange: (options: DryRunOptions) => void;
  changes: ChangesRegistry | undefined;
}

export const ModifyingCard: React.FC<ModifyingCardProps> = ({ onNoteModified, onOptionsChange, changes }) => {
  const { t } = useTranslation('orders');
  const { modifiedOrder, setModifyOrderInput, modifyOrder, modifyOrderInput } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state, setField } = useGFFLP('ModifyOrderInput')({});
  const [noteAdded, setNoteAdded] = useState(false);
  const [sendRefund, setSendRefund] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const priceDifference = useMemo(() => {
    const totalWithTaxChange = changes?.rest.find((ch) => ch.path === 'totalWithTax');
    if (!totalWithTaxChange) return 0;

    return +totalWithTaxChange.added - +totalWithTaxChange.removed;
  }, [changes]);

  const currentPayment = modifiedOrder?.payments?.[0];

  useEffect(() => {
    if (priceDifference < 0) setSendRefund(true);
  }, [priceDifference]);

  useEffect(() => setNoteAdded(!!state.note?.value), [state.note?.value]);

  useEffect(() => {
    if (modifiedOrder && state.note?.value) {
      setModifyOrderInput({
        ...modifyOrderInput,
        note: state.note?.value,
        options: state.options?.value,
        refund:
          sendRefund && currentPayment?.transactionId
            ? {
                paymentId: currentPayment.transactionId,
                amount: priceDifference,
                reason: refundReason,
              }
            : undefined,
      });
    }
  }, [state, modifiedOrder]);

  const acceptModifiedChanges = async () => {
    if (!noteAdded) return;

    setIsSubmitting(true);
    try {
      await modifyOrder();
      toast.success(t('modifySuccess', 'Order modifications applied successfully'));
      onNoteModified && onNoteModified(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t('modifyError', 'Failed to apply order modifications');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="h-full max-h-[calc(100vh-200px)]">
      <Card className="flex h-full flex-col border-l-4 border-l-blue-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-blue-400">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <FileEdit className="size-5 text-blue-500 dark:text-blue-400" />
            <div>
              <CardTitle>{t('orderModification', 'Order Modification')}</CardTitle>
              <CardDescription className="mt-1">
                {t('orderModificationDescription', 'Modify order details and apply changes')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 overflow-y-auto">
          <div className="space-y-3">
            <Label htmlFor="note" className="text-sm font-medium">
              {t('note', 'Modification Note')} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Textarea
                id="note"
                placeholder={t('notePlaceholder', 'Enter a note explaining the reason for these modifications...')}
                value={state.note?.value ?? ''}
                onChange={(e) => setField('note', e.target.value)}
                className="min-h-[60px] resize-y"
              />
              {!state.note?.value && (
                <div className="absolute right-3 top-3 text-amber-500">
                  <AlertCircle className="size-4" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {t('noteRequired', 'A note is required to explain why these changes are being made')}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-medium">
              {t('modificationOptions', 'Modification Options')}
            </h3>

            <div className="flex flex-col space-y-4">
              <div className="border-border bg-muted/20 space-y-4 rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <RefreshCw className="size-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">{t('processingOptions', 'Processing Options')}</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recalculateShipping"
                      checked={state.options?.value?.recalculateShipping ?? false}
                      onCheckedChange={(e) => {
                        const optionsObj = {
                          freezePromotions: state?.options?.value?.freezePromotions || false,
                          recalculateShipping: !!e,
                        };
                        setField('options', optionsObj);
                        onOptionsChange(optionsObj);
                      }}
                    />
                    <Label
                      htmlFor="recalculateShipping"
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                    >
                      <Truck className="size-4 text-blue-500 dark:text-blue-400" />
                      {t('recalculateShipping', 'Recalculate Shipping')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="freezePromotions"
                      checked={state.options?.value?.freezePromotions ?? false}
                      onCheckedChange={(e) => {
                        const optionsObj = {
                          freezePromotions: !!e,
                          recalculateShipping: state?.options?.value?.recalculateShipping || false,
                        };
                        setField('options', optionsObj);
                        onOptionsChange(optionsObj);
                      }}
                    />
                    <Label
                      htmlFor="freezePromotions"
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                    >
                      <Tag className="size-4 text-blue-500 dark:text-blue-400" />
                      {t('freezePromotions', 'Freeze Promotions')}
                    </Label>
                  </div>

                  {!!priceDifference && (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="refund" checked={sendRefund} onCheckedChange={(e) => setSendRefund(e as boolean)} />
                      <Label htmlFor="refund" className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <CreditCard className="size-4 text-blue-500 dark:text-blue-400" />
                        {t('refund', 'Process Refund')}
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {sendRefund && (
                <RefundCard
                  priceDifference={priceDifference}
                  refundReason={refundReason}
                  setRefundReason={setRefundReason}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    onClick={acceptModifiedChanges}
                    disabled={!noteAdded || isSubmitting}
                    type="button"
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t('processing', 'Processing...')}
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        {t('applyChanges', 'Apply Changes')}
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!noteAdded && (
                <TooltipContent className="border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  <div className="flex items-center gap-2 px-1">
                    <AlertCircle className="size-4" />
                    {t('disabledBtnTooltip', 'A note is required to apply changes')}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </CardContent>
        <PriceChangedInfo {...{ changes }} />
      </Card>
    </form>
  );
};
