import { CF, EntityCustomFields } from '@/components';
import { ORDER_STATE } from '@/graphql/base';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Mode,
  OrderDetailType,
  ScrollArea,
  apiClient,
  useOrder,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  line: OrderDetailType['lines'][number];
  order?: OrderDetailType;
  mode?: Mode;
};

export const OrderLineCustomFields = ({ line, order, mode }: Props) => {
  const { setModifiedOrder } = useOrder(({ setModifiedOrder }) => ({ setModifiedOrder }));
  const orderLineCustomFields = useServer(
    (p) => p.serverConfig?.entityCustomFields?.find((el) => el.entityName === 'OrderLine')?.customFields || [],
  );
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  if (!order) return null;

  return (
    <>
      {!!orderLineCustomFields?.length && (
        <Button variant="outline" className="h-8 self-end p-0 px-4" onClick={() => setOpen(true)}>
          {t('show')}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[60vw]">
          <DialogTitle>{line.productVariant.name}</DialogTitle>
          <ScrollArea className="max-h-[90vh]">
            <EntityCustomFields
              additionalData={{ product: line.productVariant.product, variant: line.productVariant }}
              entityName="orderLine"
              id={line.id}
              hideButton={mode === 'create' || mode === 'view'}
              disabled={mode === 'view'}
              fetch={async (runtimeSelector) => {
                const orderLine = order.lines.find((l) => l.id === line.id);
                return orderLine && 'customFields' in orderLine
                  ? { customFields: orderLine.customFields as CF }
                  : { customFields: {} };
              }}
              mutation={async (customFields) => {
                console.log(mode, customFields);
                if (mode === 'update') {
                  setModifiedOrder({
                    ...order,
                    lines: order.lines.map((l) => (l.id === line.id ? { ...l, customFields } : l)),
                  });
                  setOpen(false);
                }
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
