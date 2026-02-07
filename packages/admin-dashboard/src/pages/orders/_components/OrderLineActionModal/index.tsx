import type React from 'react';
import type { OnPriceQuantityChangeApproveInput } from './types.js';
import { useTranslation, Dialog, DialogContent, DialogHeader, DialogTitle } from '@deenruv/react-ui-devkit';
import { ActionQuantityPrice } from './ActionQuantityPrice.js';

import type { DraftOrderLineType } from '@/graphql/draft_order';

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
      <DialogContent className="flex max-w-[90dvw] flex-col rounded-lg border-0 p-0 shadow-lg sm:max-w-[550px] lg:max-w-[650px]">
        <DialogHeader className="border-b bg-muted/30 p-6">
          <DialogTitle className="text-xl font-semibold">{t(`orderLineActionModal.title.!TODO`)}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t(`orderLineActionModal.subTitle.!TODO`)}</p>
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
