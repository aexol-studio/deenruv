'use client';

import type React from 'react';
import { useCallback, useState } from 'react';
import {
  MultipleSelector,
  type Option,
  useLazyQuery,
  useOrder,
  useMutation,
  OrderDetailSelector,
  EmptyState,
  CustomCard,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { Ticket, X, Search } from 'lucide-react';

const PromotionCodesQuery = typedGql('query', { scalars })({
  promotions: [
    { options: { filter: { couponCode: { contains: $('code', 'String!') } } } },
    { items: { couponCode: true, name: true } },
  ],
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

export const CouponCodesCard: React.FC<{}> = () => {
  const { t } = useTranslation('orders');
  const { order, setOrder } = useOrder();
  const [fetchPromotionCodes] = useLazyQuery(PromotionCodesQuery);
  const [applyCoupon] = useMutation(ApplyCouponCodeMutation);
  const [removeCoupon] = useMutation(RemoveCouponCodeMutation);
  const [currentValue, setCurrentValue] = useState<Option[]>(
    order?.couponCodes.map((c) => ({ label: c, value: c })) || [],
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = useCallback(
    (e: Option[]) => {
      if (!order) return;
      const currentState = currentValue.map((v) => v.value) || [];
      if (e.length > currentState?.length) {
        const newCoupon = e[e.length - 1];
        toast.promise(
          applyCoupon({ couponCode: newCoupon.value, orderId: order.id }).then((resp) => {
            if (resp.applyCouponCodeToDraftOrder.__typename === 'Order') {
              setOrder(resp.applyCouponCodeToDraftOrder);
              setCurrentValue((prev) => [...prev, newCoupon]);
              return true;
            } else {
              throw new Error('Failed to apply coupon');
            }
          }),
          {
            loading: t('couponCodes.addingCoupon', 'Applying coupon code...'),
            success: t('couponCodes.addToastSuccess', 'Coupon code applied successfully'),
            error: (err) => err.message,
          },
        );
      } else {
        const couponToRemove = currentState.find((c) => !e.map((i) => i.value).includes(c));
        if (couponToRemove) {
          toast.promise(
            removeCoupon({ couponCode: couponToRemove, orderId: order.id }).then((resp) => {
              if (resp.removeCouponCodeFromDraftOrder?.id) {
                setOrder(resp.removeCouponCodeFromDraftOrder);
                setCurrentValue((prev) => prev.filter((i) => i.value !== couponToRemove));
                return true;
              }
              return false;
            }),
            {
              loading: t('couponCodes.removingCoupon', 'Removing coupon code...'),
              success: t('couponCodes.removeToastSuccess', 'Coupon code removed successfully'),
              error: t('couponCodes.removeToastError', 'Failed to remove coupon code'),
            },
          );
        }
      }
    },
    [order, currentValue, applyCoupon, removeCoupon, setOrder, t],
  );

  return (
    <CustomCard
      notCollapsible
      color="purple"
      description={t('couponCodes.description', 'Apply coupon codes to this order')}
      title={t('couponCodes.title', 'Coupon Codes')}
      icon={<Ticket />}
    >
      <div className="relative">
        <MultipleSelector
          hideClearAllButton
          placeholder={t('couponCodes.placeholder', 'Search for coupon codes...')}
          value={currentValue}
          onChange={handleChange}
          onSearch={(searchString) => {
            setIsSearching(true);
            return fetchPromotionCodes({ code: searchString })
              .then((resp) =>
                resp.promotions.items
                  .filter((i) => i.couponCode)
                  .map((i) => ({
                    value: i.couponCode!,
                    label: i.couponCode!,
                    description: i.name,
                  })),
              )
              .finally(() => setIsSearching(false));
          }}
          delay={500}
        />
        <div className="text-muted-foreground absolute right-3 top-2.5">
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {currentValue.length === 0 && (
        <EmptyState
          columnsLength={2}
          title={t('couponCodes.noCoupons', 'No coupon codes applied')}
          description={t('couponCodes.searchToAdd', 'Search above to find and apply coupon codes')}
          color="purple"
          icon={<Ticket />}
          small
        />
      )}
    </CustomCard>
  );
};
