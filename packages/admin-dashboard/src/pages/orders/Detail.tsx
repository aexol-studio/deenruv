import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OrderSummary,
  RealizationCard,
  CustomerSelectCard,
  AddressCard,
  ShippingMethod,
  TaxSummary,
  OrderHistory,
  ProductsCard,
  TopActions,
  Payments,
  SurchargeCard,
} from '@/pages/orders/_components';
import { EntityCustomFields } from '@/components';
import { useOrder, ORDER_STATE } from '@deenruv/react-ui-devkit';
import { PromotionsList } from '@/pages/orders/_components/PromotionsList.js';

export const OrdersDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('orders');
  const { order, mode, fetchOrder } = useOrder();

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  if (!order || !mode) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        {t('toasts.orderLoadingError', { value: id })}
      </div>
    );
  }

  return (
    <main className="my-4">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 2xl:px-8">
        <TopActions />
        <OrderSummary />
        <RealizationCard />
        {order.state !== ORDER_STATE.DRAFT && <Payments />}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CustomerSelectCard />
          <AddressCard type="billing" />
          <AddressCard type="shipping" />
          <ShippingMethod />
        </div>
        <ProductsCard />
        <TaxSummary />
        <EntityCustomFields entityName="order" id={id} />
        {order.state !== ORDER_STATE.DRAFT && <SurchargeCard />}
        {order.state !== ORDER_STATE.DRAFT && <PromotionsList />}
        {order.state !== ORDER_STATE.DRAFT && <OrderHistory />}
      </div>
    </main>
  );
};
