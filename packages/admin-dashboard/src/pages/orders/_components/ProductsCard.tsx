'use client';

import type React from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Label,
  Table,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Dialog,
  DialogContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  apiClient,
  cn,
  useServer,
  useOrder,
} from '@deenruv/react-ui-devkit';
import {
  type DraftOrderLineType,
  type ProductVariantType,
  removeOrderItemsResultSelector,
  updateOrderItemsSelector,
  updatedDraftOrderSelector,
} from '@/graphql/draft_order';
import { EllipsisVertical, InfoIcon, Trash2, ShoppingCart, Package, Tag, Edit, CircleOff } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { priceFormatter } from '@/utils';
import { toast } from 'sonner';
import type { OnPriceQuantityChangeApproveInput } from './OrderLineActionModal/types.js';
import { OrderLineActionModal } from './OrderLineActionModal/index.js';
import { CustomComponent } from './CustomComponent.js';
import { OrderLineCustomFields } from './OrderLineCustomFields.js';
import { type CF, ImageWithPreview, ProductVariantSearch } from '@/components';
import { SpecialLineItem } from './SpecialLineItem.js';

type AddItemCustomFieldsType = any;
type ProductVariantCustomFields = any;

export const ProductsCard: React.FC = () => {
  const { t } = useTranslation('orders');
  const orderLineCustomFields = useServer(
    (p) => p.serverConfig?.entityCustomFields?.find((el) => el.entityName === 'OrderLine')?.customFields || [],
  );

  const { mode, order, setOrder, setModifiedOrder, modifiedOrder, fetchOrder } = useOrder();
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType | undefined>(undefined);
  const [customFields, setCustomFields] = useState<ProductVariantCustomFields>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [orderLineId, setOrderLineId] = useState<string | undefined>();
  const [orderLineAction, setOrderLineAction] = useState<{ line: DraftOrderLineType | undefined }>();
  const isLineAddedInModify = (lineId: string) => order?.lines.findIndex((l) => l.id === lineId) === -1;

  const serializeCustomFields = (customFields: any) =>
    JSON.stringify(Object.fromEntries(Object.entries(customFields).sort(([a], [b]) => a.localeCompare(b))));

  const addToOrder = async (
    productVariant: ProductVariantType,
    quantity: number,
    customFields?: AddItemCustomFieldsType,
  ) => {
    if (!order) return;

    try {
      if (mode === 'update' && modifiedOrder) {
        const mockLine = {
          id: productVariant.id,
          quantity,
          discountedLinePrice: productVariant.price * quantity,
          unitPrice: productVariant.price,
          unitPriceWithTax: Math.round(productVariant.price * (1 + order.taxSummary[0].taxRate / 100)),
          linePrice: productVariant.price,
          linePriceWithTax: Math.round(productVariant.price * (1 + order.taxSummary[0].taxRate / 100)),
          discountedLinePriceWithTax: productVariant.priceWithTax * quantity,
          discountedUnitPrice: productVariant.price,
          discountedUnitPriceWithTax: productVariant.priceWithTax,
          productVariant,
          taxRate: order.taxSummary[0].taxRate,
          ...(customFields && { customFields }),
        };
        const existingLineIndex = modifiedOrder.lines.findIndex((line) => {
          const sameId = line.id === mockLine.id;

          // if (!customFields) {
          return sameId;
          // }

          // @ts-ignore
          // return sameId && serializeCustomFields(line.customFields) === serializeCustomFields(customFields);
        });

        let newLines;

        if (existingLineIndex !== -1) {
          newLines = modifiedOrder.lines.map((line, index) =>
            index === existingLineIndex ? { ...line, quantity: line.quantity + 1 } : line,
          );
        } else {
          newLines = [...modifiedOrder.lines, mockLine];
        }

        setModifiedOrder({
          ...modifiedOrder,
          lines: newLines,
        });
        toast.success(t('create.productAdded', 'Product added to order'));
        return;
      }

      const { addItemToDraftOrder } = await apiClient('mutation')({
        addItemToDraftOrder: [
          {
            input: {
              productVariantId: productVariant.id,
              quantity,
              ...(customFields && { customFields }),
            },
            orderId: order.id,
          },
          updatedDraftOrderSelector,
        ],
      });

      if (addItemToDraftOrder.__typename === 'Order' || addItemToDraftOrder.__typename === 'InsufficientStockError') {
        if (addItemToDraftOrder.__typename === 'Order') {
          setOrder(addItemToDraftOrder);
          toast.success(t('create.productAdded', 'Product added to order'));
        } else {
          setOrder(addItemToDraftOrder.order);
          toast.error(t('toasts.insufficientStockError', { value: productVariant.product.name }));
        }
        closeAddVariantDialog();
      }
    } catch (error) {
      toast.error(t('create.addError', 'Failed to add product'));
    }
  };

  const setQuantityTo0 = useCallback(
    (orderLineId: string) => {
      const lineIdx = modifiedOrder?.lines.findIndex((l) => l.id === orderLineId);

      if (lineIdx && modifiedOrder) {
        modifiedOrder.lines[lineIdx].quantity = 0;
        setModifiedOrder(modifiedOrder);
      }
    },
    [modifiedOrder],
  );

  const removeLineItem = async (orderLineId: string) => {
    if (!order) return;

    try {
      if (mode === 'update' && modifiedOrder) {
        setModifiedOrder({
          ...modifiedOrder,
          lines: modifiedOrder.lines.filter((l) => l.id !== orderLineId),
        });
        toast.success(t('create.productRemoved', 'Product removed from order'));
        return;
      }

      const { removeDraftOrderLine } = await apiClient('mutation')({
        removeDraftOrderLine: [{ orderId: order.id, orderLineId }, removeOrderItemsResultSelector],
      });

      if (removeDraftOrderLine.__typename === 'Order') {
        setOrder(removeDraftOrderLine);
        toast.success(t('create.productRemoved', 'Product removed from order'));
      }
    } catch (error) {
      toast.error(t('create.removeError', 'Failed to remove product'));
    }
  };

  const onPriceQuantityChangeApprove = async (input: OnPriceQuantityChangeApproveInput) => {
    if (!order) return;
    const { lineID, quantityChange } = input;

    try {
      if (mode === 'update' && modifiedOrder) {
        const editedLineIdx = modifiedOrder.lines.findIndex((l) => l.id === lineID);
        const quantity = quantityChange ? quantityChange : modifiedOrder.lines[editedLineIdx].quantity;
        const editedLine = {
          ...modifiedOrder.lines[editedLineIdx],
          quantity,
        };
        setModifiedOrder({
          ...modifiedOrder,
          lines: modifiedOrder.lines.map((l, i) => (i === editedLineIdx ? editedLine : l)),
        });
        toast.success(t('create.productUpdated', 'Product updated'));
      } else if (mode === 'create') {
        const editedLineIdx = order.lines.findIndex((l) => l.id === lineID);
        if (quantityChange) {
          const { adjustDraftOrderLine } = await apiClient('mutation')({
            adjustDraftOrderLine: [
              {
                orderId: order.id,
                input: {
                  orderLineId: order.lines[editedLineIdx].id,
                  quantity: quantityChange,
                  ...(Object.keys(customFields || {}).length > 0 && { customFields }),
                },
              },
              updateOrderItemsSelector,
            ],
          });

          if (
            adjustDraftOrderLine.__typename === 'Order' ||
            adjustDraftOrderLine.__typename === 'InsufficientStockError'
          ) {
            if (adjustDraftOrderLine.__typename === 'Order') {
              setOrder(adjustDraftOrderLine);
              toast.success(t('create.productUpdated', 'Product updated'));
            } else {
              setOrder(adjustDraftOrderLine.order);
              toast.error(
                t('toasts.insufficientStockError', { value: order.lines[editedLineIdx].productVariant.product.name }),
              );
            }
          }
        }
        fetchOrder(order.id);
      }
    } catch (error) {
      toast.error(t('create.updateError', 'Failed to update product'));
    }
  };

  const adjustLineItem = async (orderLineId: string, quantity: number, customFields: AddItemCustomFieldsType) => {
    if (!order) return;

    try {
      if (mode === 'update' && modifiedOrder) {
        const editedLineIdx = modifiedOrder.lines.findIndex((l) => l.id === orderLineId);
        const editedLine = {
          ...modifiedOrder.lines[editedLineIdx],
          quantity,
          customFields,
        };

        setModifiedOrder({
          ...modifiedOrder,
          lines: modifiedOrder.lines.map((l, i) => (i === editedLineIdx ? editedLine : l)),
        });

        setOpen(false);
        toast.success(t('create.productUpdated', 'Product updated'));
        return;
      }

      const { adjustDraftOrderLine } = await apiClient('mutation')({
        adjustDraftOrderLine: [
          {
            orderId: order.id,
            input: { orderLineId, quantity, ...(Object.keys(customFields || {}).length > 0 && { customFields }) },
          },
          updateOrderItemsSelector,
        ],
      });

      if (adjustDraftOrderLine.__typename === 'Order' || adjustDraftOrderLine.__typename === 'InsufficientStockError') {
        if (adjustDraftOrderLine.__typename === 'Order') {
          setOrder(adjustDraftOrderLine);
          toast.success(t('create.productUpdated', 'Product updated'));
        } else {
          setOrder(adjustDraftOrderLine.order);
          toast.error(t('toasts.insufficientStockError', { value: 'product' }));
        }
      }
    } catch (error) {
      toast.error(t('create.updateError', 'Failed to update product'));
    }
  };

  const openAddVariantDialog = (input: {
    variant: ProductVariantType;
    quantity?: number;
    customFields?: ProductVariantCustomFields;
    orderLineId?: string;
  }) => {
    setOpen(true);
    setOrderLineId(input.orderLineId ? input.orderLineId : undefined);
    setSelectedVariant(input.variant);
    setCustomFields({
      attributes: input.customFields?.attributes,
      discountBy: input.customFields?.discountBy,
    });
    setQuantity(input.quantity ? input.quantity : 1);
  };

  const closeAddVariantDialog = () => {
    setOpen(false);
    setSelectedVariant(undefined);
    setOrderLineId(undefined);
  };

  const onOrderLineActionModalOpenChange = (isOpen: boolean) => {
    if (isOpen) return;
    setOrderLineAction(undefined);
  };

  const handleNewVariantAdd = async (customFields?: CF) => {
    if (orderLineId) {
      await adjustLineItem(orderLineId, quantity, customFields);
      return;
    } else if (selectedVariant) {
      await addToOrder(selectedVariant, quantity, customFields);
    }
    closeAddVariantDialog();
  };

  if (!order) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={(e) => (!e ? closeAddVariantDialog() : setOpen(true))}>
        <DialogContent className="bg-background max-h-[90vh] min-h-[60vh] max-w-[65vw] overflow-auto">
          {selectedVariant ? (
            <div className="flex h-full w-full flex-col justify-between">
              <h3 className="text-primary pb-4 text-xl font-semibold">{t('create.addVariant')}</h3>
              <div className="flex h-full flex-col gap-8">
                <div className="flex h-full w-full flex-col items-center gap-2">
                  <div className="flex h-full w-full justify-between gap-4">
                    <SpecialLineItem variant={{ ...selectedVariant, quantity: 1 }} />
                    <CustomComponent onVariantAdd={handleNewVariantAdd} orderLine={selectedVariant} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex items-center justify-center p-8">
              {t('create.somethingWrong')}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="border-l-4 border-l-blue-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-blue-400">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <CardTitle className="text-xl font-semibold">
                {t(
                  mode === 'view' ? 'create.viewTitle' : mode === 'update' ? 'create.editTitle' : 'create.addTitle',
                  'Order Products',
                )}
              </CardTitle>
              <CardDescription>
                {t(
                  mode === 'view' ? 'create.viewHeader' : mode === 'update' ? 'create.editHeader' : 'create.addHeader',
                  'Manage products in this order',
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="grid gap-6">
            {mode !== 'view' && (
              <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
                <Label className="mb-2 block text-sm font-medium">
                  {t('create.searchLabel', 'Search for products to add')}
                </Label>
                <ProductVariantSearch
                  onSelectItem={(i) =>
                    orderLineCustomFields.length ? openAddVariantDialog({ variant: i }) : addToOrder(i, 1)
                  }
                />
              </div>
            )}

            <div className="border-border rounded-lg border shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow noHover className="hover:bg-transparent">
                    <TableHead className="py-3 font-semibold">{t('create.product', 'Product')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.sku', 'SKU')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.customFields', 'Custom Fields')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.price', 'Price')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.priceWithTax', 'Price with Tax')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.quantity', 'Quantity')}</TableHead>
                    <TableHead className="py-3 font-semibold">{t('create.perUnit', 'Per Unit')}</TableHead>
                    {(mode === 'create' || mode === 'update') && (
                      <TableHead className="py-3 text-right font-semibold">{t('create.actions', 'Actions')}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrder!.lines.length ? (
                    <>
                      {currentOrder!.lines.map((line) => (
                        <TableRow key={line.id} className="hover:bg-muted/20">
                          <TableCell className="py-3">
                            <div className="flex w-max items-center gap-3">
                              <ImageWithPreview
                                imageClassName="aspect-square w-12 h-12 rounded-md object-cover border border-border"
                                src={
                                  line.productVariant.featuredAsset?.preview ||
                                  line.productVariant.product?.featuredAsset?.preview ||
                                  '/placeholder.svg'
                                }
                              />
                              <div className="text-primary font-medium">{line.productVariant.product.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground min-w-[200px] py-3 font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              {line.productVariant.sku}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <OrderLineCustomFields line={line} order={currentOrder} mode={mode} />
                          </TableCell>
                          <TableCell className="py-3 font-medium">
                            {priceFormatter(line.linePrice, line.productVariant.currencyCode)}
                          </TableCell>
                          <TableCell className="py-3 font-medium">
                            {priceFormatter(line.linePriceWithTax, line.productVariant.currencyCode)}
                          </TableCell>
                          <TableCell className="py-3 text-center font-semibold">{line.quantity}</TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span>{priceFormatter(line.unitPrice, line.productVariant.currencyCode)}</span>
                              <span className="text-muted-foreground text-sm">
                                ({priceFormatter(line.unitPriceWithTax, line.productVariant.currencyCode)})
                              </span>
                            </div>
                          </TableCell>
                          {(mode === 'create' || mode === 'update') && (
                            <TableCell className="py-3 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                                    <EllipsisVertical className="h-5 w-5" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      <div className="flex items-center gap-2">
                                        <Edit className="h-4 w-4 text-blue-500" />
                                        {t('create.editOptions', 'Edit Options')}
                                      </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      disabled={isLineAddedInModify(line.id)}
                                      onClick={() => !isLineAddedInModify(line.id) && setOrderLineAction({ line })}
                                      className={cn('flex cursor-pointer justify-between', {
                                        'text-muted-foreground': isLineAddedInModify(line.id),
                                      })}
                                    >
                                      <span>
                                        {t('orderLineActionModal.actionType.quantity-price', 'Adjust Quantity & Price')}
                                      </span>
                                      {isLineAddedInModify(line.id) && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <InfoIcon className="text-muted-foreground h-4 w-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>
                                                {t(
                                                  'modify.disclaimer',
                                                  'Cannot modify items added in previous sessions',
                                                )}
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                {(mode === 'create' || isLineAddedInModify(line.id)) && (
                                  <button
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => removeLineItem(line.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                                {mode === 'update' && !isLineAddedInModify(line.id) && (
                                  <button
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => setQuantityTo0(line.id)}
                                  >
                                    <CircleOff className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}

                      {currentOrder?.surcharges.map((surcharge) => (
                        <TableRow key={surcharge.sku} className="bg-muted/10 hover:bg-muted/20">
                          <TableCell className="text-primary py-3 font-medium">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              {surcharge.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground min-w-[200px] py-3 font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              {surcharge.sku}
                            </div>
                          </TableCell>
                          <TableCell className="py-3"></TableCell>
                          <TableCell className="text-nowrap py-3 font-medium">
                            {priceFormatter(surcharge.price, order.currencyCode)}
                          </TableCell>
                          <TableCell className="text-nowrap py-3 font-medium">
                            {priceFormatter(surcharge.priceWithTax, order.currencyCode)}
                          </TableCell>
                          <TableCell className="py-3"></TableCell>
                          <TableCell className="py-3 font-medium">
                            {priceFormatter(surcharge.priceWithTax, order.currencyCode)}
                          </TableCell>
                          {(mode === 'create' || mode === 'update') && <TableCell className="py-3"></TableCell>}
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                            <ShoppingCart className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                          </div>
                          <span className="text-muted-foreground text-lg font-medium">
                            {t('create.noItems', 'No products in this order')}
                          </span>
                          {mode !== 'view' && (
                            <span className="text-muted-foreground mt-2 text-sm">
                              {t('create.searchPlaceholder', 'Use the search above to add products')}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="bg-card rounded-lg border p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-primary text-base font-bold">
                      {priceFormatter(currentOrder?.totalWithTax || 0, currentOrder?.currencyCode)}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <InfoIcon className="h-3 w-3" />
                      <span>
                        Total includes {currentOrder?.lines.reduce((acc, line) => acc + line.quantity, 0) || 0} items
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <OrderLineActionModal
              onPriceQuantityChangeApprove={onPriceQuantityChangeApprove}
              onOpenChange={onOrderLineActionModalOpenChange}
              {...orderLineAction}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
