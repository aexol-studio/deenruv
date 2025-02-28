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
  useOrder,
  cn,
} from '@deenruv/react-ui-devkit';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const ChangesRegister: React.FC = () => {
  const { t } = useTranslation('orders');
  const { getObjectsChanges: getOrderChanges, modifiedOrder, order } = useOrder();
  const changes = useMemo(() => {
    const changes = getOrderChanges();
    return {
      ...changes,
      linesChanges: {
        existing: changes.linesChanges.filter((change) => !('isNew' in change)),
        new: changes.linesChanges.filter((change) => 'isNew' in change),
      },
    };
  }, [getOrderChanges, order, modifiedOrder]);

  const surcharges = useMemo(() => changes.resChanges.filter((ch) => ch.path.startsWith('surcharges')), [changes]);

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
                    {change?.changes.map((propertyChange, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground font-medium">
                          {givePathForTranslation(propertyChange.path)}
                        </TableCell>
                        <TableCell className="text-red-700">
                          {mabeyPriceMabeyAttribute(propertyChange.path, propertyChange.removed)}
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {mabeyPriceMabeyAttribute(propertyChange.path, propertyChange.added)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {change?.changes.length ? (
                  <>
                    <div className="bg-muted-foreground my-6 h-[1px] w-full" />
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
                        {change.changes.map((propertyChange, i) => (
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
                        <TableCell className="text-muted-foreground font-medium">
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

      {surcharges.length ? (
        <div className="flex flex-col gap-2">
          <Card className="border-green-700">
            <CardHeader>
              <h3 className="text-base">{t('changes.surcharges')}</h3>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('changes.keys.sku')}</TableHead>
                    <TableHead>{t('changes.keys.price')}</TableHead>
                    <TableHead>{t('changes.keys.priceWithTax')}</TableHead>
                    <TableHead>{t('changes.keys.quantity')}</TableHead>
                    <TableHead>{t('changes.keys.overallPriceWithTax')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surcharges.map((surcharge, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground font-medium">{surcharge.value?.sku}</TableCell>
                      <TableCell>{mabeyPriceMabeyAttribute('price', surcharge.value?.price)}</TableCell>
                      <TableCell className="font-bold ">
                        {mabeyPriceMabeyAttribute('price', surcharge.value?.priceWithTax)}
                      </TableCell>
                      <TableCell className="font-bold ">-</TableCell>
                      <TableCell className="font-bold ">
                        {mabeyPriceMabeyAttribute('price', surcharge.value?.priceWithTax)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
