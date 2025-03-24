'use client';

import {
  useOrder,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  ScrollArea,
  CustomCardHeader,
  EmptyState,
} from '@deenruv/react-ui-devkit';
import { priceFormatter } from '@/utils';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { CouponCodesCard } from '@/pages/orders/_components/CouponCodesCard.js';
import { BadgePercent, Gift, Tag, CreditCard, Sparkles } from 'lucide-react';

export const PromotionsList: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');

  if (!order) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-6 lg:grid-cols-12">
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <CouponCodesCard />
      </div>

      <Card className="col-span-1 h-full border-l-4 border-l-blue-500 shadow-sm transition-shadow duration-200 hover:shadow md:col-span-2 lg:col-span-3 dark:border-l-blue-400">
        <CustomCardHeader
          description={t('promotions.description', 'Active order promotions')}
          title={t('promotions.title', 'Promotions')}
          icon={<Gift className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
        />
        <CardContent className="p-0">
          <ScrollArea className="h-[280px] px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow noHover className="border-border border-b">
                  <TableHead className="py-3">{t('taxSummary.description')}</TableHead>
                  <TableHead className="py-3">{t('couponCodes.title')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.promotions.length ? (
                  order.promotions.map(({ name, couponCode }) => (
                    <TableRow key={name} noHover className="group">
                      <TableCell className="py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="capitalize">{name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {couponCode ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {couponCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyState
                    columnsLength={2}
                    title={t('promotions.noPromotions', 'No promotions applied')}
                    color="blue"
                    icon={<Gift />}
                    small
                  />
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="col-span-1 h-full border-l-4 border-l-green-500 shadow-sm transition-shadow duration-200 hover:shadow md:col-span-2 lg:col-span-6 dark:border-l-green-400">
        <CustomCardHeader
          description={t('discounts.description', 'Applied order discounts')}
          title={t('discounts.title', 'Discounts')}
          icon={<BadgePercent className="h-5 w-5 text-green-500 dark:text-green-400" />}
        />
        <CardContent className="p-0">
          <ScrollArea className="h-[280px] px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow noHover className="border-border border-b">
                  <TableHead className="py-3">{t('taxSummary.description')}</TableHead>
                  <TableHead className="py-3">{t('taxSummary.taxRate', 'Type')}</TableHead>
                  <TableHead className="py-3">{t('taxSummary.taxBase', 'Amount')}</TableHead>
                  <TableHead className="py-3">{t('taxSummary.taxTotal', 'With Tax')}</TableHead>
                  <TableHead className="py-3">{t('discounts.source', 'Source')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.discounts.length ? (
                  order.discounts.map(({ adjustmentSource, amount, amountWithTax, description, type }, index) => (
                    <TableRow key={index} noHover className="group">
                      <TableCell className="py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span className="capitalize">{description}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="font-medium">
                          {type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm">
                        {priceFormatter(amount, order.currencyCode)}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm">
                        {priceFormatter(amountWithTax, order.currencyCode)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="capitalize">
                          {adjustmentSource}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyState
                    columnsLength={5}
                    title={t('discounts.emptyState')}
                    color="green"
                    icon={<BadgePercent />}
                    small
                  />
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
