import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { useTranslation, useOrder, ORDER_STATE, EntityCustomFields, LoadingMask } from '@deenruv/react-ui-devkit';
import { PromotionsList } from '@/pages/orders/_components/PromotionsList.js';

export const OrdersDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('orders');
  const { order, mode, fetchOrder, loading } = useOrder();

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  if (loading) return <LoadingMask />;

  if (!order || !mode) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        {t('toasts.orderLoadingError', { value: id })}
      </div>
    );
  }

  return (
    <main className="my-4">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
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
        {mode === 'update' && <SurchargeCard />}
        {order.state !== ORDER_STATE.DRAFT && <PromotionsList />}
        {order.state !== ORDER_STATE.DRAFT && <OrderHistory />}
      </div>
    </main>
  );
};
