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
  Badge,
  ScrollArea,
  ChangesRegistry,
  useOrder,
  UnknownObject,
  formatPrice,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React, { useCallback } from 'react';
import {
  ArrowRight,
  Plus,
  DollarSign,
  Package,
  Tag,
  FileText,
  Loader,
  Euro,
  Building,
  Pin,
  Component,
} from 'lucide-react';
import { ChangesRegisterTable } from '@/pages/orders/_components/ChangesRegisterTable.js';

export const ChangesRegister: React.FC<{ changes: ChangesRegistry | undefined }> = ({ changes }) => {
  const { t } = useTranslation('orders');
  const { order } = useOrder();

  console.log('CH', changes);

  const getFieldName = (path: string) => {
    const fieldKey = path.split('.').pop() || '';
    return t(`changes.keys.${fieldKey}`, fieldKey);
  };

  const PriceJSX = useCallback(
    (value: string | number) => {
      let icon;
      switch (order?.currencyCode) {
        case 'USD':
          icon = <DollarSign className="size-3.5" />;
          break;
        case 'EUR':
          icon = <Euro className="size-3.5" />;
          break;
        default:
          icon = order?.currencyCode;
      }

      return (
        <span className="flex items-center gap-1">
          {icon}
          {formatPrice(value)}
        </span>
      );
    },
    [order],
  );

  if (!changes) {
    return (
      <Card className="border-muted">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4">
            <Loader className="size-10 animate-spin text-orange-500" />
          </div>
          <h3 className="mb-2 text-xl font-medium">{t('changes.loading.title')}</h3>
          <p className="max-w-md text-muted-foreground">{t('changes.loading.description')}</p>
        </CardContent>
      </Card>
    );
  }

  if (
    Object.values(Object.fromEntries(Object.entries(changes).filter(([key]) => key !== 'rest'))).every(
      (item) => !item.length,
    )
  ) {
    return (
      <Card className="border-l-4 border-l-gray-300 dark:border-l-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-gray-500" />
            {t('changes.emptyState.noChanges', 'No Changes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('changes.emptyState.noChangesDescription', 'No modifications have been made to this order.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return changes ? (
    <div className="space-y-6">
      {changes.existingLines.length > 0 && (
        <Card className="border-l-4 border-l-amber-500 shadow-sm dark:border-l-amber-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="size-5 text-amber-500 dark:text-amber-400" />
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
                <ScrollArea>
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
                            {propertyChange.path.toLowerCase().includes('price')
                              ? PriceJSX(propertyChange.removed)
                              : propertyChange.removed}
                          </TableCell>
                          <TableCell className="font-medium text-green-600 dark:text-green-400">
                            {propertyChange.path.toLowerCase().includes('price')
                              ? PriceJSX(propertyChange.added)
                              : propertyChange.added}
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
              <Plus className="size-5 text-green-500 dark:text-green-400" />
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
                      const brandNewLine = lineChange.changes.find((ch) => ch.changed === 'added' && ch.path === '');
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
                      const linePrice: number = brandNewLine
                        ? Number((brandNewLine.value as UnknownObject).discountedLinePrice)
                        : linePriceChange
                          ? Number(linePriceChange.added)
                          : 0;
                      const linePriceWithTax: number = brandNewLine
                        ? Number((brandNewLine.value as UnknownObject).discountedLinePriceWithTax)
                        : linePriceWithTaxChange
                          ? Number(linePriceWithTaxChange.added)
                          : 0;

                      return (
                        <TableRow key={lineChange.lineID}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Package className="size-4 text-green-500 dark:text-green-400" />
                              {variant.name || lineChange.variantName || t('changes.unknownProduct', 'Unknown Product')}
                            </div>
                          </TableCell>
                          <TableCell>{PriceJSX(linePrice)}</TableCell>
                          <TableCell>{PriceJSX(linePriceWithTax)}</TableCell>
                          <TableCell className="font-medium">{quantity}</TableCell>
                          <TableCell className="font-medium text-green-600 dark:text-green-400">
                            {PriceJSX(quantity * linePriceWithTax)}
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
              <Plus className="size-5 text-blue-500 dark:text-blue-400" />
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
                    const item = (surcharge.value || {}) as Record<string, unknown>;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-blue-500 dark:text-blue-400" />
                            {String(item.description || '') || t('changes.unnamedSurcharge', 'Unnamed Surcharge')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="size-4 text-muted-foreground" />
                            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                              {String(item.sku || '') || '—'}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>{PriceJSX(Number(item.price))}</TableCell>
                        <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                          {PriceJSX(Number(item.priceWithTax))}
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
      {changes.billingAddress.length > 0 && (
        <Card className="border-l-4 border-l-purple-500 shadow-sm dark:border-l-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="size-5 text-purple-500 dark:text-purple-400" />
              {t('changes.billingAddress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangesRegisterTable changes={changes.billingAddress} />
          </CardContent>
        </Card>
      )}
      {changes.shippingAddress.length > 0 && (
        <Card className="border-l-4 border-l-indigo-500 shadow-sm dark:border-l-indigo-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="size-5 text-indigo-500 dark:text-indigo-400" />
              {t('changes.shippingAddress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangesRegisterTable changes={changes.shippingAddress} />
          </CardContent>
        </Card>
      )}
      {changes.shippingMethod.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 shadow-sm dark:border-l-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Component className="size-5 text-orange-500 dark:text-orange-400" />
              {t('changes.shippingMethod')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangesRegisterTable changes={changes.shippingMethod} />
          </CardContent>
        </Card>
      )}
    </div>
  ) : (
    <Card className="border-muted">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          <Loader className="size-10 animate-spin text-orange-500" />
        </div>
        <h3 className="mb-2 text-xl font-medium">Checking for Changes</h3>
        <p className="max-w-md text-muted-foreground">Order changes are being checked. This may take a moment...</p>
      </CardContent>
    </Card>
  );
};
