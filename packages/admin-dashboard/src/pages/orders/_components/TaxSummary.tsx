import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const TaxSummary: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('taxSummary.title')}</CardTitle>
        <CardDescription>{t('taxSummary.subTitle')}</CardDescription>
        <Table>
          <TableHeader>
            <TableRow noHover>
              <TableHead>{t('taxSummary.description')}</TableHead>
              <TableHead>{t('taxSummary.taxRate')}</TableHead>
              <TableHead>{t('taxSummary.taxBase')}</TableHead>
              <TableHead>{t('taxSummary.taxTotal')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.taxSummary.length ? (
              order.taxSummary.map(({ description, taxRate, taxBase, taxTotal }) => (
                <TableRow key={description} noHover>
                  <TableCell className="capitalize">{description}</TableCell>
                  <TableCell>{taxRate}%</TableCell>
                  <TableCell>{priceFormatter(taxBase, order.currencyCode)}</TableCell>
                  <TableCell>{priceFormatter(taxTotal, order.currencyCode)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow noHover>
                <TableCell colSpan={4}>{t('taxSummary.noTaxSummary')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardHeader>
    </Card>
  );
};
