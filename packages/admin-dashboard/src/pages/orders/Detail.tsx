import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import {
  useTranslation,
  useOrder,
  ORDER_STATE,
  EntityCustomFields,
  LoadingMask,
  DetailViewMarker,
  apiClient,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Routes,
} from '@deenruv/react-ui-devkit';
import { PromotionsList } from '@/pages/orders/_components/PromotionsList.js';
import { toast } from 'sonner';

const createDraftOrder = async () => {
  const response = await apiClient('mutation')({
    createDraftOrder: { id: true },
  });
  return response.createDraftOrder.id;
};

const DraftOrderCreateStart = () => {
  const { t } = useTranslation('orders');
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const onCreate = async () => {
    try {
      setIsCreating(true);
      const id = await createDraftOrder();

      if (!id) {
        toast.error(t('createDraftOrder.error'));
        return;
      }

      navigate(Routes.orders.to(id), { viewTransition: true });
    } catch {
      toast.error(t('createDraftOrder.error'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="my-4">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-[720px] items-center px-4 2xl:px-8">
        <Card className="w-full">
          <CardHeader className="space-y-2 text-center sm:text-left">
            <CardTitle>{t('createDraftOrder.title')}</CardTitle>
            <CardDescription>{t('createDraftOrder.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(Routes.orders.list, { viewTransition: true })}
                disabled={isCreating}
              >
                {t('createDraftOrder.cancelButton')}
              </Button>
              <Button onClick={onCreate} disabled={isCreating}>
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    {t('createDraftOrder.creating')}
                  </span>
                ) : (
                  t('createDraftOrder.startButton')
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export const OrdersDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('orders');
  const { order, mode, fetchOrder, loading } = useOrder();
  const isCreateRoute = id === 'new';

  useEffect(() => {
    if (id && !isCreateRoute) fetchOrder(id);
  }, [id, isCreateRoute]);

  if (isCreateRoute) return <DraftOrderCreateStart />;

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
        <DetailViewMarker position="order-detail-view" />
        {order.state !== ORDER_STATE.DRAFT && <OrderHistory />}
      </div>
    </main>
  );
};
