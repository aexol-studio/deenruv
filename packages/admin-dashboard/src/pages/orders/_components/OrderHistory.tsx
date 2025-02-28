import {
  useOrder,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  apiClient,
  cn,
} from '@deenruv/react-ui-devkit';

import { DeletionResult, ModelTypes } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { History } from '@/components';

export const OrderHistory: React.FC = () => {
  const {
    order,
    orderHistory: { data, error, loading },
    fetchOrderHistory,
  } = useOrder();
  const { t } = useTranslation('orders');

  const addMessageToOrder = async (input: ModelTypes['AddNoteToOrderInput']) => {
    if (!order) return;

    const { addNoteToOrder } = await apiClient('mutation')({
      addNoteToOrder: [{ input: input }, { id: true }],
    });
    if (addNoteToOrder?.id) {
      await fetchOrderHistory();
    } else {
      toast.error(t('history.addError'), { position: 'top-center' });
    }
  };

  const deleteMessageFromOrder = async (id: string) => {
    const { deleteOrderNote } = await apiClient('mutation')({
      deleteOrderNote: [{ id }, { message: true, result: true }],
    });
    if (deleteOrderNote.result === DeletionResult.DELETED) {
      await fetchOrderHistory();
    } else {
      toast.error(t('history.deleteError', { value: deleteOrderNote.message }), { position: 'top-center' });
    }
  };
  const editMessageInOrder = (input: ModelTypes['UpdateOrderNoteInput']) => {
    apiClient('mutation')({ updateOrderNote: [{ input }, { id: true }] })
      .then(() => fetchOrderHistory())
      .catch(() => toast.error(t('history.editError'), { position: 'top-center' }));
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="customSpinner" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {t('toasts.orderHistoryLoadingError', { value: order?.id })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
        <CardDescription>{t('history.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <History
          data={data}
          onNoteAdd={addMessageToOrder}
          onNoteDelete={deleteMessageFromOrder}
          onNoteEdit={editMessageInOrder}
        />
      </CardContent>
    </Card>
  );
};

OrderHistory.displayName = 'OrderHistory';
