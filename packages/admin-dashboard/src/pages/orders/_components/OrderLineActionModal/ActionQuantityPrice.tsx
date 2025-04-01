'use client';

import { useOrder, cn, Button, DialogFooter, Input } from '@deenruv/react-ui-devkit';
import type { DraftOrderLineType } from '@/graphql/draft_order';

import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { OnPriceQuantityChangeApproveInput } from './types.js';
import { ArrowDown, ArrowUp, Package, MinusCircle, PlusCircle } from 'lucide-react';

interface ActionQuantityPriceProps {
  line?: DraftOrderLineType;
  onOpenChange: (open: boolean) => void;
  onPriceQuantityChangeApprove: (input: OnPriceQuantityChangeApproveInput) => Promise<void>;
}

export const ActionQuantityPrice: React.FC<ActionQuantityPriceProps> = ({
  line,
  onOpenChange,
  onPriceQuantityChangeApprove,
}) => {
  const { t } = useTranslation('orders');
  const [quantityChange, setQuantityChange] = useState<number | undefined>(line?.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const { order } = useOrder();
  const baseOrderLine = useMemo(() => order?.lines.find((l) => l.id === line?.id), [line, order?.lines]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setQuantityChange(0);
    const value = Number.parseInt(e.currentTarget.value, 10);
    setQuantityChange(value);
  };

  const incrementQuantity = () => {
    setQuantityChange((prev) => (prev !== undefined ? prev + 1 : 1));
  };

  const decrementQuantity = () => {
    setQuantityChange((prev) => (prev ? prev - 1 : 0));
  };

  const quantityDelta = useMemo(
    () => (quantityChange ? quantityChange - (baseOrderLine?.quantity ?? 0) : 0),
    [quantityChange, baseOrderLine?.quantity],
  );

  const handleApprove = async () => {
    if (!line?.id) return;
    setIsLoading(true);
    try {
      await onPriceQuantityChangeApprove({
        lineID: line.id,
        quantityChange: quantityChange,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const productImage =
    line?.productVariant?.featuredAsset?.preview || line?.productVariant?.product?.featuredAsset?.preview;

  const formatPrice = (amount?: number) => {
    if (amount === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: line?.productVariant?.currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-6 p-2">
        {/* Product Information */}
        <div className="bg-card flex items-center gap-4 rounded-lg border p-5 shadow-sm transition-all hover:shadow-md">
          {productImage ? (
            <div className="bg-background relative overflow-hidden rounded-md border">
              <img
                alt={line?.productVariant.name || 'Product image'}
                className="aspect-square h-24 w-24 object-cover transition-transform hover:scale-105"
                src={productImage || '/placeholder.svg'}
              />
            </div>
          ) : (
            <div className="bg-muted/50 flex h-24 w-24 items-center justify-center rounded-md border">
              <Package className="text-muted-foreground h-10 w-10" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-medium">{line?.productVariant.name}</span>
            <span className="text-muted-foreground text-sm">{line?.productVariant.sku || 'No SKU available'}</span>
            <div className="bg-primary/10 text-primary mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {formatPrice(baseOrderLine?.unitPriceWithTax)} / unit
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="quantity-input">
              {t('orderLineActionModal.quantityChange')}
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={decrementQuantity}
                className="bg-muted/50 text-muted-foreground hover:bg-muted flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 transition-colors"
                aria-label="Decrease quantity"
              >
                <MinusCircle className="h-4 w-4" />
              </button>
              <Input
                id="quantity-input"
                min={1}
                value={quantityChange}
                onChange={handleQuantityChange}
                className="rounded-none border-x-0 text-center transition-all focus-visible:ring-2"
                type="number"
                placeholder={t('orderLineActionModal.changeQuantity')}
              />
              <button
                type="button"
                onClick={incrementQuantity}
                className="bg-muted/50 text-muted-foreground hover:bg-muted flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 transition-colors"
                aria-label="Increase quantity"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-muted/40 mt-4 space-y-3 rounded-md p-5">
            <div className="border-border/50 grid grid-cols-3 gap-2 border-b pb-2">
              <span className="text-sm font-medium">{t('orderLineActionModal.item')}</span>
              <span className="text-center text-sm font-medium">{t('orderLineActionModal.quantity')}</span>
              <span className="text-right text-sm font-medium">{t('orderLineActionModal.price')}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <span className="text-muted-foreground text-sm">{t('orderLineActionModal.current')}</span>
              <span className="text-center text-sm">{baseOrderLine?.quantity}</span>
              <span className="text-right text-sm">{formatPrice(baseOrderLine?.unitPriceWithTax)}</span>
            </div>

            <div className="bg-muted/60 grid grid-cols-3 gap-2 rounded-md py-2">
              <span className="text-muted-foreground pl-2 text-sm">{t('orderLineActionModal.change')}</span>
              <div className="flex items-center justify-center">
                {quantityDelta !== 0 && (
                  <>
                    {quantityDelta > 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="text-destructive mr-1 h-3 w-3" />
                    )}
                  </>
                )}
                <span
                  className={cn('text-sm', {
                    'text-destructive': quantityDelta < 0,
                    'text-green-500': quantityDelta > 0,
                  })}
                >
                  {quantityDelta > 0 ? `+${quantityDelta}` : quantityDelta}
                </span>
              </div>
              <span className="pr-2 text-right text-sm">-</span>
            </div>

            <div className="bg-border my-3 h-px w-full" />

            <div className="grid grid-cols-3 gap-2 py-2">
              <span className="text-sm font-medium">{t('orderLineActionModal.after')}</span>
              <span className="text-center text-sm font-semibold">
                {quantityChange !== undefined && quantityChange > 0 ? quantityChange : line?.quantity}
              </span>
              <span className="text-right text-sm font-semibold">{formatPrice(baseOrderLine?.unitPriceWithTax)}</span>
            </div>

            <div className="border-border bg-primary/5 mt-3 grid grid-cols-3 gap-2 rounded-md border-t p-2">
              <span className="text-sm font-medium">{t('orderLineActionModal.total')}</span>
              <span className="text-center"></span>
              <span className="text-primary text-right text-sm font-semibold">
                {formatPrice((quantityChange || 0) * (baseOrderLine?.unitPriceWithTax || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="bg-muted/30 gap-2 border-t p-4">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          className="flex-1 sm:flex-none"
          disabled={isLoading}
        >
          {t('orderLineActionModal.cancel')}
        </Button>
        <Button
          onClick={handleApprove}
          disabled={isLoading || quantityChange === undefined || quantityChange < 0}
          className="bg-primary hover:bg-primary/90 min-w-[100px] flex-1 sm:flex-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {t('orderLineActionModal.saving')}
            </span>
          ) : (
            t('orderLineActionModal.save')
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};
