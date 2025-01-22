import React, { useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MultipleSelector,
  Option,
  useLazyQuery,
  useMutation,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { useOrder } from '@/state/order.js';
import { toast } from 'sonner';
import { draftOrderSelector } from '@/graphql/draft_order.js';

const PromotionCodesQuery = typedGql('query', { scalars })({
  promotions: [
    { options: { filter: { couponCode: { contains: $('code', 'String!') } } } },
    { items: { couponCode: true, name: true } },
  ],
});

const ApplyCouponCodeMutation = typedGql('mutation', { scalars })({
  applyCouponCodeToDraftOrder: [
    { orderId: $('orderId', 'ID!'), couponCode: $('couponCode', 'String!') },
    { '...on CouponCodeExpiredError': { message: true }, __typename: true, '...on Order': draftOrderSelector },
  ],
});

const RemoveCouponCodeMutation = typedGql('mutation', { scalars })({
  removeCouponCodeFromDraftOrder: [
    { orderId: $('orderId', 'ID!'), couponCode: $('couponCode', 'String!') },
    draftOrderSelector,
  ],
});

export const CouponCodesCard: React.FC<{}> = () => {
  const { t } = useTranslation('orders');
  const { order, setOrder, fetchOrder } = useOrder();
  const [fetchPromotionCodes] = useLazyQuery(PromotionCodesQuery);
  const [applyCoupon] = useMutation(ApplyCouponCodeMutation);
  const [removeCoupon] = useMutation(RemoveCouponCodeMutation);
  const [currentValue, setCurrentValue] = useState<Option[]>(
    order?.couponCodes.map((c) => ({ label: c, value: c })) || [],
  );

  const handleChange = useCallback(
    (e: Option[]) => {
      if (!order) return;
      const currentState = currentValue.map((v) => v.value) || [];
      if (e.length > currentState?.length) {
        applyCoupon({ couponCode: e[e.length - 1].value, orderId: order.id }).then((resp) => {
          if (resp.applyCouponCodeToDraftOrder.__typename === 'Order') setOrder(resp.applyCouponCodeToDraftOrder);
          toast.success(t('couponCodes.addToastSuccess'));
          setCurrentValue((prev) => [...prev, e[e.length - 1]]);
        });
      } else {
        const couponToRemove = currentState.find((c) => !e.map((i) => i.value).includes(c));
        if (couponToRemove)
          removeCoupon({ couponCode: couponToRemove, orderId: order.id }).then((resp) => {
            if (resp.removeCouponCodeFromDraftOrder?.id) setOrder(resp.removeCouponCodeFromDraftOrder);
            toast.success(t('couponCodes.removeToastSuccess'));
            setCurrentValue((prev) => prev.filter((i) => i.value !== couponToRemove));
          });
      }
    },
    [order?.couponCodes],
  );

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>{t('couponCodes.title')}</CardTitle>
        <CardDescription>{t('couponCodes.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <MultipleSelector
          hideClearAllButton
          placeholder={t('couponCodes.placeholder')}
          value={currentValue}
          onChange={handleChange}
          onSearch={(searchString) =>
            fetchPromotionCodes({ code: searchString }).then((resp) =>
              resp.promotions.items
                .filter((i) => i.couponCode)
                .map((i) => ({ value: i.couponCode!, label: `${i.couponCode}` || '' })),
            )
          }
          delay={500}
        />
      </CardContent>
    </Card>
  );
};
