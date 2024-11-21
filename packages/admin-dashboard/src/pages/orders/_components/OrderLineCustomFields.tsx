import { EntityCustomFields } from '@/components';
import { ORDER_STATE } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { DraftOrderType } from '@/graphql/draft_order';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

type Props = {
  line: DraftOrderType['lines'][number];
  order: DraftOrderType;
};

export const OrderLineCustomFields = ({ line, order }: Props) => {
  const orderLineCustomFields = useServer(
    (p) => p.serverConfig?.entityCustomFields?.find((el) => el.entityName === 'OrderLine')?.customFields || [],
  );
  const { t } = useTranslation('common');

  return (
    <Dialog>
      <DialogTrigger asChild>
        {!!orderLineCustomFields?.length && (
          <Button variant={'action'} className="self-end">
            {t('show')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[60vw]">
        <DialogTitle>{line.productVariant.name}</DialogTitle>
        <ScrollArea className="max-h-[90vh]">
          <EntityCustomFields
            entityName="orderLine"
            id={line.id}
            disabled={order.state !== ORDER_STATE.DRAFT && !order?.nextStates.includes(ORDER_STATE.MODIFYING)}
            fetch={async (runtimeSelector) => {
              const { order: orderResponse } = await apiCall()('query')({
                order: [{ id: order.id }, { lines: { id: true, ...runtimeSelector } }],
              });
              const foundLine = orderResponse?.lines?.find((el) => el.id === line.id);
              return { customFields: foundLine?.customFields as any };
            }}
            mutation={async (customFields) => {
              const currentState = order.state;
              const orderId = order.id;

              if (currentState === ORDER_STATE.DRAFT) {
                const { adjustDraftOrderLine } = await apiCall()('mutation')({
                  adjustDraftOrderLine: [
                    {
                      orderId,
                      input: { orderLineId: line.id, quantity: line.quantity, customFields },
                    },
                    { '...on Order': { id: true } },
                  ],
                });
                if (!adjustDraftOrderLine?.id) throw new Error();
                return;
              }

              if (!order?.nextStates.includes(ORDER_STATE.MODIFYING)) throw new Error("Order can't be edited.");

              await apiCall()('mutation')({
                transitionOrderToState: [
                  { id: orderId, state: ORDER_STATE.MODIFYING },
                  { '...on Order': { id: true } },
                ],
              });

              const { modifyOrder } = await apiCall()('mutation')({
                modifyOrder: [
                  {
                    input: {
                      orderId: orderId,
                      dryRun: false,
                      adjustOrderLines: [{ orderLineId: line.id, quantity: line.quantity, customFields }],
                    },
                  },
                  {
                    '...on Order': {
                      id: true,
                    },
                  },
                ],
              });

              const { transitionOrderToState } = await apiCall()('mutation')({
                transitionOrderToState: [{ id: orderId, state: currentState }, { '...on Order': { id: true } }],
              });

              if (!modifyOrder?.id || !transitionOrderToState?.id) throw new Error();
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
