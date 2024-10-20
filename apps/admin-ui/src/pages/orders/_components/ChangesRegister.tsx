import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrder } from '@/state/order';
import { cn } from '@/lib/utils';

export const ChangesRegister: React.FC = () => {
  const { t } = useTranslation('orders');
  const { getObjectsChanges: getOrderChanges, linePriceChangeInput, modifiedOrder, order } = useOrder();
  const changes = useMemo(() => {
    const changes = getOrderChanges();
    return {
      ...changes,
      linesChanges: {
        existing: [
          ...changes.linesChanges
            .filter((change) => !('isNew' in change))
            .map((change) => {
              const exitingLinePriceChangeInput = linePriceChangeInput?.linesToOverride.find(
                (l: any) => l.lineID === change.lineID,
              );
              const quantity = order?.lines.find((line) => line.id === change.lineID)?.quantity;
              const modifyLine = modifiedOrder?.lines.find((line) => line.id === change.lineID);
              if (!exitingLinePriceChangeInput || !modifyLine) return change;
              const lineTax = modifyLine?.taxRate;
              const orginalPrice = modifyLine.discountedLinePrice / (quantity ?? 1);
              const orginalPriceWithTax = modifyLine.discountedLinePriceWithTax / (quantity ?? 1);
              const price = exitingLinePriceChangeInput?.netto
                ? exitingLinePriceChangeInput.value
                : exitingLinePriceChangeInput.value -
                  exitingLinePriceChangeInput.value * (typeof lineTax !== 'undefined' ? lineTax / 100 : 1);
              const priceWithTax = exitingLinePriceChangeInput.netto
                ? exitingLinePriceChangeInput.value * (lineTax ? 1 + lineTax / 100 : 1)
                : exitingLinePriceChangeInput.value;
              return {
                ...change,
                changes: [
                  ...change.changes,
                  { path: 'price', added: price, removed: orginalPrice, value: undefined, changed: undefined },
                  {
                    path: 'priceWithTax',
                    added: priceWithTax,
                    removed: orginalPriceWithTax,
                    value: undefined,
                    changed: undefined,
                  },
                ],
              };
            }),
          ...(linePriceChangeInput?.linesToOverride ?? [])
            .filter((l: any) => !changes.linesChanges.some((change) => change.lineID === l.lineID))
            .map((l: any) => {
              const modifyLine = modifiedOrder?.lines.find((line) => line.id === l.lineID);
              if (!modifyLine) return null;
              const lineTax = modifyLine?.taxRate;
              const orginalPrice = modifyLine.discountedLinePrice / modifyLine?.quantity;
              const orginalPriceWithTax = modifyLine.discountedLinePriceWithTax / modifyLine?.quantity;
              const price = l?.netto
                ? l.value
                : l.value - l.value * (typeof lineTax !== 'undefined' ? lineTax / 100 : 1);
              const priceWithTax = l.netto ? l.value * (lineTax ? 1 + lineTax / 100 : 1) : l.value;
              return {
                lineID: l.lineID,
                variantName: modifyLine.productVariant.name,
                changes: [
                  { path: 'price', added: price, removed: orginalPrice, value: undefined, changed: undefined },
                  {
                    path: 'priceWithTax',
                    added: priceWithTax,
                    removed: orginalPriceWithTax,
                    value: undefined,
                    changed: undefined,
                  },
                ],
              };
            }),
        ],
        new: changes.linesChanges.filter((change) => 'isNew' in change),
      },
    };
  }, [getOrderChanges, order, modifiedOrder, linePriceChangeInput]);

  const mabeyPriceMabeyAttribute = (fieldName: string, value: string | number) => {
    if (fieldName.includes('price') && !isNaN(Number(value))) return (Number(value) / 100).toFixed(2);
    return value;
  };

  const givePathForTranslation = (path: string): string => t(`changes.keys.${path.split('.').pop()}`, '');

  return (
    <div className="flex flex-col gap-4 pb-8">
      {changes.linesChanges.existing.length ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-base">Zmiany w liniach zamówienia</h3>
          {changes.linesChanges.existing.map((change) => (
            <Card className="border-warning-foreground" key={change?.lineID}>
              <CardHeader>
                <div className="flex flex-col  gap-2">
                  <h4 className="text-muted-foreground">{`ID linii zamówienia: ${change?.lineID}`}</h4>
                  <h4 className="text-muted-foreground">{`Nazwa wariantu: ${change?.variantName}`}</h4>{' '}
                </div>
              </CardHeader>
              <CardContent>
                <h4>{t('changes.mainChanges')}</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('searchProduct.name')}</TableHead>
                      <TableHead>{t('previous')}</TableHead>
                      <TableHead>{t('current')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {change?.changes
                      .filter((change: any) => !change.path.includes('attributes'))
                      .map((propertyChange: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-muted-foreground">
                            {givePathForTranslation(propertyChange.path)}
                          </TableCell>
                          <TableCell className="text-red-700">
                            {propertyChange.path.includes('attributes')
                              ? propertyChange.path.split('.').pop()
                              : mabeyPriceMabeyAttribute(propertyChange.path, propertyChange.removed)}
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            {propertyChange.path.includes('attributes')
                              ? (propertyChange.value as string)
                              : mabeyPriceMabeyAttribute(propertyChange.path, propertyChange.added)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {change?.changes.filter((change: any) => change.path.includes('attributes')).length ? (
                  <>
                    <div className="my-6 h-[1px] w-full bg-muted-foreground" />
                    <h4>{t('changes.attributesChanges')}</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('changes.change')}</TableHead>
                          <TableHead>{t('changes.key')}</TableHead>
                          <TableHead>{t('changes.value')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {change.changes
                          .filter((change: any) => change.path.includes('attributes'))
                          .map((propertyChange: any, i: number) => (
                            <TableRow
                              className={cn(propertyChange.changed === 'removed' ? 'text-red-700' : 'text-green-700')}
                              key={i}
                            >
                              <TableCell className="font-medium">
                                {propertyChange.changed === 'removed' ? 'Usunięto atrybut' : `Dodano atrybut`}
                              </TableCell>
                              <TableCell>{propertyChange.path.split('.').pop()}</TableCell>
                              <TableCell>{propertyChange.value as string}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
      {changes.linesChanges.new.length ? (
        <div className="flex flex-col gap-2">
          <Card className="border-green-700">
            <CardHeader>
              <h3 className="text-base">{t('changes.newAddedLines')}</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('changes.variant')}</TableHead>
                    <TableHead>{t('changes.keys.price')}</TableHead>
                    <TableHead>{t('changes.keys.priceWithTax')}</TableHead>
                    <TableHead>{t('changes.keys.quantity')}</TableHead>
                    <TableHead>{t('changes.keys.overallPriceWithTax')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.linesChanges.new.map(({ changes }) =>
                    changes.map((propertyChange, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-muted-foreground">
                          {(propertyChange.value as Record<string, Record<string, string>>).productVariant.name}
                        </TableCell>
                        <TableCell>
                          {mabeyPriceMabeyAttribute(
                            'price',
                            (propertyChange.value as Record<string, string>).linePrice,
                          )}
                        </TableCell>
                        <TableCell className="font-bold ">
                          {mabeyPriceMabeyAttribute(
                            'price',
                            (propertyChange.value as Record<string, string>).linePriceWithTax,
                          )}
                        </TableCell>
                        <TableCell className="font-bold ">
                          {(propertyChange.value as Record<string, number>).quantity}
                        </TableCell>
                        <TableCell className="font-bold ">
                          {mabeyPriceMabeyAttribute(
                            'price',
                            (propertyChange.value as Record<string, number>).quantity *
                              (propertyChange.value as Record<string, number>).linePriceWithTax,
                          )}
                        </TableCell>
                      </TableRow>
                    )),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
