import {
  ImageWithPreview,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Label,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ProductVariantType } from '@/graphql/draft_order';
import React, { useEffect, useState } from 'react';
import { ProductVariantSearch } from '@/components';

interface LinesProps {
  onLinesChange: (lines: { productVariantId: string; quantity: number }[]) => void;
}

export const Lines: React.FC<LinesProps> = ({ onLinesChange }) => {
  const { t } = useTranslation('shippingMethods');
  const [currentProducts, setCurrentProducts] = useState<ProductVariantType[]>([]);

  useEffect(() => {
    onLinesChange(currentProducts.map((p) => ({ productVariantId: p.id, quantity: 1 })));
  }, [currentProducts, onLinesChange]);

  return (
    <div className="grid gap-6">
      <Label htmlFor="product">{t('details.lines.placeholder')}</Label>
      <ProductVariantSearch
        onSelectItem={(i: ProductVariantType) => {
          setCurrentProducts((prev) => [...prev, i]);
        }}
      />
      <Table>
        <TableHeader className="text-nowrap">
          <TableRow noHover>
            <TableHead>{t('details.lines.product')}</TableHead>
            <TableHead>{t('details.lines.price')}</TableHead>
            <TableHead>{t('details.lines.total')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.length ? (
            currentProducts.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <div className="flex w-max items-center gap-2">
                    <ImageWithPreview
                      imageClassName="aspect-square w-10 rounded-md object-cover w-[40px] h-[40px]"
                      src={line.featuredAsset?.preview || line.product?.featuredAsset?.preview}
                    />
                    <div className="font-semibold">{line.product.name}</div>
                  </div>
                </TableCell>
                <TableCell>{line.price}</TableCell>
                <TableCell>{line.priceWithTax}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableCell colSpan={8}>
              <div className="mt-4 flex items-center justify-center">
                <span>{t('details.lines.noItems')}</span>
              </div>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
