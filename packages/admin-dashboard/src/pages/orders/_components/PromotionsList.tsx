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
} from '@deenruv/react-ui-devkit';
import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const PromotionsList: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;
  return (
    <div className="flex w-full items-center justify-between gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
          <CardDescription>Order promotions</CardDescription>
          <Table>
            <TableHeader>
              <TableRow noHover>
                <TableHead>{t('taxSummary.description')}</TableHead>
                <TableHead>{t('taxSummary.taxRate')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.promotions.length ? (
                order.promotions.map(({ name, couponCode }) => (
                  <TableRow key={name} noHover>
                    <TableCell className="capitalize">{name}</TableCell>
                    <TableCell>{couponCode}</TableCell>
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Discounts</CardTitle>
          <CardDescription>Order discounts</CardDescription>
          <Table>
            <TableHeader>
              <TableRow noHover>
                <TableHead>{t('taxSummary.description')}</TableHead>
                <TableHead>{t('taxSummary.taxRate')}</TableHead>
                <TableHead>{t('taxSummary.taxBase')}</TableHead>
                <TableHead>{t('taxSummary.taxTotal')}</TableHead>
                <TableHead>{t('taxSummary.taxTotal')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.discounts.length ? (
                order.discounts.map(({ adjustmentSource, amount, amountWithTax, description, type }, index) => (
                  <TableRow key={index} noHover>
                    <TableCell className="capitalize">{description}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{priceFormatter(amount, order.currencyCode)}</TableCell>
                    <TableCell>{priceFormatter(amountWithTax, order.currencyCode)}</TableCell>
                    <TableCell>{adjustmentSource}</TableCell>
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
    </div>
  );
};
