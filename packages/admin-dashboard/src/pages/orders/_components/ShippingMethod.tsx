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
  Badge,
} from '@deenruv/react-ui-devkit';
import { type EligibleShippingMethodsType, eligibleShippingMethodsSelector } from '@/graphql/draft_order';
import { priceFormatter } from '@/utils';
import { Edit, Truck, Package, AlertCircle, Check, Loader2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingMethods, setShippingMethods] = useState<EligibleShippingMethodsType[]>([]);
  const selectedShipping = useMemo(
    () => shippingMethods.find((method) => method.id === currentOrder?.shippingLines?.[0]?.shippingMethod.id),
    [shippingMethods, currentOrder],
  );
  useEffect(() => {
    const fetch = async () => {
      if (order && order.id) {
        setIsLoading(true);
        try {
          const { eligibleShippingMethodsForDraftOrder } = await apiClient('query')({
            eligibleShippingMethodsForDraftOrder: [{ orderId: order.id }, eligibleShippingMethodsSelector],
          });
          if (!eligibleShippingMethodsForDraftOrder) {
            toast.error(t('toasts.orderLoadingDraftShippingError', { value: order.id }));
          }
          setShippingMethods(eligibleShippingMethodsForDraftOrder);

          // Set the currently selected method when opening the dialog
          if (currentOrder?.shippingLines?.[0]?.shippingMethod.id) {
            setLocalSelectedShippingMethod(currentOrder.shippingLines[0].shippingMethod.id);
          }
        } catch (error) {
          toast.error(t('toasts.orderLoadingDraftShippingError', { value: order.id }));
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetch();
  }, [t, currentOrder]);

  const selectShippingMethod = async (orderId: string, shippingMethodId: string) => {
    setIsSubmitting(true);
    try {
      if (mode === 'update' && selectedShipping && modifiedOrder) {
        const currentShipping = shippingMethods.find((m) => m.id === shippingMethodId);
        if (!currentShipping) {
          toast.error(t('selectShipmentMethod.methodNotFound', 'Selected shipping method not found'));
          return;
        }

        setModifiedOrder({
          ...modifiedOrder,
          shippingLines: [
            {
              ...modifiedOrder.shippingLines[0],
              price: currentShipping.price,
              priceWithTax: currentShipping.priceWithTax,
              shippingMethod: {
                ...modifiedOrder.shippingLines[0].shippingMethod,
                id: currentShipping.id,
                name: currentShipping.name,
                code: currentShipping.code,
              },
            },
          ],
        });

        toast.success(t('selectShipmentMethod.shippingAdded', 'Shipping method updated successfully'));
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
        toast.success(t('selectShipmentMethod.shippingAdded', 'Shipping method added successfully'));
        setOpen(false);
      } else {
        toast.error(`${setDraftOrderShippingMethod.errorCode}: ${setDraftOrderShippingMethod.message}`);
      }
    } catch (error) {
      toast.error(t('selectShipmentMethod.error', 'Failed to set shipping method'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-orange-400">
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            <CardTitle className="text-base font-semibold">
              {t('selectShipmentMethod.cardTitle', 'Shipping Method')}
            </CardTitle>
          </div>
          {mode !== 'view' && (
            <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
              {!order?.lines.length ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-not-allowed opacity-50">
                        <Edit size={16} className="text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="border border-red-200 bg-red-50">
                      <p className="text-xs text-red-500">
                        {t('selectShipmentMethod.noSelectedTip', 'Add products to the order first')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit size={16} className="text-orange-500 dark:text-orange-400" />
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent className="max-w-[70vw] p-6">
                <div className="flex flex-col gap-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Truck className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                      {t('selectShipmentMethod.setMethodTitle', 'Select Shipping Method')}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-2">
                      {t('selectShipmentMethod.setMethodDescription', 'Choose how this order will be delivered')}
                    </DialogDescription>
                  </DialogHeader>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        {t('selectShipmentMethod.loading', 'Loading shipping methods...')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {shippingMethods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                          <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                            <AlertCircle className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {t('selectShipmentMethod.noMethods', 'No shipping methods available')}
                            </p>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {t(
                                'selectShipmentMethod.noMethodsHint',
                                'Make sure the order has products and a shipping address',
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {shippingMethods.map((shippingMethod) => (
                            <div key={shippingMethod.id} className="w-full">
                              <button
                                onClick={() => setLocalSelectedShippingMethod(shippingMethod.id)}
                                className={cn(
                                  'relative flex w-full flex-col gap-2 rounded-lg border p-4 transition-all',
                                  'hover:border-orange-500/70 hover:shadow-sm',
                                  localSelectedShippingMethod === shippingMethod.id
                                    ? 'border-orange-500 bg-orange-50 shadow-sm dark:border-orange-400 dark:bg-orange-900/10'
                                    : 'border-border',
                                )}
                              >
                                {localSelectedShippingMethod === shippingMethod.id && (
                                  <div className="absolute right-2 top-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                  </div>
                                )}
                                <div className="mb-1 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                  <h3 className="text-base font-medium">{shippingMethod.name}</h3>
                                </div>
                                <Badge variant="outline" className="w-fit text-xs">
                                  {shippingMethod.code}
                                </Badge>
                                <div className="border-border mt-2 w-full border-t pt-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-muted-foreground text-xs">Base price: </span>
                                    <span className="text-sm font-medium">
                                      {priceFormatter(shippingMethod.price, order?.currencyCode)}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center justify-between gap-2">
                                    <span className="text-muted-foreground text-xs">With tax: </span>
                                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                      {priceFormatter(shippingMethod.priceWithTax, order?.currencyCode)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button
                    disabled={!localSelectedShippingMethod || !order?.id || isSubmitting || isLoading}
                    className="gap-2"
                    onClick={async () => {
                      const method = shippingMethods.find((method) => method.id === localSelectedShippingMethod);
                      if (method && order?.id) await selectShippingMethod(order.id, method.id);
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('common.processing', 'Processing...')}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {t('selectShipmentMethod.save', 'Save Shipping Method')}
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <CardDescription className="text-muted-foreground mb-3 text-sm">
          {t('selectShipmentMethod.cardDescription', 'Choose how this order will be delivered to the customer')}
        </CardDescription>

        <div className="border-border bg-muted/50 mt-2 rounded-lg border p-3">
          <div className="flex items-start gap-3">
            {!order?.lines.length ? (
              <>
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm italic">
                    {t('selectShipmentMethod.noSelectedTip', 'Add products to the order first')}
                  </p>
                </div>
              </>
            ) : !selectedShipping ? (
              <>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm italic">
                    {t('selectShipmentMethod.noSelected', 'No shipping method selected')}
                  </p>
                  {mode !== 'view' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 gap-2"
                      onClick={() => {
                        if (order?.lines.length) setOpen(true);
                      }}
                      disabled={!order?.lines.length}
                    >
                      <Truck className="h-3.5 w-3.5" />
                      {t('selectShipmentMethod.addMethod', 'Add Shipping Method')}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Truck className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{t('selectShipmentMethod.method')}</Label>
                      <span className="text-sm font-medium">{selectedShipping.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{t('selectShipmentMethod.code')}</Label>
                      <Badge variant="outline" className="text-xs">
                        {selectedShipping.code}
                      </Badge>
                    </div>
                    <div className="border-border mt-1 flex items-center justify-between border-t pt-2">
                      <Label className="text-sm font-medium">{t('selectShipmentMethod.price')}</Label>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {priceFormatter(selectedShipping?.priceWithTax || 0, currentOrder?.currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
