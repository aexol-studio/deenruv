'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useOrder,
  Badge,
  ScrollArea,
} from '@deenruv/react-ui-devkit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus, DollarSign, Package, Tag, FileText } from 'lucide-react';

export const ChangesRegister = () => {
  const { t } = useTranslation('orders');
  const { getObjectsChanges, modifiedOrder, order } = useOrder();

  const changes = useMemo(() => {
    if (!getObjectsChanges || !order || !modifiedOrder) return null;
    const rawChanges = getObjectsChanges();

    return {
      existingLines: rawChanges.linesChanges.filter((change) => !change.isNew),
      newLines: rawChanges.linesChanges.filter((change) => change.isNew),
      surcharges: rawChanges.resChanges.filter((change) => change.path.startsWith('surcharges')),
    };
  }, [getObjectsChanges, order, modifiedOrder]);

  const formatPrice = (value: string | number | undefined) => {
    if (value === undefined) return '-';
    const numValue = Number(value);
    return isNaN(numValue) ? value : (numValue / 100).toFixed(2);
  };

  const getFieldName = (path: string) => {
    const fieldKey = path.split('.').pop() || '';
    return t(`changes.keys.${fieldKey}`, fieldKey);
  };

  if (!changes || (!changes.existingLines.length && !changes.newLines.length && !changes.surcharges.length)) {
    return (
      <Card className="border-l-4 border-l-gray-300 dark:border-l-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            {t('changes.noChanges', 'No Changes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('changes.noChangesDescription', 'No modifications have been made to this order.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {changes.existingLines.length > 0 && (
        <Card className="border-l-4 border-l-amber-500 shadow-sm dark:border-l-amber-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              {t('changes.existingLines', 'Changes to Existing Items')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {changes.existingLines.map((change) => (
              <div key={change.lineID} className="rounded-md border p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h4 className="font-medium">{change.variantName}</h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    {change.lineID}
                  </Badge>
                </div>
                <ScrollArea className="max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">{t('changes.property', 'Property')}</TableHead>
                        <TableHead className="w-1/3">{t('changes.previous', 'Previous')}</TableHead>
                        <TableHead className="w-1/3">{t('changes.current', 'Current')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {change.changes.map((propertyChange, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{getFieldName(propertyChange.path)}</TableCell>
                          <TableCell className="text-red-600 dark:text-red-400">
                            {propertyChange.path.includes('price') ? (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {formatPrice(propertyChange.removed)}
                              </span>
                            ) : (
                              propertyChange.removed
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-green-600 dark:text-green-400">
                            {propertyChange.path.includes('price') ? (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {formatPrice(propertyChange.added)}
                              </span>
                            ) : (
                              propertyChange.added
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {changes.newLines.length > 0 && (
        <Card className="border-l-4 border-l-green-500 shadow-sm dark:border-l-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500 dark:text-green-400" />
              {t('changes.newLines', 'Newly Added Items')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('changes.product', 'Product')}</TableHead>
                    <TableHead>{t('changes.unitPrice', 'Unit Price')}</TableHead>
                    <TableHead>{t('changes.unitPriceWithTax', 'Unit Price (with Tax)')}</TableHead>
                    <TableHead>{t('changes.quantity', 'Quantity')}</TableHead>
                    <TableHead>{t('changes.total', 'Total')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.newLines
                    .flatMap((lineChange) => {
                      const productChange = lineChange.changes.find(
                        (change) =>
                          typeof change.value === 'object' && change.value !== null && 'productVariant' in change.value,
                      );
                      if (!productChange || typeof productChange.value !== 'object') {
                        return null;
                      }
                      const item = productChange.value as Record<string, any>;
                      const variant = item.productVariant || {};
                      const quantityChange = lineChange.changes.find((change) => change.path.includes('quantity'));
                      const linePriceChange = lineChange.changes.find(
                        (change) => change.path.includes('linePrice') && !change.path.includes('WithTax'),
                      );

                      const linePriceWithTaxChange = lineChange.changes.find((change) =>
                        change.path.includes('linePriceWithTax'),
                      );

                      const quantity = quantityChange ? Number(quantityChange.added) : 1;
                      const linePrice = linePriceChange ? Number(linePriceChange.added) : 0;
                      const linePriceWithTax = linePriceWithTaxChange ? Number(linePriceWithTaxChange.added) : 0;

                      return (
                        <TableRow key={lineChange.lineID}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-500 dark:text-green-400" />
                              {variant.name || lineChange.variantName || t('changes.unknownProduct', 'Unknown Product')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <DollarSign className="text-muted-foreground h-3.5 w-3.5" />
                              {formatPrice(linePrice)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <DollarSign className="text-muted-foreground h-3.5 w-3.5" />
                              {formatPrice(linePriceWithTax)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{quantity}</TableCell>
                          <TableCell className="font-medium">
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <DollarSign className="h-3.5 w-3.5" />
                              {formatPrice(quantity * linePriceWithTax)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    .filter(Boolean)}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      {changes.surcharges.length > 0 && (
        <Card className="border-l-4 border-l-blue-500 shadow-sm dark:border-l-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              {t('changes.surcharges', 'Added Surcharges')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('changes.description', 'Description')}</TableHead>
                    <TableHead>{t('changes.sku', 'SKU')}</TableHead>
                    <TableHead>{t('changes.price', 'Price')}</TableHead>
                    <TableHead>{t('changes.priceWithTax', 'Price with Tax')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.surcharges.map((surcharge, index) => {
                    const item = surcharge.value || {};
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            {item.description || t('changes.unnamedSurcharge', 'Unnamed Surcharge')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="text-muted-foreground h-4 w-4" />
                            <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">{item.sku || '-'}</code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <DollarSign className="text-muted-foreground h-3.5 w-3.5" />
                            {formatPrice(item.price)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <DollarSign className="h-3.5 w-3.5" />
                            {formatPrice(item.priceWithTax)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
