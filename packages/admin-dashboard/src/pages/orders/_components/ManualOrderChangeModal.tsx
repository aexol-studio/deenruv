import React, { useEffect, useState } from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@deenruv/react-ui-devkit';
import { DraftOrderType } from '@/graphql/draft_order';
import { useTranslation } from 'react-i18next';
import { OrderStateBadge } from '@/pages/orders/_components/OrderStateBadge';
import { ORDER_STATE } from '@/graphql/base';
import { ToRealizationForm } from '@/pages/orders/_components/ToRealizationForm';

export const ManualOrderChangeModal: React.FC<{
  open: boolean;
  setOpen: (value: { state: boolean; toAction?: string }) => void;
  order: DraftOrderType;
  currentPossibilities: { name: string; to: string[] };
  onConfirm: (to: string) => void;
  defaultState?: string;
}> = ({ currentPossibilities, order, open, setOpen, onConfirm, defaultState }) => {
  const { t } = useTranslation('orders');
  const [value, setValue] = useState<string>(
    defaultState || currentPossibilities.to.find((state) => state !== order.state) || '',
  );
  useEffect(() => {
    if (!open) setTimeout(() => (document.body.style.pointerEvents = ''), 300);
  }, [open]);

  return (
    <Dialog open={open} modal={open} onOpenChange={(state) => setOpen({ state })}>
      <DialogContent className="min-w-fit max-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t('changeStatus.header')}
            <OrderStateBadge state={order.state} />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('changeStatus.description')}</DialogDescription>
        <Select name="orderState" value={value} onValueChange={(e) => setValue(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status.." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[currentPossibilities.name, ...currentPossibilities.to].map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {value === ORDER_STATE.IN_REALIZATION ? (
          <ToRealizationForm onRealizationFinished={() => onConfirm(ORDER_STATE.IN_REALIZATION)} />
        ) : (
          <Button className="ml-auto w-min" onClick={() => onConfirm(value)} variant="action">
            {t('changeStatus.button')}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
