import React, { useEffect, useState } from 'react';
import { useOrder } from '@/state/order';
import { useGFFLP } from '@/lists/useGflp';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Stack,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const ModifyingCard: React.FC<{ onNoteModified?: (e: boolean) => void }> = ({ onNoteModified }) => {
  const { t } = useTranslation('orders');
  const { modifiedOrder, setModifyOrderInput, modifyOrder } = useOrder();

  const { state, setField } = useGFFLP('ModifyOrderInput')({});
  const [noteAdded, setNoteAdded] = useState(false);
  useEffect(() => setNoteAdded(!!state.note?.value), [state.note?.value]);

  useEffect(() => {
    if (modifiedOrder && state.note?.value) {
      setModifyOrderInput({
        note: state.note?.value,
        options: state.options?.value,
        refund: state.refund?.value,
      });
    }
  }, [state, modifiedOrder, setModifyOrderInput]);
  const acceptModifiedChanges = async () =>
    modifyOrder(() => toast.message(t('modifySuccess'))).then(() => onNoteModified && onNoteModified(false));
  return (
    <form className="h-full">
      <Card className="h-full bg-accent/20">
        <CardHeader>
          <CardTitle className="text-base">{t('note')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack column className="items-start gap-8">
            <div className="w-full items-center">
              <Textarea
                rows={10}
                id="note"
                placeholder="Note"
                value={state.note?.value}
                onChange={(e) => setField('note', e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recalculateShipping"
                    checked={state.options?.value?.recalculateShipping}
                    onCheckedChange={(e) =>
                      setField('options', {
                        freezePromotions: state?.options?.value?.freezePromotions || false,
                        recalculateShipping: !!e,
                      })
                    }
                  />
                  <Label
                    htmlFor="recalculateShipping"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recalculate Shipping
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freezePromotions"
                    checked={state.options?.value?.freezePromotions}
                    onCheckedChange={(e) =>
                      setField('options', {
                        freezePromotions: !!e,
                        recalculateShipping: state?.options?.value?.recalculateShipping || false,
                      })
                    }
                  />
                  <Label
                    htmlFor="freezePromotions"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Freeze Promotions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refund"
                    checked={state.refund?.value !== undefined}
                    onCheckedChange={(e) => setField('refund', e ? { paymentId: '', reason: '' } : undefined)}
                  />
                  <Label
                    htmlFor="refund"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Refund
                  </Label>
                </div>
              </div>
              {state.refund?.value && (
                <div className="flex w-full flex-col gap-4 border-l-[1px] border-solid border-gray-200 pl-6">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="paymentId">Payment ID</Label>
                    <Input
                      type="paymentId"
                      id="paymentId"
                      placeholder="Payment ID"
                      value={state.refund.value?.paymentId}
                      onChange={(e) => setField('refund', { paymentId: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      type="reason"
                      id="reason"
                      placeholder="Reason"
                      value={state.refund.value?.reason}
                      onChange={(e) =>
                        setField('refund', {
                          paymentId: state?.refund?.value?.paymentId || '',
                          reason: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex w-full justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button onClick={acceptModifiedChanges} disabled={!noteAdded} type="button">
                      {t('applyChanges')}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!noteAdded && <TooltipContent className="pb-1 pl-6">{t('disabledBtnTooltip')}</TooltipContent>}
              </Tooltip>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </form>
  );
};
