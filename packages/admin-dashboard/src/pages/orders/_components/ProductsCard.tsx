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
} from '@deenruv/react-ui-devkit';
import {
  DraftOrderLineType,
  ProductVariantType,
  removeOrderItemsResultSelector,
  updateOrderItemsSelector,
  updatedDraftOrderSelector,
} from '@/graphql/draft_order';
import { LineItem } from '@/pages/orders/_components/LineItem';
import { EllipsisVertical, InfoIcon, Trash2 } from 'lucide-react';

import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import { toast } from 'sonner';
import { OnPriceQuantityChangeApproveInput, OrderLineActions } from './OrderLineActionModal/types.js';
import { OrderLineActionModal } from './OrderLineActionModal/index.js';
// import { useServer } from '@/state';
import { CustomComponent } from './CustomComponent.js';
import { OrderLineCustomFields } from './OrderLineCustomFields.js';
import { ImageWithPreview, ProductVariantSearch } from '@/components';
import { useSearchParams } from 'react-router-dom';
// import { CustomFieldsComponent } from '@deenruv/react-ui-devkit';

type AddItemCustomFieldsType = any;
type ProductVariantCustomFields = any;

export const ProductsCard: React.FC = () => {
  const { t } = useTranslation('orders');
  // const activeAdministrator = useServer((p) => p.activeAdministrator);
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
  const [orderLineAction, setOrderLineAction] = useState<
    { action: OrderLineActions | undefined; line: DraftOrderLineType } | undefined
  >();
  const isLineAddedInModify = (lineId: string) => order?.lines.findIndex((l) => l.id === lineId) === -1;
  const [, setSearchParams] = useSearchParams();

  const addToOrder = async (
    productVariant: ProductVariantType,
    quantity: number,
    customFields?: AddItemCustomFieldsType,
  ) => {
    if (!order) return;

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

      setModifiedOrder({
        ...modifiedOrder,
        lines: [...modifiedOrder.lines, mockLine],
      });

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
      } else {
        setOrder(addItemToDraftOrder.order);
        toast.error(t('toasts.insufficientStockError', { value: productVariant }));
      }
      closeAddVariantDialog();
    }
  };

  const removeLineItem = async (orderLineId: string) => {
    if (!order) return;

    if (mode === 'update' && modifiedOrder) {
      setModifiedOrder({
        ...modifiedOrder,
        lines: modifiedOrder.lines.filter((l) => l.id !== orderLineId),
      });
      return;
    }

    const { removeDraftOrderLine } = await apiClient('mutation')({
      removeDraftOrderLine: [{ orderId: order.id, orderLineId }, removeOrderItemsResultSelector],
    });
    if (removeDraftOrderLine.__typename === 'Order') setOrder(removeDraftOrderLine);
  };

  const onPriceQuantityChangeApprove = async (input: OnPriceQuantityChangeApproveInput) => {
    if (!order) return;
    const { lineID, quantityChange } = input;
    console.log('QUANTITY CHANGE', quantityChange);
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
    } else if (mode === 'create') {
      const editedLineIdx = order.lines.findIndex((l) => l.id === lineID);
      if (quantityChange) {
        const { adjustDraftOrderLine } = await apiClient('mutation')({
          adjustDraftOrderLine: [
            {
              orderId: order.id,
              input: { orderLineId: order.lines[editedLineIdx].id, quantity: quantityChange, customFields },
            },
            updateOrderItemsSelector,
          ],
        });

        if (
          adjustDraftOrderLine.__typename === 'Order' ||
          adjustDraftOrderLine.__typename === 'InsufficientStockError'
        ) {
          if (adjustDraftOrderLine.__typename === 'Order') setOrder(adjustDraftOrderLine);
          else setOrder(adjustDraftOrderLine.order);
        }
      }

      fetchOrder(order.id);
    }
  };

  const adjustLineItem = async (orderLineId: string, quantity: number, customFields: AddItemCustomFieldsType) => {
    if (customFields?.selectedImageId) {
      delete customFields.selectedImageId;
    }

    if (!order) return;

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
    }

    const { adjustDraftOrderLine } = await apiClient('mutation')({
      adjustDraftOrderLine: [
        { orderId: order.id, input: { orderLineId, quantity, customFields } },
        updateOrderItemsSelector,
      ],
    });
    if (adjustDraftOrderLine.__typename === 'Order' || adjustDraftOrderLine.__typename === 'InsufficientStockError') {
      if (adjustDraftOrderLine.__typename === 'Order') setOrder(adjustDraftOrderLine);
      else setOrder(adjustDraftOrderLine.order);
    }
  };

  const handleLineAttributesChange = (lineId: string, attributes: Record<string, string>) => {
    if (mode === 'update' && modifiedOrder) {
      const editedLineIdx = modifiedOrder.lines.findIndex((l) => l.id === lineId);
      const editedLine = {
        ...modifiedOrder.lines[editedLineIdx],
        // customFields: { ...modifiedOrder.lines[editedLineIdx].customFields, attributes: JSON.stringify(attributes) },
      };

      setModifiedOrder({
        ...modifiedOrder,
        lines: modifiedOrder.lines.map((l, i) => (i === editedLineIdx ? editedLine : l)),
      });
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
    setSearchParams({ productId: input.variant.productId });
  };

  const closeAddVariantDialog = () => {
    setOpen(false);
    setSelectedVariant(undefined);
    setOrderLineId(undefined);
    setSearchParams(undefined);
  };
  const onOrderLineActionModalOpenChange = (bool: boolean) => {
    if (!bool) {
      setOrderLineAction(undefined);
    }
  };
  if (!order) return null;

  const maybeChangedValueWithTax = (line: DraftOrderLineType, withTax: boolean) => {
    return priceFormatter(
      withTax ? line.discountedUnitPriceWithTax : line.discountedUnitPrice,
      line.productVariant.currencyCode,
    );
  };
  const mabeyChangedOverallLinePrice = (line: DraftOrderLineType) => {
    return priceFormatter(line.discountedLinePriceWithTax, line.productVariant.currencyCode);
  };
  const handleNewVariantAdd = async (attributes?: string) => {
    if (orderLineId) {
      await adjustLineItem(orderLineId, quantity, {
        attributes,
        discountBy: customFields?.discountBy ? Math.floor(customFields.discountBy) : undefined,
      });
      return;
    } else if (selectedVariant) {
      await addToOrder(selectedVariant, quantity, {
        attributes,
        discountBy: customFields?.discountBy ? Math.floor(customFields.discountBy) : undefined,
      });
    }
    closeAddVariantDialog();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(mode === 'view' ? 'create.viewTitle' : mode === 'update' ? 'create.editTitle' : 'create.addTitle')}
        </CardTitle>
        <CardDescription>
          {t(mode === 'view' ? 'create.viewHeader' : mode === 'update' ? 'create.editHeader' : 'create.addHeader')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {mode !== 'view' ? (
            <>
              <div>
                <Label htmlFor="product">{t('create.searchPlaceholder')}</Label>
                <ProductVariantSearch
                  onSelectItem={(i) =>
                    orderLineCustomFields.length ? openAddVariantDialog({ variant: i }) : addToOrder(i, 1)
                  }
                />
              </div>
            </>
          ) : null}
          <Table>
            <TableHeader className="text-nowrap">
              <TableRow noHover>
                <TableHead>{t('create.product')}</TableHead>
                <TableHead>{t('create.sku')}</TableHead>
                <TableHead>{t('create.customFields')}</TableHead>
                <TableHead>{t('create.price')}</TableHead>
                <TableHead>{t('create.priceWithTax')}</TableHead>
                <TableHead>{t('create.quantity')}</TableHead>
                <TableHead>{t('create.totalWithTax')}</TableHead>
                {mode === 'create' && <TableHead>{t('create.actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrder!.lines.length ? (
                <>
                  {currentOrder!.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div className="flex w-max items-center gap-2">
                          <ImageWithPreview
                            imageClassName="aspect-square w-10 rounded-md object-cover w-[40px] h-[40px]"
                            src={
                              line.productVariant.featuredAsset?.preview ||
                              line.productVariant.product?.featuredAsset?.preview
                            }
                          />
                          <div className="font-semibold">{line.productVariant.product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px]">{line.productVariant.sku}</TableCell>
                      <TableCell>
                        <OrderLineCustomFields line={line} order={currentOrder!} />
                      </TableCell>
                      <TableCell className="text-nowrap">{maybeChangedValueWithTax(line, false)}</TableCell>
                      <TableCell className="text-nowrap">{maybeChangedValueWithTax(line, true)}</TableCell>
                      <TableCell>
                        <span>{line.quantity}</span>
                        {/* {adjustLineItem ? (
                        <div className="flex items-center gap-2">
                          {mode === 'create' && (
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() =>
                                adjustLineItem(line.id, line.quantity + 1, {
                                  attributes: line.customFields?.attributes,
                                  discountBy: line.customFields?.discountBy,
                                })
                              }
                            >
                              +
                            </Button>
                          )}
                          {mode === 'create' && (
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => {
                                if (line.quantity === 1) return;
                                adjustLineItem(line.id, line.quantity - 1, {
                                  attributes: line.customFields?.attributes,
                                  discountBy: line.customFields?.discountBy,
                                });
                              }}
                            >
                              -
                            </Button>
                          )}
                        </div>
                      ) : (
                        line.quantity
                      )} */}
                      </TableCell>
                      <TableCell>{mabeyChangedOverallLinePrice(line)}</TableCell>
                      {(mode === 'create' || mode === 'update') && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Edytuj</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  // disabled={isLineAddedInModify(line.id)}
                                  onClick={() =>
                                    !isLineAddedInModify(line.id) &&
                                    setOrderLineAction({ action: 'quantity-price', line })
                                  }
                                  className={cn('flex cursor-pointer justify-between', {
                                    'text-muted-foreground': isLineAddedInModify(line.id),
                                  })}
                                >
                                  <span>{t('orderLineActionModal.actionType.quantity-price')}</span>
                                  {isLineAddedInModify(line.id) && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <InfoIcon />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t('modify.disclaimer')}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                onClick={() => setOrderLineAction({ action: 'attributes', line })}
                                className="flex cursor-pointer justify-between"
                              >
                                <span>Atrybuty</span>
                              </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {(mode === 'create' || isLineAddedInModify(line.id)) && (
                              <Trash2
                                size={20}
                                className="cursor-pointer text-red-400"
                                onClick={() => removeLineItem(line.id)}
                              />
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {currentOrder?.surcharges.map((surcharge) => (
                    <TableRow key={surcharge.sku}>
                      <TableCell className="font-medium">{surcharge.description}</TableCell>
                      <TableCell className="min-w-[200px]">{surcharge.sku}</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-nowrap">
                        {priceFormatter(surcharge.price, order.currencyCode)}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {priceFormatter(surcharge.priceWithTax, order.currencyCode)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>{priceFormatter(surcharge.priceWithTax, order.currencyCode)}</TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="mt-4 flex items-center justify-center">
                      <span>{t('create.noItems')}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <OrderLineActionModal
            onPriceQuantityChangeApprove={onPriceQuantityChangeApprove}
            onOpenChange={onOrderLineActionModalOpenChange}
            onAttributesChangeApprove={handleLineAttributesChange}
            {...orderLineAction}
          />
          <Dialog open={open} onOpenChange={(e) => (!e ? closeAddVariantDialog() : setOpen(true))}>
            <DialogContent className="max-h-[90vh] min-h-[60vh] max-w-[50vw] overflow-auto">
              {selectedVariant ? (
                <div className="flex h-full w-full flex-col justify-between">
                  <div className="flex h-full flex-col gap-8">
                    <div className="flex w-full flex-col items-center gap-2">
                      <div className="flex w-full flex-col">
                        <LineItem noBorder noHover variant={{ ...selectedVariant, quantity: 1 }} />
                        <CustomComponent
                          onVariantAdd={handleNewVariantAdd}
                          orderLineId={selectedVariant.product.id}
                          value={customFields?.attributes || ''}
                          setValue={(data) => setCustomFields((p: any) => ({ ...p, attributes: data }))} // data źle sformatowana
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>{t('create.somethingWrong')}</div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
