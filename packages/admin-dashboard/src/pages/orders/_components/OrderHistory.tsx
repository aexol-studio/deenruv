import type React from 'react';
import {
  useOrder,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  apiClient,
} from '@deenruv/react-ui-devkit';

import { DeletionResult, type ModelTypes } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { History } from '@/components';
import { ClipboardList, AlertCircle } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const {
    order,
    orderHistory: { data, error, loading },
    fetchOrderHistory,
  } = useOrder();
  const { t } = useTranslation('orders');

  const addMessageToOrder = async (input: ModelTypes['AddNoteToOrderInput']) => {
    if (!order) return;

    try {
      const { addNoteToOrder } = await apiClient('mutation')({
        addNoteToOrder: [{ input: input }, { id: true }],
      });

      if (addNoteToOrder?.id) {
        await fetchOrderHistory();
        toast.success(t('history.addSuccess', 'Note added successfully'));
      } else {
        toast.error(t('history.addError'), { position: 'top-center' });
      }
    } catch (error) {
      toast.error(t('history.addError'), { position: 'top-center' });
    }
  };

  const deleteMessageFromOrder = async (id: string) => {
    try {
      const { deleteOrderNote } = await apiClient('mutation')({
        deleteOrderNote: [{ id }, { message: true, result: true }],
      });

      if (deleteOrderNote.result === DeletionResult.DELETED) {
        await fetchOrderHistory();
        toast.success(t('history.deleteSuccess', 'Note deleted successfully'));
      } else {
        toast.error(t('history.deleteError', { value: deleteOrderNote.message }), { position: 'top-center' });
      }
    } catch (error) {
      toast.error(t('history.deleteError', { value: error instanceof Error ? error.message : 'Unknown error' }), {
        position: 'top-center',
      });
    }
  };

  const editMessageInOrder = async (input: ModelTypes['UpdateOrderNoteInput']) => {
    try {
      await apiClient('mutation')({ updateOrderNote: [{ input }, { id: true }] });
      await fetchOrderHistory();
      toast.success(t('history.editSuccess', 'Note updated successfully'));
    } catch (error) {
      toast.error(t('history.editError'), { position: 'top-center' });
    }
  };

  if (loading) {
    return (
      <Card className="border-l-4 border-l-amber-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-amber-400">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <div>
              <CardTitle>{t('history.title', 'Order History')}</CardTitle>
              <CardDescription>{t('history.description', 'Timeline of order events and notes')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
            <p className="text-muted-foreground mt-4 text-sm">{t('history.loading', 'Loading order history...')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4 border-l-amber-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-amber-400">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <div>
              <CardTitle>{t('history.title', 'Order History')}</CardTitle>
              <CardDescription>{t('history.description', 'Timeline of order events and notes')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-red-600">{t('toasts.orderHistoryLoadingError', { value: order?.id })}</p>
              <p className="text-muted-foreground mt-2 text-sm">
                {t('history.tryAgain', 'Please try refreshing the page')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-amber-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-amber-400">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <div>
            <CardTitle>{t('history.title', 'Order History')}</CardTitle>
            <CardDescription>{t('history.description', 'Timeline of order events and notes')}</CardDescription>
          </div>
        </div>
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
