'use client';

import type React from 'react';

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  ScrollArea,
  Table,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useServer,
  Badge,
  priceFormatter,
  generateInputComponents,
  usePluginStore,
  Label,
} from '@deenruv/react-ui-devkit';
import type { DraftOrderType } from '@/graphql/draft_order';
import { LineItem } from './LineItem.js';
import { useGFFLP } from '@/lists/useGflp';
import type { ResolverInputTypes } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Package,
  Truck,
  MapPin,
  User,
  Building,
  Phone,
  Box,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  disabled?: boolean;
  order: DraftOrderType;
  onSubmitted: (data: ResolverInputTypes['FulfillOrderInput']) => Promise<void>;
}

export const FulfillmentModal: React.FC<Props> = ({ order, onSubmitted, disabled }) => {
  const { t } = useTranslation('orders');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const neededFulfillmentHandlers = order?.shippingLines?.map((line) => line.shippingMethod.fulfillmentHandlerCode);
  const { getInputComponent } = usePluginStore();

  const filteredFulfillmentHandlers = useServer((p) =>
    p.fulfillmentHandlers.filter((handler) => neededFulfillmentHandlers.includes(handler?.code)),
  );

  const { state, setField } = useGFFLP('FulfillOrderInput')({
    lines: {
      initialValue: order.lines.map((line) => ({
        orderLineId: line.id,
        quantity: line.quantity || 1,
        customFields: {},
      })),
    },
    handler: {
      initialValue: {
        code: filteredFulfillmentHandlers[0]?.code,
        arguments: filteredFulfillmentHandlers[0]?.args.map((arg) => ({
          name: arg.name,
          value: JSON.stringify(arg.defaultValue),
        })),
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.lines?.value || !state.handler?.value) return;

    const lines = state.lines?.value.map((line) => ({
      orderLineId: line.orderLineId,
      quantity: line.quantity,
    }));

    setIsSubmitting(true);
    try {
      await onSubmitted({ lines, handler: state.handler?.value });
      toast.success(t('fulfillment.successMessage', 'Order fulfilled successfully'));
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t('fulfillment.errorMessage', 'Failed to fulfill order'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" className="gap-2">
          <Package className="h-4 w-4" />
          {t('fulfillment.completeOrderButton', 'Fulfill Order')}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-w-[80vw] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Truck className="text-primary h-5 w-5" />
            <DialogTitle>{t('fulfillment.completeDialogTitle', 'Complete Order Fulfillment')}</DialogTitle>
          </div>
          <DialogDescription>
            {t(
              'fulfillment.completeDialogDescription',
              'Prepare items for shipping and complete the fulfillment process',
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full w-full flex-col overflow-y-auto md:flex-row">
          {/* Left column - Products */}
          <div className="flex h-full w-full flex-col border-r p-6 md:w-1/2">
            <div className="mb-4 flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="text-lg font-medium">{t('fulfillment.itemsToFulfill', 'Items to Fulfill')}</h3>
            </div>

            <ScrollArea className="h-[calc(100%-3rem)] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow noHover className="bg-muted/50">
                    <TableHead className="py-3">{t('fulfillment.product', 'Product')}</TableHead>
                    <TableHead className="py-3">{t('fulfillment.sku', 'SKU')}</TableHead>
                    <TableHead className="py-3">{t('fulfillment.fulfilled', 'Quantity')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  {order?.lines.length ? (
                    order.lines.map((line) => {
                      const onStock = line.productVariant.stockLevels.reduce(
                        (acc, stock) => acc + stock.stockOnHand,
                        0,
                      );
                      const stateLine = state.lines?.value?.find((l) => l.orderLineId === line.id);
                      const isLowStock = onStock < line.quantity;

                      return (
                        <LineItem key={line.id} variant={line.productVariant}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    className="w-20"
                                    value={stateLine?.quantity}
                                    onChange={(e) => {
                                      const value = state.lines?.value;
                                      if (!value) return;
                                      const index = value.findIndex((v) => v.orderLineId === line.id);
                                      if (index === -1) return;
                                      if (Number.parseInt(e.target.value) < 1) return;
                                      if (Number.parseInt(e.target.value) <= line.quantity) {
                                        value[index].quantity = Number.parseInt(e.target.value);
                                        setField('lines', value);
                                      }
                                    }}
                                  />
                                  <span className="text-muted-foreground text-sm">/ {line.quantity}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  {isLowStock ? (
                                    <div className="flex items-center gap-1 text-amber-500">
                                      <AlertCircle className="h-4 w-4" />
                                      <p className="text-xs font-medium">{t('fulfillment.lowStock', 'Low stock')}</p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-green-500">
                                      <CheckCircle2 className="h-4 w-4" />
                                      <p className="text-xs font-medium">{t('fulfillment.inStock', 'In stock')}</p>
                                    </div>
                                  )}
                                </div>

                                <p className="text-muted-foreground text-xs">
                                  {t('fulfillment.onStockValue', { value: onStock })}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </LineItem>
                      );
                    })
                  ) : (
                    <TableRow noHover>
                      <TableCell colSpan={4} className="text-muted-foreground py-6 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                            <Box className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                          </div>
                          <p>{t('fulfillment.emptyState', 'No items to fulfill')}</p>
                          <p className="text-muted-foreground text-xs">
                            {t('fulfillment.emptyStateHint', 'Add products to the order before fulfillment')}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="flex h-full w-full flex-col p-6 md:w-1/2">
            <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6">
              <Card className="border-l-4 border-l-blue-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-blue-400">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <CardTitle className="text-lg">{t('fulfillment.shippingAddress', 'Shipping Address')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          <p className="text-muted-foreground text-xs font-medium">{t('fullName', 'Full Name')}</p>
                        </div>
                        <p className="text-sm font-medium">{order.shippingAddress?.fullName || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building className="text-muted-foreground h-4 w-4" />
                          <p className="text-muted-foreground text-xs font-medium">{t('company', 'Company')}</p>
                        </div>
                        <p className="text-sm font-medium">{order.shippingAddress?.company || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-muted-foreground h-4 w-4" />
                          <p className="text-muted-foreground text-xs font-medium">{t('street1', 'Street Address')}</p>
                        </div>
                        <p className="text-sm font-medium">{order.shippingAddress?.streetLine1 || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t('street2', 'Street Address 2')}</p>
                        <p className="text-sm font-medium">{order.shippingAddress?.streetLine2 || '—'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t('city', 'City')}</p>
                        <p className="text-sm font-medium">{order.shippingAddress?.city || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t('postalCode', 'Postal Code')}</p>
                        <p className="text-sm font-medium">{order.shippingAddress?.postalCode || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t('country', 'Country')}</p>
                        <p className="text-sm font-medium">{order.shippingAddress?.country || '—'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="text-muted-foreground h-4 w-4" />
                          <p className="text-muted-foreground text-xs font-medium">
                            {t('phoneNumber', 'Phone Number')}
                          </p>
                        </div>
                        <p className="text-sm font-medium">{order.shippingAddress?.phoneNumber || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      {t('fulfillment.shippingMethod', 'Shipping Method')}
                    </p>
                    {order.shippingLines.map((line) => (
                      <div key={line.id} className="bg-muted/50 flex items-center justify-between rounded-md p-2">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="font-medium">{line.shippingMethod.name}</span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {priceFormatter(line.priceWithTax, order.currencyCode)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 border-l-4 border-l-green-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-green-400">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-500 dark:text-green-400" />
                    <CardTitle className="text-lg">
                      {t('fulfillment.fulfillmentOptions', 'Fulfillment Options')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ScrollArea className="flex-1 pr-4">
                    {filteredFulfillmentHandlers.map((handler) => {
                      return (
                        <div key={handler.code} className="mb-4 rounded-md border p-4 shadow-sm">
                          <div className="mb-3 flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                              <Tag className="h-3.5 w-3.5 text-green-500" />
                              <span className="font-mono text-xs">{handler.code}</span>
                            </Badge>
                            <h4 className="font-medium">
                              {t(`fulfillment.handlers.${handler.code}.title`, handler.code)}
                            </h4>
                          </div>
                          <p className="text-muted-foreground mb-4 text-sm">
                            {t(`fulfillment.handlers.${handler.code}.description`, 'Configure fulfillment options')}
                          </p>
                          <div className="space-y-3">
                            {handler?.args.map((argument) => {
                              return generateInputComponents(
                                [
                                  {
                                    ...argument,
                                    label: [{ languageCode: 'en', value: argument.label || argument.name }],
                                    description: [{ languageCode: 'en', value: argument.description || '' }],
                                  },
                                ],
                                getInputComponent,
                              ).map((field) => {
                                return (
                                  <div key={field.name} className="space-y-1">
                                    <div>
                                      <Label className="text-sm font-medium">{field.name}</Label>
                                    </div>
                                    {field.component}
                                  </div>
                                );
                              });

                              return (
                                <div key={argument.name} className="space-y-1">
                                  <Input
                                    label={t(`fulfillment.handlers.${handler.code}.${argument.name}`, argument.name)}
                                    value={
                                      state.handler?.value.arguments?.find((a) => a.name === argument.name)?.value ===
                                      'null'
                                        ? ''
                                        : state.handler?.value.arguments?.find((a) => a.name === argument.name)?.value
                                    }
                                    onChange={(e) => {
                                      const value = [...(state.handler?.value.arguments || [])];
                                      const index = value.findIndex((v) => v.name === argument.name);
                                      if (index === -1) return;
                                      value[index].name = argument.name;
                                      value[index].value = e.target.value;
                                      setField('handler', { code: handler.code, arguments: value });
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>

                  <div className="mt-auto border-t pt-4">
                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('fulfillment.processing', 'Processing...')}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          {t('fulfillment.fulfill', 'Complete Fulfillment')}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
