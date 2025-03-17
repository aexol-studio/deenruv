import {
  AlertDialogHeader,
  AlertDialogFooter,
  Button,
  DropdownMenu,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Routes,
  OrderStateBadge,
  apiClient,
  usePluginStore,
  useOrder,
  useServer,
} from '@deenruv/react-ui-devkit';
import { FulfillmentModal } from '@/pages/orders/_components/FulfillmentModal';
import { ManualOrderChangeModal } from '@/pages/orders/_components/ManualOrderChangeModal';
import { PossibleOrderStates } from '@/pages/orders/_components/PossibleOrderStates';
import { DeletionResult, HistoryEntryType, ResolverInputTypes } from '@deenruv/admin-types';

import { ChevronLeft, EllipsisVerticalIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ORDER_STATE } from '@/graphql/base';
import { addFulfillmentToOrderResultSelector } from '@/graphql/draft_order';
import { ModifyAcceptModal } from './index.js';
import React from 'react';

const COMPLETE_ORDER_STATES = [ORDER_STATE.DELIVERED];
export const TopActions: React.FC = () => {
  const { currentPossibilities, manualChange, setManualChange, fetchOrderHistory, fetchOrder, order } = useOrder();
  const orderProcess = useServer((p) => p.serverConfig?.orderProcess || []);
  const { t } = useTranslation('orders');
  const navigate = useNavigate();
  const { getDetailViewActions } = usePluginStore();
  const actions = useMemo(() => getDetailViewActions('orders-detail-view'), []);

  const isOrderValid = useMemo(() => {
    const isVariantValid = !!order?.lines.every((line) => line.productVariant);
    const isCustomerValid = !!order?.customer?.id;
    const isBillingAddressValid = !!order?.billingAddress?.streetLine1;
    const isShippingAddressValid = !!order?.shippingAddress?.streetLine1;
    const isShippingMethodValid = !!order?.shippingLines?.length;

    if (order?.state === ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT) {
      const settledPaymentsAmount =
        order.payments
          ?.filter((payment) => payment.state === ORDER_STATE.PAYMENT_SETTLED)
          .reduce((acc, payment) => acc + payment.amount, 0) || 0;
      return settledPaymentsAmount < order.totalWithTax;
    }

    return (
      isVariantValid && isCustomerValid && isBillingAddressValid && isShippingAddressValid && isShippingMethodValid
    );
  }, [order]);

  const transitionOrderToModify = async () => {
    if (!order) return;
    const { transitionOrderToState } = await apiClient('mutation')({
      transitionOrderToState: [
        { id: order.id, state: ORDER_STATE.MODIFYING },
        {
          __typename: true,
          '...on Order': { id: true },
          '...on OrderStateTransitionError': {
            errorCode: true,
            message: true,
            fromState: true,
            toState: true,
            transitionError: true,
          },
        },
      ],
    });
    if (transitionOrderToState?.__typename === 'Order') {
      fetchOrder(transitionOrderToState.id);
      fetchOrderHistory();
    } else {
      toast.error(`${transitionOrderToState?.message}`, { position: 'top-center' });
    }
  };

  const onSubmit = async () => {
    if (!isOrderValid || !order) {
      toast.error(t('topActions.fillAll'), { position: 'top-center', closeButton: true });
      return;
    }
    const history = await fetchOrderHistory();
    let state = ORDER_STATE.ARRANGING_PAYMENT;
    if (history && order.state === ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT) {
      const previousState = history
        .filter((h) => h.type === HistoryEntryType.ORDER_STATE_TRANSITION)
        .find((h) => h.data.to === ORDER_STATE.MODIFYING);
      if (previousState) {
        state = previousState.data.from;
      }
    }
    const { transitionOrderToState } = await apiClient('mutation')({
      transitionOrderToState: [
        { id: order.id, state },
        {
          __typename: true,
          '...on Order': { id: true },
          '...on OrderStateTransitionError': {
            errorCode: true,
            message: true,
            fromState: true,
            toState: true,
            transitionError: true,
          },
        },
      ],
    });

    if (transitionOrderToState?.__typename === 'Order') {
      fetchOrder(transitionOrderToState.id);
      fetchOrderHistory();
    } else {
      const errorMessage = `
        ${transitionOrderToState?.message || t('topActions.errMsg')}
        ${transitionOrderToState?.transitionError || ''}
      `;
      toast(errorMessage, { position: 'top-center' });
    }
  };

  const fulfillOrder = async (input: ResolverInputTypes['FulfillOrderInput']) => {
    if (!order) return;
    const { addFulfillmentToOrder } = await apiClient('mutation')({
      addFulfillmentToOrder: [{ input }, addFulfillmentToOrderResultSelector],
    });
    if (addFulfillmentToOrder.__typename === 'Fulfillment') {
      const { transitionFulfillmentToState } = await apiClient('mutation')({
        transitionFulfillmentToState: [
          { id: addFulfillmentToOrder.id, state: ORDER_STATE.SHIPPED },
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
        fetchOrder(order.id);
        fetchOrderHistory();
        toast.success(t('topActions.fulfillmentAdded'), { position: 'top-center' });
        return;
      } else {
        toast.error(`${transitionFulfillmentToState.message}`, { position: 'top-center' });
      }
    } else {
      toast.error(`${addFulfillmentToOrder.message}`, { position: 'top-center' });
    }
  };

  const cancelOrder = async () => {
    if (order) {
      const { cancelOrder } = await apiClient('mutation')({
        cancelOrder: [
          { input: { orderId: order.id } },
          {
            __typename: true,
            '...on Order': { id: true },
            '...on EmptyOrderLineSelectionError': {
              errorCode: true,
              message: true,
            },
            '...on QuantityTooGreatError': {
              errorCode: true,
              message: true,
            },
            '...on MultipleOrderError': {
              errorCode: true,
              message: true,
            },
            '...on CancelActiveOrderError': {
              errorCode: true,
              message: true,
            },
            '...on OrderStateTransitionError': {
              errorCode: true,
              message: true,
            },
          },
        ],
      });
      if (cancelOrder.__typename === 'Order') {
        fetchOrder(cancelOrder.id);
        toast.info(t('topActions.orderCanceledSuccessfully'));
      } else {
        toast.error(t('topActions.orderCancelError', { value: cancelOrder.message }), { position: 'top-center' });
      }
    }
  };

  const deleteDraftOrder = async () => {
    if (!order) return;
    const { deleteDraftOrder } = await apiClient('mutation')({
      deleteDraftOrder: [{ orderId: order.id }, { message: true, result: true }],
    });
    if (deleteDraftOrder.result === DeletionResult.DELETED) {
      toast.info(t('topActions.draftDeletedSuccessfully'));
      navigate(-1);
    } else {
      toast.error(t('topActions.draftDeleteError', { value: deleteDraftOrder.message }), { position: 'top-center' });
    }
  };
  const changeOrderStatus = async (newState: string) => {
    if (!order || !newState) return;
    const { transitionOrderToState } = await apiClient('mutation')({
      transitionOrderToState: [
        { id: order.id, state: newState },
        {
          '...on Order': { id: true },
          '...on OrderStateTransitionError': {
            errorCode: true,
            message: true,
            fromState: true,
            toState: true,
            transitionError: true,
          },
          __typename: true,
        },
      ],
    });
    if (transitionOrderToState?.__typename === 'Order') {
      fetchOrder(transitionOrderToState.id);
      fetchOrderHistory();
    } else {
      toast.error(
        transitionOrderToState?.message
          ? t('changeStatus.changeStatusFailedMsg', { value: transitionOrderToState.message })
          : t('changeStatus.changeStatusFailed'),
        {
          position: 'top-center',
        },
      );
    }
    setManualChange({ state: false });
  };

  const canCompleteOrder = useMemo(() => {
    return !!(
      order?.fulfillments?.some((f) => f.state === ORDER_STATE.SHIPPED) ||
      !currentPossibilities?.to.some((state) => COMPLETE_ORDER_STATES.includes(state as ORDER_STATE))
    );
  }, [order, currentPossibilities]);

  const needFulfillment = useMemo(() => {
    const statesNotFromDeenruv = orderProcess.filter(
      (state) => !Object.values(ORDER_STATE).includes(state.name as ORDER_STATE),
    );
    const states = [ORDER_STATE.PARTIALLY_DELIVERED, ORDER_STATE.SHIPPED, ORDER_STATE.PAYMENT_SETTLED];
    const doExternalStatesNeedFulfillment = statesNotFromDeenruv.filter((state) =>
      state.to.some((s) => states.includes(s as ORDER_STATE)),
    );
    states.push(...doExternalStatesNeedFulfillment.map((state) => state.name as ORDER_STATE));
    return states.includes(order?.state as ORDER_STATE);
  }, [order, currentPossibilities]);
  const inModifyState = useMemo(() => order?.state === ORDER_STATE.MODIFYING, [order]);
  const exitingModifyStates = useMemo(
    () => [ORDER_STATE.DRAFT, ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT].includes(order?.state as ORDER_STATE),
    [order],
  );

  if (!order) return null;
  return (
    <div className="flex items-center gap-4 ">
      {currentPossibilities && (
        <ManualOrderChangeModal
          open={manualChange.state}
          setOpen={setManualChange}
          wantedState={manualChange.toAction}
          order={order}
          currentPossibilities={currentPossibilities}
          onConfirm={changeOrderStatus}
        />
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => {
          if (order?.state === ORDER_STATE.DRAFT) {
            toast.error(t('create.leaveToastMessage'), {
              position: 'top-center',
              action: {
                label: t('create.leaveToastButton'),
                onClick: () => navigate(Routes.orders.list, { viewTransition: true }),
              },
            });
          } else navigate(Routes.orders.list, { viewTransition: true });
        }}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{t('create.back')}</span>
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {t('create.orderId', { value: order?.id })}
      </h1>
      <OrderStateBadge state={order?.state} />
      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        {actions?.inline?.map(({ component }) => React.createElement(component)) || null}
        {exitingModifyStates ? (
          <Button size="sm" onClick={onSubmit} disabled={!isOrderValid}>
            {order.state === ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT
              ? t('create.addPaymentButton')
              : t('create.completeOrderButton')}
          </Button>
        ) : needFulfillment ? (
          <FulfillmentModal order={order} onSubmitted={fulfillOrder} disabled={canCompleteOrder} />
        ) : inModifyState ? (
          <ModifyAcceptModal />
        ) : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <EllipsisVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <PossibleOrderStates orderState={order.state} />
          </DropdownMenuItem>
          {order.state !== ORDER_STATE.CANCELLED && currentPossibilities?.to.length && (
            <DropdownMenuItem asChild>
              <Button
                onClick={() => setManualChange({ state: true, toAction: undefined })}
                variant="ghost"
                className="w-full cursor-pointer justify-start px-4 py-2 text-orange-400 hover:text-orange-400 focus-visible:ring-transparent dark:text-orange-400 dark:hover:text-orange-400 dark:focus-visible:ring-transparent"
              >
                {t('topActions.manualChangeStatus')}
              </Button>
            </DropdownMenuItem>
          )}
          {actions?.dropdown?.map(({ component }) => React.createElement(component)) || null}
          {order.state === ORDER_STATE.PARTIALLY_DELIVERED ||
          order.state === ORDER_STATE.SHIPPED ||
          order.state === ORDER_STATE.PAYMENT_SETTLED ||
          order.state === ORDER_STATE.PAYMENT_AUTHORIZED ||
          order.state === ORDER_STATE.PARTIALLY_SHIPPED ? (
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full cursor-pointer justify-start px-4 py-2 text-blue-400 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-400"
                onClick={transitionOrderToModify}
              >
                {t('create.modifyOrder')}
              </Button>
            </DropdownMenuItem>
          ) : null}
          {((order.state !== ORDER_STATE.CANCELLED && order.state !== ORDER_STATE.DRAFT) ||
            order.state === ORDER_STATE.DRAFT) && <DropdownMenuSeparator />}
          {order.state !== ORDER_STATE.CANCELLED && order.state !== ORDER_STATE.DRAFT && (
            <>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-red-400 hover:text-red-400 dark:text-red-400 dark:hover:text-red-400"
                    >
                      {t('create.cancelOrder')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('create.areYouSure')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('create.cancelOrderMessage')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('create.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => cancelOrder()}>{t('create.continue')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </>
          )}
          {order.state === ORDER_STATE.DRAFT && (
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2  text-red-400 hover:text-red-400 dark:hover:text-red-400"
                  >
                    {t('deleteDraft.button')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteDraft.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('deleteDraft.descriptionDraft')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('deleteDraft.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteDraftOrder()}>{t('deleteDraft.confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
