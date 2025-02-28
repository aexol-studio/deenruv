import {
  useOrder,
  Button,
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
import { priceFormatter } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CouponCodesCard } from '@/pages/orders/_components/CouponCodesCard.js';
import { Trash } from 'lucide-react';

export const PromotionsList: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;
  return (
    <div className="grid w-full grid-cols-6 gap-4">
      <CouponCodesCard />
      <Card className="col-span-2 h-full">
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
          <CardDescription>Order promotions</CardDescription>
          <Table>
            <TableHeader>
              <TableRow noHover>
                <TableHead>{t('taxSummary.description')}</TableHead>
                <TableHead>{t('couponCodes.title')}</TableHead>
                {/* <TableHead align="right" style={{ textAlign: 'right' }}>
                  {t('table.actions')}
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.promotions.length ? (
                order.promotions.map(({ name, couponCode }) => (
                  <TableRow key={name} noHover>
                    <TableCell className="capitalize">{name}</TableCell>
                    <TableCell>{couponCode || '-'}</TableCell>
                    {/* <TableCell align="right">
                      <Button size="icon" variant="destructive">
                        <Trash size={16} />
                      </Button>
                    </TableCell> */}
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
      <Card className="col-span-3 h-full">
        <CardHeader>
          <CardTitle>{t('discounts.title')}</CardTitle>
          <CardDescription>{t('discounts.description')}</CardDescription>
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
                  <TableCell colSpan={4}>{t('discounts.emptyState')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>
      </Card>
    </div>
  );
};
