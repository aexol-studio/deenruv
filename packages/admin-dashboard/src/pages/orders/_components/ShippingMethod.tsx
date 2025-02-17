import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  apiClient,
  cn,
} from '@deenruv/react-ui-devkit';
import {
  EligibleShippingMethodsType,
  draftOrderSelector,
  eligibleShippingMethodsSelector,
} from '@/graphql/draft_order';
import { priceFormatter } from '@/utils';
import { Edit } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useOrder } from '@/state/order';

export const ShippingMethod: React.FC = () => {
  const { mode, order, setOrder, modifiedOrder, setModifiedOrder } = useOrder();
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const { t } = useTranslation('orders');
  const [open, setOpen] = useState(false);
  const [localSelectedShippingMethod, setLocalSelectedShippingMethod] = useState<string | undefined>(undefined);

  const [shippingMethods, setShippingMethods] = useState<EligibleShippingMethodsType[]>([]);
  const selectedShipping = useMemo(
    () => shippingMethods.find((method) => method.id === currentOrder?.shippingLines?.[0]?.shippingMethod.id),
    [shippingMethods, currentOrder],
  );

  useEffect(() => {
    const fetch = async () => {
      if (order && order.id) {
        const { eligibleShippingMethodsForDraftOrder } = await apiClient('query')({
          eligibleShippingMethodsForDraftOrder: [{ orderId: order.id }, eligibleShippingMethodsSelector],
        });
        if (!eligibleShippingMethodsForDraftOrder) {
          toast.error(t('toasts.orderLoadingDraftShippingError', { value: order.id }));
        }
        setShippingMethods(eligibleShippingMethodsForDraftOrder);
      }
    };
    fetch();
  }, [order, t]);

  const selectShippingMethod = async (orderId: string, shippingMethodId: string) => {
    if (mode === 'update' && selectedShipping && modifiedOrder) {
      const currentShipping = shippingMethods.find((m) => m.id === shippingMethodId);
      setModifiedOrder({
        ...modifiedOrder,
        shippingLines: [
          {
            ...modifiedOrder.shippingLines[0],
            price: modifiedOrder.shippingLines[0].price,
            priceWithTax: modifiedOrder.shippingLines[0].priceWithTax,
            shippingMethod: {
              ...modifiedOrder.shippingLines[0].shippingMethod,
              id: currentShipping!.id,
              name: currentShipping!.name,
              code: currentShipping!.code,
            },
          },
        ],
      });

      setOpen(false);
      return;
    }

    const { setDraftOrderShippingMethod } = await apiClient('mutation')({
      setDraftOrderShippingMethod: [
        { orderId, shippingMethodId },
        {
          __typename: true,
          '...on Order': draftOrderSelector,
          '...on IneligibleShippingMethodError': { message: true, errorCode: true },
          '...on NoActiveOrderError': { message: true, errorCode: true },
          '...on OrderModificationError': { message: true, errorCode: true },
        },
      ],
    });
    if (setDraftOrderShippingMethod.__typename === 'Order') {
      setOrder(setDraftOrderShippingMethod);
      toast.success(t('selectShipmentMethod.shippingAdded'));
      setOpen(false);
    } else toast.error(`${setDraftOrderShippingMethod.errorCode}: ${setDraftOrderShippingMethod.message}`);
  };

  return (
    <Card
      className={cn(
        mode !== 'create' ? 'border-primary' : order?.shippingLines?.length ? 'border-green-500' : 'border-orange-800',
      )}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">
          {t('selectShipmentMethod.cardTitle')}
          {mode !== 'view' && (
            <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
              <DialogTrigger disabled={!order?.lines.length}>
                {!order?.lines.length ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Edit size={20} className={cn('text-muted-foreground cursor-not-allowed self-center')} />
                      </TooltipTrigger>
                      <TooltipContent align="end" className="bg-red-50">
                        <p className="text-red-400">{t('selectShipmentMethod.noSelectedTip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Edit size={20} className={cn('cursor-pointer  self-center')} />
                )}
              </DialogTrigger>
              <DialogContent className="max-w-[60vw]">
                <div className="flex flex-col gap-8">
                  <DialogHeader>
                    <DialogTitle>{t('selectShipmentMethod.setMethodTitle')}</DialogTitle>
                    <DialogDescription>{t('selectShipmentMethod.setMethodDescription')}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-wrap">
                    {shippingMethods.map((shippingMethod) => (
                      <div key={shippingMethod.id} className="w-1/4 p-1">
                        <button
                          onClick={() => setLocalSelectedShippingMethod(shippingMethod.id)}
                          className={cn(
                            'relative flex w-full flex-col gap-2 rounded-md border p-4',
                            localSelectedShippingMethod === shippingMethod.id
                              ? 'border-primary'
                              : 'border-primary-foreground',
                          )}
                        >
                          <div className="flex flex-col items-start">
                            <h3 className="text-lg">{shippingMethod.name}</h3>
                            <p className="text-sm">{shippingMethod.code}</p>
                          </div>
                          <div className="flex flex-col items-start">
                            <h3 className="text-sm">Price without tax</h3>
                            <p className="text-sm">{priceFormatter(shippingMethod.price, order?.currencyCode)}</p>
                          </div>
                          <div className="flex flex-col items-start">
                            <h3 className="text-sm">Price with tax</h3>
                            <p className="text-sm">
                              {priceFormatter(shippingMethod.priceWithTax, order?.currencyCode)}
                            </p>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  disabled={!localSelectedShippingMethod || !order?.id}
                  className="w-min place-self-end "
                  onClick={async () => {
                    const method = shippingMethods.find((method) => method.id === localSelectedShippingMethod);
                    if (method && order?.id) await selectShippingMethod(order.id, method.id);
                  }}
                >
                  {t('selectShipmentMethod.save')}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>

        <CardDescription>{t('selectShipmentMethod.cardDescription')}</CardDescription>
        {!order?.lines.length ? (
          <Label className="text-muted-foreground text-sm">
            <p>{t('selectShipmentMethod.noSelectedTip')}</p>
          </Label>
        ) : (
          <div className="flex flex-col">
            {selectedShipping ? (
              <>
                <Label className="text-muted-foreground text-sm">{selectedShipping.name}</Label>
                <Label className="text-muted-foreground text-sm">{selectedShipping.code}</Label>
                <Label className="text-muted-foreground text-sm">
                  {priceFormatter(order?.shipping || 0, order?.currencyCode)}
                </Label>
              </>
            ) : (
              <Label className="text-muted-foreground text-sm">{t('selectShipmentMethod.noSelected')}</Label>
            )}
          </div>
        )}
      </CardHeader>
    </Card>
  );
};
