import { DraftOrderType } from '@/graphql/draft_order.js';
import { Button, priceFormatter } from '@deenruv/react-ui-devkit';
import { Minus, Package, Plus } from 'lucide-react';
import type React from 'react';

type VariantWithQuantity = DraftOrderType['lines'][number]['productVariant'] & { quantity?: number };
export const SpecialLineItem: React.FC<{
  variant: VariantWithQuantity;
  adjustLineItem?: (quantity: number) => void;
}> = ({ variant, adjustLineItem }) => {
  const imageUrl = variant?.featuredAsset?.preview || variant?.product?.featuredAsset?.preview;
  return (
    <div className="flex h-full w-2/5 flex-col gap-4">
      <div className="flex size-full flex-col space-y-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
        {imageUrl ? (
          <img
            alt={`${variant?.product.name} image`}
            className="aspect-square h-64 w-full rounded-md border bg-white object-cover shadow-sm"
            height="56"
            width="56"
            src={imageUrl || '/placeholder.svg'}
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-md border bg-muted/30">
            <Package className="size-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-1 text-sm font-medium md:text-base">{variant?.product.name}</span>
            {variant?.name && variant.name !== variant?.product.name && (
              <span className="line-clamp-1 text-xs text-muted-foreground">{variant.name}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-1 text-sm font-medium select-none md:text-base">Price (TAX)</span>
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {priceFormatter(variant.price)} ({priceFormatter(variant.priceWithTax)})
            </span>
          </div>
          {variant.sku ? (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="line-clamp-1 text-sm font-medium select-none md:text-base">SKU</span>
              {variant.sku && <span className="line-clamp-1 text-xs text-muted-foreground">{variant.sku}</span>}
            </div>
          ) : null}
        </div>
        {variant?.quantity ? (
          <div className="ml-auto">
            {adjustLineItem ? (
              <div className="flex items-center">
                <div className="inline-flex items-center rounded-md border bg-background shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => adjustLineItem(Math.max(1, (variant.quantity || 1) - 1))}
                    className="h-8 rounded-r-none border-r px-2 hover:bg-muted"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium tabular-nums">{variant?.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => adjustLineItem((variant.quantity || 0) + 1)}
                    className="h-8 rounded-l-none border-l px-2 hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
