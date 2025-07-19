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
  DialogProductPicker,
} from '@deenruv/react-ui-devkit';
import React, { useEffect, useState } from 'react';

interface LinesProps {
  onLinesChange: (lines: { productVariantId: string; quantity: number }[]) => void;
}

export const Lines: React.FC<LinesProps> = ({ onLinesChange }) => {
  const { t } = useTranslation('shippingMethods');
  const [currentProducts, setCurrentProducts] = useState<
    {
      id: string;
      featuredAsset?: { preview: string };
      product: { name: string; featuredAsset?: { preview: string } };
      price: number;
      priceWithTax: number;
    }[]
  >([]);

  useEffect(() => {
    onLinesChange(currentProducts.map((p) => ({ productVariantId: p.id, quantity: 1 })));
  }, [currentProducts, onLinesChange]);

  return (
    <div className="grid gap-6">
      <Label htmlFor="product">{t('details.lines.placeholder')}</Label>
      <DialogProductPicker
        initialValue={currentProducts.map((p) => p.id)}
        multiple
        mode="variant"
        onSubmit={(selectedProducts) => {
          const products = selectedProducts.map((product) => ({
            id: product.productVariantId,
            featuredAsset: product.productVariantAsset,
            product: { name: product.productName, featuredAsset: product.productAsset },
            price: product.price.__typename === 'SinglePrice' ? product.price.value : product.price.min,
            priceWithTax:
              product.priceWithTax.__typename === 'SinglePrice' ? product.priceWithTax.value : product.priceWithTax.min,
          }));
          setCurrentProducts(products);
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
