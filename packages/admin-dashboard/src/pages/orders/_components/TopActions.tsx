import { apiCall } from '@/graphql/client';
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
} from '@deenruv/react-ui-devkit';
import { FulfillmentModal } from '@/pages/orders/_components/FulfillmentModal';
import { ManualOrderChangeModal } from '@/pages/orders/_components/ManualOrderChangeModal';
import { PossibleOrderStates } from '@/pages/orders/_components/PossibleOrderStates';
import { useServer } from '@/state';
import { DeletionResult, ResolverInputTypes } from '@deenruv/admin-types';

import { ChevronLeft, EllipsisVerticalIcon, Printer, NotepadText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOrder } from '@/state/order';
import { ORDER_STATE } from '@/graphql/base';
import { addFulfillmentToOrderResultSelector, draftOrderSelector } from '@/graphql/draft_order';
import { ModifyAcceptModal } from './index.js';

export const TopActions: React.FC<{ createOrderCopy: () => Promise<void> }> = ({ createOrderCopy }) => {
  const { fetchOrderHistory, setOrder, order } = useOrder();
  const { t } = useTranslation('orders');
  const navigate = useNavigate();
  const serverConfig = useServer((p) => p.serverConfig);

  const [manualChange, setManualChange] = useState<{ state: boolean; toAction?: string }>({ state: false });
  const currentPossibilities = useMemo(() => {
    return serverConfig?.orderProcess?.find((state) => state.name === order?.state);
  }, [serverConfig, order]);

  const isOrderValid = useMemo(() => {
    const isVariantValid = !!order?.lines.every((line) => line.productVariant);
    const isCustomerValid = !!order?.customer?.id;
    const isBillingAddressValid = !!order?.billingAddress?.streetLine1;
    const isShippingAddressValid = !!order?.shippingAddress?.streetLine1;
    const isShippingMethodValid = !!order?.shippingLines?.length;

    return (
      isVariantValid && isCustomerValid && isBillingAddressValid && isShippingAddressValid && isShippingMethodValid
    );
  }, [order]);

  const transitionOrderToModify = async () => {
    if (!order) return;
    const { transitionOrderToState } = await apiCall()('mutation')({
      transitionOrderToState: [
        { id: order.id, state: ORDER_STATE.MODIFYING },
        {
          __typename: true,
          '...on Order': draftOrderSelector,
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
      setOrder(transitionOrderToState);
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
    const { transitionOrderToState } = await apiCall()('mutation')({
      transitionOrderToState: [
        { id: order.id, state: 'ArrangingPayment' },
        {
          __typename: true,
          '...on Order': draftOrderSelector,
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
      setOrder(transitionOrderToState);
      fetchOrderHistory();
    } else {
      const errorMessage = `
        ${transitionOrderToState?.message || t('topActions.errMsg')}
        ${transitionOrderToState?.transitionError || ''}
      `;
      toast(errorMessage, { position: 'top-center' });
    }
  };

  const createProforma = async (type: 'proforma' | 'receipt') => {
    if (order) {
      // const { sendInvoiceToWFirma } = await apiCall()('mutation')({
      //   sendInvoiceToWFirma: [
      //     { input: { orderID: order.id, invoiceType: type === 'proforma' ? 'proforma' : 'receipt_fiscal_normal' } },
      //     { url: true },
      //   ],
      // });
      // if (sendInvoiceToWFirma) {
      //   window.open(
      //     type === 'proforma' ? 'https://wfirma.pl/invoices/index/proforma' : 'https://wfirma.pl/invoices/index/all',
      //     '_blank',
      //   );
      //   toast.success(t(type === 'proforma' ? 'invoice.createProformaSuccess' : 'invoice.createReceiptSuccess'));
      // } else {
      //   toast.error(t(type === 'proforma' ? 'invoice.createProformaError' : 'invoice.createReceiptError'));
      // }
    }
  };

  const fulfillOrder = async (input: ResolverInputTypes['FulfillOrderInput']) => {
    if (!order) return;
    const { addFulfillmentToOrder } = await apiCall()('mutation')({
      addFulfillmentToOrder: [{ input }, addFulfillmentToOrderResultSelector],
    });
    if (addFulfillmentToOrder.__typename === 'Fulfillment') {
      const { transitionFulfillmentToState } = await apiCall()('mutation')({
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
        const resp = await apiCall()('query')({ order: [{ id: order.id }, draftOrderSelector] });
        if (resp.order) setOrder(resp.order);
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
      const { cancelOrder } = await apiCall()('mutation')({
        cancelOrder: [
          { input: { orderId: order.id } },
          {
            __typename: true,
            '...on Order': draftOrderSelector,
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
        setOrder(cancelOrder);
        toast.info(t('topActions.orderCanceledSuccessfully'));
      } else {
        toast.error(t('topActions.orderCancelError', { value: cancelOrder.message }), { position: 'top-center' });
      }
    }
  };

  const deleteDraftOrder = async () => {
    if (!order) return;
    const { deleteDraftOrder } = await apiCall()('mutation')({
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
    const { transitionOrderToState } = await apiCall()('mutation')({
      transitionOrderToState: [
        { id: order.id, state: newState },
        {
          '...on Order': draftOrderSelector,
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
      setOrder(transitionOrderToState);
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

  if (!order) return null;

  return (
    <div className="flex items-center gap-4 ">
      {currentPossibilities && (
        <ManualOrderChangeModal
          defaultState={order.state}
          open={manualChange.state}
          setOpen={setManualChange}
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
              action: { label: t('create.leaveToastButton'), onClick: () => navigate(Routes.orders.list) },
            });
          } else navigate(Routes.orders.list);
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
        {order?.state === ORDER_STATE.DRAFT ? (
          <Button size="sm" onClick={onSubmit} disabled={!isOrderValid}>
            {t('create.completeOrderButton')}
          </Button>
        ) : order?.state === ORDER_STATE.IN_REALIZATION ? (
          <FulfillmentModal draftOrder={order} onSubmitted={fulfillOrder} />
        ) : order?.state === ORDER_STATE.ARRANGING_PAYMENT ||
          order.state === ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                toast(t('create.leaveToastMessage'), {
                  position: 'top-center',
                  action: {
                    label: t('create.leaveToastButton'),
                    onClick: () => navigate(Routes.orders.list),
                  },
                });
              }}
            >
              {t('create.realizeOrder')}
            </Button>
          </>
        ) : order?.state === ORDER_STATE.MODIFYING ? (
          <ModifyAcceptModal />
        ) : null}
        {order &&
        order.state !== ORDER_STATE.DRAFT &&
        order.state !== ORDER_STATE.ADDING_ITEMS &&
        order.state !== ORDER_STATE.ARRANGING_PAYMENT &&
        order.state !== ORDER_STATE.MODIFYING &&
        order.state !== ORDER_STATE.PAYMENT_AUTHORIZED &&
        order.state !== ORDER_STATE.CANCELLED ? (
          <>
            <Button variant="action" className="flex gap-2" onClick={() => createProforma('proforma')}>
              <Printer size={20} /> {t('invoice.createProformaButton')}
            </Button>
            <Button variant="action" className="flex gap-2" onClick={() => createProforma('receipt')}>
              <Printer size={20} /> {t('invoice.createReceiptButton')}
            </Button>
            <Button
              variant="secondary"
              className="flex gap-2"
              onClick={() => setManualChange({ state: true, toAction: 'InRealization' })}
            >
              <NotepadText size={20} /> {t('realization.createRealization')}
            </Button>
          </>
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
                className="w-full cursor-pointer justify-start px-4 py-2 focus-visible:ring-transparent dark:focus-visible:ring-transparent"
              >
                {t('topActions.manualChangeStatus')}
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              onClick={createOrderCopy}
              variant="ghost"
              className="w-full cursor-pointer justify-start px-4 py-2 text-blue-400   hover:text-blue-400   focus:text-blue-400 focus-visible:ring-transparent dark:focus-visible:text-blue-400  dark:focus-visible:ring-transparent"
            >
              {t('createCopy')}
            </Button>
          </DropdownMenuItem>
          {/* //TO DO: MODIFY ORDER COMPONENT */}
          {order.state === ORDER_STATE.PARTIALLY_DELIVERED ||
          order.state === ORDER_STATE.SHIPPED ||
          order.state === ORDER_STATE.PAYMENT_SETTLED ||
          order.state === ORDER_STATE.PAYMENT_AUTHORIZED ||
          order.state === ORDER_STATE.PARTIALLY_SHIPPED ? (
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full cursor-pointer justify-start px-4  py-2 text-blue-400 hover:text-blue-400 dark:hover:text-blue-400"
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
                      className="w-full justify-start px-4 py-2  text-red-400 hover:text-red-400 dark:hover:text-red-400"
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
