import { useOrder, cn, Button, DialogFooter, Input } from '@deenruv/react-ui-devkit';
import { DraftOrderLineType } from '@/graphql/draft_order';

import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnPriceQuantityChangeApproveInput } from './types.js';

interface ActionQuantityPriceProps {
  line?: DraftOrderLineType;
  onOpenChange: (open: boolean) => void;
  onPriceQuantityChangeApprove: (input: OnPriceQuantityChangeApproveInput) => Promise<void>;
}

export const ActionQuantityPrice: React.FC<ActionQuantityPriceProps> = ({
  line,
  onOpenChange,
  onPriceQuantityChangeApprove,
}) => {
  const { t } = useTranslation('orders');
  const [quantityChange, setQuantityChange] = useState<number | undefined>(line?.quantity);
  const { order } = useOrder();
  const baseOrderLine = useMemo(() => order?.lines.find((l) => l.id === line?.id), [line, order?.lines]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setQuantityChange(0);
    const value = parseInt(e.currentTarget.value, 10);
    setQuantityChange(value);
  };

  const quantityDelta = useMemo(
    () => (quantityChange ? quantityChange - (baseOrderLine?.quantity ?? 0) : 0),
    [quantityChange, line?.quantity],
  );

  const handleApprove = async () => {
    if (!line?.id) return;
    onPriceQuantityChangeApprove({
      lineID: line.id,
      quantityChange: quantityChange,
    });
    onOpenChange(false);
  };

  return (
    <>
      <div className="m-2 flex grow flex-col gap-10">
        <div className="flex items-center gap-4">
          <img
            alt="Product image"
            className="aspect-square w-24 rounded-md border object-cover"
            height="96"
            width="96"
            src={line?.productVariant?.featuredAsset?.preview || line?.productVariant?.product?.featuredAsset?.preview}
          />
          <span>{line?.productVariant.name}</span>
        </div>
        <div className="flex gap-8">
          <div className="flex w-1/2 flex-col">
            <h3 className="mb-4 text-lg  font-medium">Quantity</h3>
            <div className="mb-3 flex h-full w-full flex-col gap-2">
              <span>{t('orderLineActionModal.quantityChange')}</span>
              <Input
                min={0}
                value={quantityChange}
                onChange={handleQuantityChange}
                className="w-full"
                type="number"
                placeholder={t('orderLineActionModal.changeQuantity')}
              />
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-2 gap-x-5">
              <span className="min-w-max">{t('orderLineActionModal.actualQuantity')}</span>
              <span />
              <span className="text-right">{baseOrderLine?.quantity}</span>
              <span className="text-muted-foreground">{t('orderLineActionModal.change')}</span>
              <span />
              <span
                className={cn('text-muted-foreground text-right', {
                  'text-destructive': quantityDelta < 0,
                  'text-green-500': quantityDelta > 0,
                })}
              >
                {quantityDelta > 0 ? `+ ${quantityDelta}` : quantityDelta}
              </span>
              <span className="bg-secondary col-span-3 h-[1px]"></span>
              <span className="min-w-max">{t('orderLineActionModal.quantityAfter')}</span>
              <span />
              <span className="text-right">{(quantityChange ?? 0) > 0 ? quantityChange : line?.quantity}</span>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button onClick={() => onOpenChange(false)} variant="ghost">
          {t('orderLineActionModal.cancel')}
        </Button>
        <Button onClick={handleApprove}>{t('orderLineActionModal.save')}</Button>
      </DialogFooter>
    </>
  );
};
