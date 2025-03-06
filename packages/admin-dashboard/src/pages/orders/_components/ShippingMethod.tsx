'use client';

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
  useOrder,
  OrderDetailSelector,
} from '@deenruv/react-ui-devkit';
import { type EligibleShippingMethodsType, eligibleShippingMethodsSelector } from '@/graphql/draft_order';
import { priceFormatter } from '@/utils';
import { Edit, Truck, Package, CheckCircle, AlertCircle, Check } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
          '...on Order': OrderDetailSelector,
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

  // Determine card border color based on state
  const cardBorderColor = useMemo(() => {
    if (mode !== 'create') return 'border-primary';
    return order?.shippingLines?.length ? 'border-green-500' : 'border-orange-500';
  }, [mode, order?.shippingLines?.length]);

  // Determine status icon and color
  const StatusIcon = useMemo(() => {
    if (!order?.lines.length) return AlertCircle;
    return selectedShipping ? Check : AlertCircle;
  }, [order?.lines.length, selectedShipping]);

  const statusColor = useMemo(() => {
    if (!order?.lines.length) return 'text-orange-500';
    return selectedShipping ? 'text-green-500' : 'text-orange-500';
  }, [order?.lines.length, selectedShipping]);

  return (
    <Card className={cn('shadow-sm transition-all duration-200 hover:shadow-md', cardBorderColor)}>
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="text-primary h-5 w-5" />
            <CardTitle className="text-base font-semibold">{t('selectShipmentMethod.cardTitle')}</CardTitle>
          </div>
          {mode !== 'view' && (
            <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
              <DialogTrigger disabled={!order?.lines.length}>
                {!order?.lines.length ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Edit size={18} className="text-muted-foreground cursor-not-allowed opacity-50" />
                      </TooltipTrigger>
                      <TooltipContent align="end" className="border border-red-200 bg-red-50">
                        <p className="text-xs text-red-500">{t('selectShipmentMethod.noSelectedTip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="bg-primary/10 hover:bg-primary/20 rounded-full p-1.5 transition-colors">
                    <Edit size={16} className="text-primary cursor-pointer" />
                  </div>
                )}
              </DialogTrigger>
              <DialogContent className="max-w-[70vw] p-6">
                <div className="flex flex-col gap-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Truck className="text-primary h-5 w-5" />
                      {t('selectShipmentMethod.setMethodTitle')}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2">
                      {t('selectShipmentMethod.setMethodDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {shippingMethods.map((shippingMethod) => (
                      <div key={shippingMethod.id} className="w-full">
                        <button
                          onClick={() => setLocalSelectedShippingMethod(shippingMethod.id)}
                          className={cn(
                            'relative flex w-full flex-col gap-2 rounded-lg border p-4 transition-all',
                            'hover:border-primary/70 hover:shadow-sm',
                            localSelectedShippingMethod === shippingMethod.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border',
                          )}
                        >
                          {localSelectedShippingMethod === shippingMethod.id && (
                            <div className="absolute right-2 top-2">
                              <Check className="text-primary h-4 w-4" />
                            </div>
                          )}
                          <div className="mb-1 flex items-center gap-2">
                            <Package className="text-primary h-4 w-4" />
                            <h3 className="text-base font-medium">{shippingMethod.name}</h3>
                          </div>
                          <p className="text-muted-foreground bg-muted w-fit rounded-md px-2 py-1 text-xs">
                            {shippingMethod.code}
                          </p>
                          <div className="border-border mt-2 w-full border-t pt-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-muted-foreground text-xs">Base price: </span>
                              <span className="text-sm font-medium">
                                {priceFormatter(shippingMethod.price, order?.currencyCode)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span className="text-muted-foreground text-xs">With tax: </span>
                              <span className="text-primary text-sm font-medium">
                                {priceFormatter(shippingMethod.priceWithTax, order?.currencyCode)}
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    disabled={!localSelectedShippingMethod || !order?.id}
                    className="px-6"
                    onClick={async () => {
                      const method = shippingMethods.find((method) => method.id === localSelectedShippingMethod);
                      if (method && order?.id) await selectShippingMethod(order.id, method.id);
                    }}
                  >
                    {t('selectShipmentMethod.save')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <CardDescription className="text-muted-foreground mb-3 text-sm">
          {t('selectShipmentMethod.cardDescription')}
        </CardDescription>

        <div className="bg-muted/50 border-border mt-2 rounded-lg border p-3">
          <div className="flex items-start gap-3">
            <StatusIcon className={cn('mt-0.5 h-5 w-5', statusColor)} />
            <div className="flex-1">
              {!order?.lines.length ? (
                <p className="text-muted-foreground text-sm">{t('selectShipmentMethod.noSelectedTip')}</p>
              ) : (
                <div className="space-y-1">
                  {selectedShipping ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Method:</Label>
                        <span className="text-sm">{selectedShipping.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Code:</Label>
                        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                          {selectedShipping.code}
                        </span>
                      </div>
                      <div className="border-border mt-1 flex items-center justify-between border-t pt-1">
                        <Label className="text-sm font-medium">Price:</Label>
                        <span className="text-primary text-sm font-semibold">
                          {priceFormatter(order?.shipping || 0, order?.currencyCode)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">{t('selectShipmentMethod.noSelected')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
