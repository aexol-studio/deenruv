import { OrderLineCustomFields } from '@/pages/orders/_components/OrderLineCustomFields.js';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Checkbox,
  ImageWithPreview,
  Input,
  Label,
  priceFormatter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useOrder,
} from '@deenruv/react-ui-devkit';
import { Tag } from 'lucide-react';
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductsTableProps {
  refundLines: ModelTypes['OrderLineInput'][];
  setRefundLines: Dispatch<SetStateAction<ModelTypes['OrderLineInput'][]>>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ setRefundLines, refundLines }) => {
  const { t } = useTranslation('orders');
  const { mode, currentOrder } = useOrder();

  const handleLineChange = useCallback(
    (lineId: string, quantity: number) => {
      const existingLineIdx = refundLines.findIndex((l) => l.orderLineId === lineId);
      console.log('EL', existingLineIdx);

      setRefundLines((prev) => {
        const newState = [...prev];
        if (existingLineIdx !== -1) {
          newState[existingLineIdx].quantity = quantity;
        } else {
          newState.push({ orderLineId: lineId, quantity });
        }
        return newState;
      });
    },
    [refundLines],
  );

  return (
    <div className="border-border rounded-lg border-0 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow noHover className="hover:bg-transparent">
            <TableHead className="py-3 font-semibold">{t('create.product', 'Product')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('create.sku', 'SKU')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('create.customFields', 'Custom Fields')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('create.price', 'Price')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('create.priceWithTax', 'Price with Tax')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('cancelAndRefund.refund')}</TableHead>
            <TableHead className="py-3 font-semibold">{t('cancelAndRefund.returnToStock')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
              <TableCell className="py-3">
                <Input
                  type="number"
                  wrapperClassName="w-24"
                  endAdornment={'/' + line.quantity}
                  defaultValue={0}
                  max={line.quantity}
                  onChange={(e) => {
                    handleLineChange(line.id, +e.target.value);
                  }}
                />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex gap-2">
                  <Checkbox />
                  <Label>{t('cancelAndRefund.returnToStock')}</Label>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
