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
  OrderStateBadge,
  usePluginStore,
} from '@deenruv/react-ui-devkit';
import { DraftOrderType } from '@/graphql/draft_order';
import { useTranslation } from 'react-i18next';

export const ManualOrderChangeModal: React.FC<{
  open: boolean;
  setOpen: (value: { state: boolean; toAction?: string }) => void;
  order: DraftOrderType;
  currentPossibilities: { name: string; to: string[] };
  onConfirm: (to: string) => void;
}> = ({ currentPossibilities, order, open, setOpen, onConfirm }) => {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [beforeSubmits, setBeforeSubmits] = useState<(() => Promise<void> | undefined)[]>([]);
  const { getModalComponents } = usePluginStore();
  const { t } = useTranslation('orders');
  const [value, setValue] = useState<string>(() => {
    const stateIndex = currentPossibilities.to.indexOf(order.state);
    return stateIndex === -1 ? currentPossibilities.to[0] : currentPossibilities.to[stateIndex + 1];
  });

  const submit = async () => {
    if (beforeSubmits.length) {
      for (const beforeSubmit of beforeSubmits) {
        await beforeSubmit?.();
      }
    }
    onConfirm(value);
  };

  useEffect(() => {
    const stored = getModalComponents('manual-order-state');
    setComponents(
      stored.map((component, index) => {
        return (
          <React.Fragment key={index}>
            {React.createElement(component, {
              data: {
                state: value,
                setState: setValue,
                order,
                setBeforeSubmit: (beforeSubmit: () => Promise<void> | undefined) => {
                  setBeforeSubmits((prev) => {
                    const newBeforeSubmits = [...prev];
                    newBeforeSubmits[index] = beforeSubmit;
                    return newBeforeSubmits;
                  });
                },
              },
            })}
          </React.Fragment>
        );
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
