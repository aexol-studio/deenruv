import React, { useEffect, useRef, useState } from 'react';
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
  OrderStateBadge,
  usePluginStore,
} from '@deenruv/react-ui-devkit';
import { DraftOrderType } from '@/graphql/draft_order';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const ManualOrderChangeModal: React.FC<{
  open: boolean;
  setOpen: (value: { state: boolean; toAction?: string }) => void;
  wantedState?: string;
  order: DraftOrderType;
  currentPossibilities: { name: string; to: string[] };
  onConfirm: (to: string) => Promise<void>;
}> = ({ currentPossibilities, wantedState, order, open, setOpen, onConfirm }) => {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const beforeSubmit = useRef<() => Promise<void> | undefined>();
  const { getModalComponents } = usePluginStore();
  const { t } = useTranslation('orders');
  const [value, setValue] = useState<string>(() => {
    if (wantedState) {
      const stateIndex = currentPossibilities.to.indexOf(wantedState);
      return stateIndex === -1 ? currentPossibilities.to[0] : currentPossibilities.to[stateIndex];
    } else {
      const stateIndex = currentPossibilities.to.indexOf(order.state);
      return stateIndex === -1 ? currentPossibilities.to[0] : currentPossibilities.to[stateIndex + 1];
    }
  });

  const submit = async () => {
    try {
      if (beforeSubmit.current) {
        await beforeSubmit.current?.();
      }
      await onConfirm(value);
    } catch (e) {
      toast.error(t('changeStatus.error'));
    }
  };

  useEffect(() => {
    const stored = getModalComponents('manual-order-state');
    setComponents(
      stored.map((component, index) => {
        const data = {
          state: value,
          setState: setValue,
          order,
          beforeSubmit,
        };
        return <React.Fragment key={index}>{React.createElement(component, { data })}</React.Fragment>;
      }),
    );
    return () => {
      setComponents([]);
    };
  }, [value]);

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
                <SelectItem key={state} value={state} disabled={state === order.state}>
                  {state}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {components}
        <Button className="ml-auto w-min" onClick={submit} variant="action">
          {t('changeStatus.button')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
