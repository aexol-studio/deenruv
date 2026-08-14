import {
  ImageWithPreview,
  Input,
  getRefundedQuantities,
  priceFormatter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useOrder,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React, { Dispatch, SetStateAction } from 'react';

export interface RefundLineSelection {
  refundQuantity: number;
  cancelQuantity: number;
}
interface ProductsTableProps {
  selections: Record<string, RefundLineSelection>;
  setSelections: Dispatch<SetStateAction<Record<string, RefundLineSelection>>>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ selections, setSelections }) => {
  const { t } = useTranslation('orders');
  const { order } = useOrder();
  if (!order) return null;
  const refundedQuantities = getRefundedQuantities(order.payments ?? []);
  const update = (id: string, key: keyof RefundLineSelection, value: number) =>
    setSelections((current) => ({
      ...current,
      [id]: { ...(current[id] ?? { refundQuantity: 0, cancelQuantity: 0 }), [key]: value },
    }));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('create.product')}</TableHead>
          <TableHead>{t('create.sku')}</TableHead>
          <TableHead>{t('create.priceWithTax')}</TableHead>
          <TableHead>{t('cancelAndRefund.refundQuantity')}</TableHead>
          <TableHead>{t('cancelAndRefund.returnToStock')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {order.lines.map((line) => (
          <TableRow key={line.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <ImageWithPreview
                  imageClassName="size-12 rounded-md object-cover"
                  src={
                    line.productVariant.featuredAsset?.preview ||
                    line.productVariant.product?.featuredAsset?.preview ||
                    '/placeholder.svg'
                  }
                />
                <span>{line.productVariant.product.name}</span>
              </div>
            </TableCell>
            <TableCell>{line.productVariant.sku}</TableCell>
            <TableCell>{priceFormatter(line.proratedUnitPriceWithTax, order.currencyCode)}</TableCell>
            <TableCell>
              <Input
                type="number"
                min={0}
                max={Math.max(0, line.orderPlacedQuantity - (refundedQuantities[line.id] ?? 0))}
                step={1}
                value={selections[line.id]?.refundQuantity ?? 0}
                onChange={(e) => update(line.id, 'refundQuantity', Number(e.target.value))}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min={0}
                max={line.quantity}
                step={1}
                value={selections[line.id]?.cancelQuantity ?? 0}
                onChange={(e) => update(line.id, 'cancelQuantity', Number(e.target.value))}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
