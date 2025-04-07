'use client';

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  apiClient,
  useOrder,
  OrderDetailSelector,
  Badge,
  ScrollArea,
  CustomCard,
  ContextMenu,
  DropdownMenuItem,
  ConfirmationDialog,
  Button,
} from '@deenruv/react-ui-devkit';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ORDER_STATE } from '@/graphql/base';
import { Package, Truck, CheckCircle, XCircle, AlertCircle, Loader2, ClipboardCheck } from 'lucide-react';

export const RealizationCard: React.FC = () => {
  const { order, setOrder, fetchOrderHistory, cancelFulfillment } = useOrder();
  const { t } = useTranslation('orders');
  const [processingFulfillments, setProcessingFulfillments] = useState<Record<string, boolean>>({});

  const markAsDelivered = async (fulfillmentId: string) => {
    if (!order) return;

    setProcessingFulfillments((prev) => ({ ...prev, [fulfillmentId]: true }));

    try {
      const { transitionFulfillmentToState } = await apiClient('mutation')({
        transitionFulfillmentToState: [
          { id: fulfillmentId, state: 'Delivered' },
          {
            __typename: true,
            '...on Fulfillment': {
              id: true,
            },
            '...on FulfillmentStateTransitionError': {
              errorCode: true,
              fromState: true,
              message: true,
              toState: true,
              transitionError: true,
            },
          },
        ],
      });

      if (transitionFulfillmentToState.__typename === 'Fulfillment') {
        const resp = await apiClient('query')({ order: [{ id: order.id }, OrderDetailSelector] });
        setOrder(resp.order);
        fetchOrderHistory();
        toast.success(t('fulfillments.deliveredSuccess', 'Fulfillment marked as delivered'));
      } else {
        const errorMessage = transitionFulfillmentToState?.message || t('fulfillments.error', 'Something went wrong');
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(t('fulfillments.error', 'Something went wrong'));
    } finally {
      setProcessingFulfillments((prev) => ({ ...prev, [fulfillmentId]: false }));
    }
  };

  const handleCancelFulfillment = async (fulfillmentId: string) => {
    if (!order) return;
    setProcessingFulfillments((prev) => ({ ...prev, [fulfillmentId]: true }));
    try {
      cancelFulfillment(fulfillmentId);
    } finally {
      setProcessingFulfillments((prev) => ({ ...prev, [fulfillmentId]: false }));
    }
  };

  const markAllAsDelivered = useCallback(async () => {
    const shippedIds = order?.fulfillments?.filter((f) => f.state === ORDER_STATE.SHIPPED).map((f) => f.id);
    shippedIds?.forEach((id) => {
      markAsDelivered(id);
    });
  }, []);

  const getFulfillmentStateBadge = (state: string) => {
    switch (state) {
      case ORDER_STATE.CREATED:
        return { variant: 'secondary' as const, icon: <Package className="mr-1 size-3.5" /> };
      case ORDER_STATE.SHIPPED:
        return { variant: 'outline' as const, icon: <Truck className="mr-1 size-3.5 text-blue-500" /> };
      case ORDER_STATE.DELIVERED:
        return { variant: 'success' as const, icon: <CheckCircle className="mr-1 size-3.5" /> };
      case ORDER_STATE.CANCELLED:
        return { variant: 'destructive' as const, icon: <XCircle className="mr-1 size-3.5" /> };
      default:
        return { variant: 'outline' as const, icon: <AlertCircle className="mr-1 size-3.5" /> };
    }
  };

  if (!order) return null;

  if (!order.fulfillments?.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <CustomCard
          title={t('fulfillments.title', 'Order Fulfillments')}
          description={t('fulfillments.description', 'Track and manage the delivery status of this order')}
          icon={<ClipboardCheck />}
          color="rose"
          upperRight={
            <Button
              variant={order.state === ORDER_STATE.SHIPPED ? 'action' : 'ghost'}
              size="sm"
              disabled={order.state !== ORDER_STATE.SHIPPED}
              className="gap-2"
              onClick={markAllAsDelivered}
            >
              <CheckCircle className="size-4" />
              {order?.fulfillments?.filter((f) => f.state === ORDER_STATE.SHIPPED).length > 0
                ? t('fulfillments.markAllAsDelivered')
                : t('fulfillments.allDelivered')}
            </Button>
          }
        >
          <ScrollArea className="max-h-[350px]">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow noHover className="hover:bg-transparent">
                  <TableHead className="py-3 font-semibold">{t('fulfillments.method', 'Method')}</TableHead>
                  <TableHead className="py-3 font-semibold">{t('fulfillments.state', 'Status')}</TableHead>
                  <TableHead className="py-3 font-semibold">
                    {t('fulfillments.trackingCode', 'Tracking Code')}
                  </TableHead>
                  <TableHead className="py-3 text-right font-semibold">
                    {t('fulfillments.actions', 'Actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.fulfillments.map((fulfillment) => {
                  const stateBadge = getFulfillmentStateBadge(fulfillment.state);
                  const isProcessing = processingFulfillments[fulfillment.id];

                  console.log('FLF', fulfillment);

                  return (
                    <TableRow key={fulfillment.id} className="hover:bg-muted/20">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Truck className="size-4 text-green-500 dark:text-green-400" />
                          <span className="font-medium">{fulfillment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant={stateBadge.variant} className="flex w-fit items-center gap-1">
                          {stateBadge.icon}
                          {t('fulfillments.states.' + fulfillment.state.toLowerCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        {fulfillment.trackingCode ? (
                          <div className="flex items-center gap-2">
                            <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                              {fulfillment.trackingCode}
                            </code>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <ContextMenu disabled={fulfillment.state === ORDER_STATE.CANCELLED}>
                          {fulfillment.state === ORDER_STATE.SHIPPED && (
                            <DropdownMenuItem
                              key={'set'}
                              onClick={() => markAsDelivered(fulfillment.id)}
                              disabled={isProcessing}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <CheckCircle className="size-3.5 text-green-500" />
                              {t('fulfillments.markAsDelivered', 'Mark as Delivered')}
                            </DropdownMenuItem>
                          )}
                          {(fulfillment.state === ORDER_STATE.DELIVERED ||
                            fulfillment.state === ORDER_STATE.SHIPPED) && (
                            <ConfirmationDialog onConfirm={() => handleCancelFulfillment(fulfillment.id)}>
                              <DropdownMenuItem
                                disabled={isProcessing}
                                key={'cancel'}
                                className="flex cursor-pointer items-center gap-2 text-red-500"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <XCircle size={16} />
                                {t('fulfillments.cancel', 'Cancel')}
                              </DropdownMenuItem>
                            </ConfirmationDialog>
                          )}
                        </ContextMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CustomCard>
      </motion.div>
    </AnimatePresence>
  );
};
