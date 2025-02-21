import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OnPriceQuantityChangeApproveInput, OrderLineActions } from './types.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@deenruv/react-ui-devkit';
import { ActionAttributes } from './ActionAttributes.js';
import { ActionQuantityPrice } from './ActionQuantityPrice.js';

import { DraftOrderLineType } from '@/graphql/draft_order';

interface OrderLineActonModalProps {
  line?: DraftOrderLineType;
  onOpenChange: (open: boolean) => void;
  onPriceQuantityChangeApprove: (input: OnPriceQuantityChangeApproveInput) => Promise<void>;
}

export const OrderLineActionModal: React.FC<OrderLineActonModalProps> = ({
  onOpenChange,
  onPriceQuantityChangeApprove,
  line,
}) => {
  const { t } = useTranslation('orders');

  return (
    <Dialog open={!!line} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-[90dvw] flex-col lg:max-w-[60dvw] ">
        <DialogHeader className="m-2">
          <DialogTitle>{t(`orderLineActionModal.title.!TODO`)}</DialogTitle>
          <DialogDescription>{t(`orderLineActionModal.subTitle.!TODO`)}</DialogDescription>
        </DialogHeader>
        <ActionQuantityPrice
          onPriceQuantityChangeApprove={onPriceQuantityChangeApprove}
          onOpenChange={onOpenChange}
          line={line}
        />
      </DialogContent>
    </Dialog>
  );
};
