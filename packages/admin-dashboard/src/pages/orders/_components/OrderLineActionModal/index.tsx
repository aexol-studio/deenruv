import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OnPriceQuantityChangeApproveInput, OrderLineActions } from './types.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@deenruv/react-ui-devkit';
import { ActionAttributes } from './ActionAttributes.js';
import { ActionQuantityPrice } from './ActionQuantityPrice.js';

import { DraftOrderLineType } from '@/graphql/draft_order';

interface OrderLineActonModalProps {
  line?: DraftOrderLineType;
  action?: OrderLineActions;
  onOpenChange: (open: boolean) => void;
  onAttributesChangeApprove: (lineId: string, attributes: Record<string, string>) => void;
  onPriceQuantityChangeApprove: (input: OnPriceQuantityChangeApproveInput) => Promise<void>;
}

export const OrderLineActionModal: React.FC<OrderLineActonModalProps> = ({
  onOpenChange,
  onAttributesChangeApprove,
  onPriceQuantityChangeApprove,
  action,
  line,
}) => {
  const { t } = useTranslation('orders');

  useEffect(() => {
    if (!action) setTimeout(() => (document.body.style.pointerEvents = ''), 300);
  }, [action]);
  return (
    <Dialog open={!!action} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-[90dvw] flex-col lg:max-w-[60dvw] ">
        <DialogHeader className="m-2">
          <DialogTitle>{t(`orderLineActionModal.title.${action}`)}</DialogTitle>
          <DialogDescription>{t(`orderLineActionModal.subTitle.${action}`)}</DialogDescription>
        </DialogHeader>
        {(() => {
          switch (action) {
            case 'attributes':
              return (
                <ActionAttributes
                  onOpenChange={onOpenChange}
                  onAttributesChangeApprove={onAttributesChangeApprove}
                  line={line}
                />
              );
            case 'quantity-price':
              return (
                <ActionQuantityPrice
                  onPriceQuantityChangeApprove={onPriceQuantityChangeApprove}
                  onOpenChange={onOpenChange}
                  line={line}
                />
              );
            default:
              return null;
          }
        })()}
      </DialogContent>
    </Dialog>
  );
};
