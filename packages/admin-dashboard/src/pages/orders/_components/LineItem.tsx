import { TableRow, TableCell, Button } from '@deenruv/react-ui-devkit';
import type { DraftOrderType } from '@/graphql/draft_order';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import { Minus, Plus, Package } from 'lucide-react';

type VariantWithQuantity = DraftOrderType['lines'][number]['productVariant'] & { quantity?: number };

export const LineItem: React.FC<
  PropsWithChildren<{
    noBorder?: boolean;
    noHover?: boolean;
    variant: VariantWithQuantity;
    adjustLineItem?: (quantity: number) => void;
  }>
> = ({ noBorder, noHover, children, variant, adjustLineItem }) => {
  const imageUrl = variant?.featuredAsset?.preview || variant?.product?.featuredAsset?.preview;

  return (
    <TableRow noHover={noHover} noBorder={noBorder} className="group transition-colors">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <img
              alt={`${variant?.product.name} image`}
              className="aspect-square size-12 rounded-md border bg-white object-cover shadow-sm"
              height="48"
              width="48"
              src={imageUrl || '/placeholder.svg'}
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-md border bg-muted/30">
              <Package className="size-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="line-clamp-1 text-sm font-medium md:text-base">{variant?.product.name}</span>
            {variant?.name && variant.name !== variant?.product.name && (
              <span className="line-clamp-1 text-xs text-muted-foreground">{variant.name}</span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="font-mono text-sm text-muted-foreground">{variant?.sku}</TableCell>

      {variant?.quantity ? (
        <TableCell>
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
          ) : (
            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {variant?.quantity}
            </span>
          )}
        </TableCell>
      ) : null}

      {children}
    </TableRow>
  );
};
