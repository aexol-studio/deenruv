'use client';

import {
  useOrder,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  ScrollArea,
  EmptyState,
  CustomCard,
  useTranslation,
  Button,
  useMutation,
  CardDescription,
  useLazyQuery,
  Input,
  OrderDetailSelector,
} from '@deenruv/react-ui-devkit';
import { priceFormatter } from '@/utils';
import type React from 'react';
import { BadgePercent, Gift, Tag, CreditCard, Trash, Plus } from 'lucide-react';
import { $, ModelTypes, scalars, typedGql } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const ToggleExcludePromotionMutation = typedGql('mutation', { scalars })({
  toggleExcludePromotionInOrder: [
    { orderId: $('orderId', 'ID!'), promotionId: $('promotionId', 'ID!') },
    OrderDetailSelector,
  ],
});

const ExcludedPromotionsQuery = typedGql('query', { scalars })({
  promotions: [{ options: { filter: { id: { in: $('ids', '[String!]') } } } }, { items: { name: true, id: true } }],
});

const ApplyCouponCodeMutation = typedGql('mutation', { scalars })({
  applyCouponCodeToDraftOrder: [
    { orderId: $('orderId', 'ID!'), couponCode: $('couponCode', 'String!') },
    { '...on CouponCodeExpiredError': { message: true }, __typename: true, '...on Order': OrderDetailSelector },
  ],
});

const RemoveCouponCodeMutation = typedGql('mutation', { scalars })({
  removeCouponCodeFromDraftOrder: [
    { orderId: $('orderId', 'ID!'), couponCode: $('couponCode', 'String!') },
    OrderDetailSelector,
  ],
});

export const PromotionsList: React.FC = () => {
  const { order, setOrder } = useOrder();
  const { t } = useTranslation('orders');

  const [togglePromotionExclusion, { loading: exclusionLoading }] = useMutation(ToggleExcludePromotionMutation);
  const [removeCoupon, { loading: removeCouponLoading }] = useMutation(RemoveCouponCodeMutation);
  const [applyCoupon] = useMutation(ApplyCouponCodeMutation);
  const [fetchExcludedPromotions, { data: excludedData }] = useLazyQuery(ExcludedPromotionsQuery);
  const excluded = excludedData?.promotions?.items ?? [];

  const loading = exclusionLoading || removeCouponLoading;

  useEffect(() => {
    fetchExcludedPromotions({
      ids: order?.excludedPromotionIds || [],
    });
  }, [order?.excludedPromotionIds]);

  const [couponCode, setCouponCode] = useState('');

  if (!order) return null;

  const removeExcludePromotionHandler = async ({
    id,
    couponCode,
  }: Pick<ModelTypes['Promotion'], 'id' | 'couponCode'>) => {
    let res: Awaited<ReturnType<typeof togglePromotionExclusion | typeof removeCoupon>>;

    if (!couponCode) {
      res = await togglePromotionExclusion({ orderId: order.id, promotionId: id });
    } else {
      res = await removeCoupon({ orderId: order.id, couponCode: couponCode });
    }
    if ('removeCouponCodeFromDraftOrder' in res) {
      setOrder(res.removeCouponCodeFromDraftOrder);
    } else if ('toggleExcludePromotionInOrder' in res) {
      setOrder(res.toggleExcludePromotionInOrder);
    }
  };

  const addCouponHandler = async () => {
    const resp = await applyCoupon({ couponCode: couponCode, orderId: order.id });

    if (resp.applyCouponCodeToDraftOrder.__typename === 'Order') {
      setOrder(resp.applyCouponCodeToDraftOrder);
      setCouponCode('');
      toast.success(t('couponCodes.addToastSuccess'));
    } else {
      toast.error('could not add coupon code');
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
      <CustomCard
        notCollapsible
        color="blue"
        description={t('promotions.description', 'Active order promotions')}
        title={t('promotions.title', 'Promotions')}
        wrapperClassName="col-span-1 h-full md:col-span-2 lg:col-span-6"
        icon={<Gift />}
        upperRight={
          <div className="flex gap-2 py-2">
            <Input
              placeholder={t('couponCodes.placeholder')}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button size={'icon'} className="w-14" onClick={addCouponHandler}>
              <Plus />
            </Button>
          </div>
        }
      >
        <ScrollArea className="h-[280px]">
          <Table className="h-full">
            <TableHeader>
              <TableRow noHover className="border-border border-b">
                <TableHead className="py-3">{t('taxSummary.description')}</TableHead>
                <TableHead className="py-3">{t('couponCodes.title')}</TableHead>
                <TableHead align="right" style={{ textAlign: 'right' }}>
                  {t('table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-[232px]">
              {order.promotions.length ? (
                order.promotions.map(({ name, couponCode, id }) => (
                  <TableRow key={name} noHover className="group">
                    <TableCell className="py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="size-4 text-blue-500 dark:text-blue-400" />
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
                    <TableCell align="right">
                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={loading}
                        onClick={() => removeExcludePromotionHandler({ couponCode, id })}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyState
                  columnsLength={3}
                  title={t('promotions.noPromotions', 'No promotions applied')}
                  color="blue"
                  icon={<Gift />}
                  small
                />
              )}
            </TableBody>
          </Table>
          {!!excluded.length && (
            <>
              <hr className="!my-4 border-t-[3px]" />
              <CardDescription>{t('promotion.excludedPromotions')}</CardDescription>
              <Table>
                <TableHeader>
                  <TableRow noHover>
                    <TableHead>{t('promotion.name')}</TableHead>
                    <TableHead align="right" style={{ textAlign: 'right' }}>
                      {t('table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excluded.map(({ name, id }) => (
                    <TableRow key={name} noHover>
                      <TableCell className="capitalize">{name}</TableCell>
                      <TableCell align="right">
                        <Button size="icon" variant="destructive" onClick={() => removeExcludePromotionHandler({ id })}>
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </ScrollArea>
      </CustomCard>

      <CustomCard
        notCollapsible
        description={t('discounts.description', 'Applied order discounts')}
        title={t('discounts.title', 'Discounts')}
        icon={<BadgePercent className="size-5 text-green-500 dark:text-green-400" />}
        wrapperClassName="col-span-1 h-full md:col-span-2 lg:col-span-6"
        color="green"
      >
        <ScrollArea className="h-[280px]">
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
            <TableBody className="h-[232px]">
              {order.discounts.length ? (
                order.discounts.map(({ adjustmentSource, amount, amountWithTax, description, type }, index) => (
                  <TableRow key={index} noHover className="group">
                    <TableCell className="py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-green-500 dark:text-green-400" />
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
      </CustomCard>
    </div>
  );
};
