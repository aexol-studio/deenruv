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
    <div className="flex h-full w-[40%] flex-col gap-4">
      <div className="bg-card text-card-foreground flex h-full w-full flex-col space-y-3 rounded-lg border p-3 shadow-sm">
        {imageUrl ? (
          <img
            alt={`${variant?.product.name} image`}
            className="aspect-square h-64 w-full rounded-md border bg-white object-cover shadow-sm"
            height="56"
            width="56"
            src={imageUrl || '/placeholder.svg'}
          />
        ) : (
          <div className="bg-muted/30 flex h-14 w-14 items-center justify-center rounded-md border">
            <Package className="text-muted-foreground h-6 w-6" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-1 text-sm font-medium md:text-base">{variant?.product.name}</span>
            {variant?.name && variant.name !== variant?.product.name && (
              <span className="text-muted-foreground line-clamp-1 text-xs">{variant.name}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-1 select-none text-sm font-medium md:text-base">Price (TAX)</span>
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {priceFormatter(variant.price)} ({priceFormatter(variant.priceWithTax)})
            </span>
          </div>
          {variant.sku ? (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="line-clamp-1 select-none text-sm font-medium md:text-base">SKU</span>
              {variant.sku && <span className="text-muted-foreground line-clamp-1 text-xs">{variant.sku}</span>}
            </div>
          ) : null}
        </div>
        {variant?.quantity ? (
          <div className="ml-auto">
            {adjustLineItem ? (
              <div className="flex items-center">
                <div className="bg-background inline-flex items-center rounded-md border shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => adjustLineItem(Math.max(1, (variant.quantity || 1) - 1))}
                    className="hover:bg-muted h-8 rounded-r-none border-r px-2"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium tabular-nums">{variant?.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => adjustLineItem((variant.quantity || 0) + 1)}
                    className="hover:bg-muted h-8 rounded-l-none border-l px-2"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
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
