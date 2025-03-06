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
              className="aspect-square h-12 w-12 rounded-md border bg-white object-cover shadow-sm"
              height="48"
              width="48"
              src={imageUrl || '/placeholder.svg'}
            />
          ) : (
            <div className="bg-muted/30 flex h-12 w-12 items-center justify-center rounded-md border">
              <Package className="text-muted-foreground h-6 w-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="line-clamp-1 text-sm font-medium md:text-base">{variant?.product.name}</span>
            {variant?.name && variant.name !== variant?.product.name && (
              <span className="text-muted-foreground line-clamp-1 text-xs">{variant.name}</span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground font-mono text-sm">{variant?.sku}</TableCell>

      {variant?.quantity ? (
        <TableCell>
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
          ) : (
            <span className="bg-primary/10 text-primary inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium">
              {variant?.quantity}
            </span>
          )}
        </TableCell>
      ) : null}

      {children}
    </TableRow>
  );
};
