import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@/pages/orders/_components';
import { useOrder } from '@/state/order';

import { draftOrderSelector, eligibleShippingMethodsSelector, updatedDraftOrderSelector } from '@/graphql/draft_order';
import { toast } from 'sonner';
import { HistoryEntryType } from '@deenruv/admin-types';
import { ModifyOrderPage } from './ModifyOrderPage.js';
import { EntityCustomFields } from '@/components';
import { Routes, apiClient } from '@deenruv/react-ui-devkit';

export const OrdersDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('orders');
  const { order, mode, loading, fetchOrder, orderHistory } = useOrder();
  const [copyingOrder, setCopyingOrder] = useState(false);

  useEffect(() => {
    if (id) fetchOrder(id);
    // eslint-disable-next-line
  }, [id]);

  const createOrderCopy = async () => {
    setCopyingOrder(true);
    const { createDraftOrder: newOrder } = await apiClient('mutation')({
      createDraftOrder: draftOrderSelector,
    });
    if (newOrder.id && order) {
      if (order.billingAddress) {
        await apiClient('mutation')({
          setDraftOrderBillingAddress: [
            {
              orderId: newOrder.id,
              input: {
                streetLine1: order.billingAddress?.streetLine1 || '',
                countryCode: order.billingAddress?.countryCode || 'pl',
                city: order.billingAddress.city || '',
                company: order.billingAddress.company || '',
                fullName: order.billingAddress.fullName || '',
                phoneNumber: order.billingAddress.phoneNumber || '',
                postalCode: order.billingAddress.postalCode || '',
                province: order.billingAddress.province || '',
                streetLine2: order.billingAddress.streetLine2 || '',
              },
            },
            draftOrderSelector,
          ],
        });
      }
      if (order.shippingAddress) {
        await apiClient('mutation')({
          setDraftOrderShippingAddress: [
            {
              orderId: newOrder.id,
              input: {
                streetLine1: order.shippingAddress?.streetLine1 || '',
                countryCode: order.shippingAddress?.countryCode || 'pl',
                city: order.shippingAddress.city || '',
                company: order.shippingAddress.company || '',
                fullName: order.shippingAddress.fullName || '',
                phoneNumber: order.shippingAddress.phoneNumber || '',
                postalCode: order.shippingAddress.postalCode || '',
                province: order.shippingAddress.province || '',
                streetLine2: order.shippingAddress.streetLine2 || '',
              },
            },
            draftOrderSelector,
          ],
        });
      }
      if (order.customer?.id) {
        const resp = await apiClient('mutation')({
          setCustomerForDraftOrder: [
            {
              orderId: newOrder.id,
              customerId: order.customer.id,
            },
            {
              __typename: true,
              '...on Order': draftOrderSelector,
              '...on EmailAddressConflictError': { message: true },
            },
          ],
        });
        if (resp.setCustomerForDraftOrder.__typename !== 'Order') {
          toast.error(t('createCopyCustomerFail', { value: resp.setCustomerForDraftOrder.message }));
        }
      }
      if (order.lines.length) {
        for (const i of order.lines) {
          const resp = await apiClient('mutation')({
            addItemToDraftOrder: [
              {
                orderId: newOrder.id,
                input: {
                  productVariantId: i.productVariant.id,
                  quantity: i.quantity,
                  // customFields: {
                  //   attributes: i.customFields?.attributes,
                  //   discountBy: i.customFields?.discountBy,
                  //   selectedImageId: i.customFields?.selectedImage?.id,
                  // },
                },
              },
              updatedDraftOrderSelector,
            ],
          });
          if (resp.addItemToDraftOrder.__typename !== 'Order' && 'message' in resp.addItemToDraftOrder) {
            toast.error(t('createCopyLineFail', { value: resp.addItemToDraftOrder.message }));
          }
        }
      }

      if (order.shippingLines.length) {
        const { eligibleShippingMethodsForDraftOrder } = await apiClient('query')({
          eligibleShippingMethodsForDraftOrder: [{ orderId: order.id }, eligibleShippingMethodsSelector],
        });
        if (!eligibleShippingMethodsForDraftOrder) {
          toast.error(t('toasts.orderLoadingDraftShippingError', { value: order.id }));
        }
        if (eligibleShippingMethodsForDraftOrder.find((i) => i.id === order.shippingLines[0].shippingMethod.id)) {
          const resp = await apiClient('mutation')({
            setDraftOrderShippingMethod: [
              {
                orderId: newOrder.id,
                shippingMethodId: order.shippingLines[0].shippingMethod.id,
              },
              {
                __typename: true,
                '...on Order': draftOrderSelector,
                '...on IneligibleShippingMethodError': { message: true, errorCode: true },
                '...on NoActiveOrderError': { message: true, errorCode: true },
                '...on OrderModificationError': { message: true, errorCode: true },
              },
            ],
          });
          if (resp.setDraftOrderShippingMethod.__typename !== 'Order') {
            toast.error(t('createCopyShippingFail', { value: resp.setDraftOrderShippingMethod.message }));
          }
        }
      }
      if (orderHistory.data.length) {
        for (const i of orderHistory.data) {
          if (i.type === HistoryEntryType.CUSTOMER_NOTE || i.type === HistoryEntryType.ORDER_NOTE) {
            await apiClient('mutation')({
              addNoteToOrder: [
                {
                  input: {
                    id: newOrder.id,
                    isPublic: i.isPublic,
                    note: i.data?.note as string,
                  },
                },
                { id: true },
              ],
            });
          }
        }
      }
      await apiClient('mutation')({
        addNoteToOrder: [
          {
            input: {
              id: newOrder.id,
              isPublic: false,
              note: t('createCopyNote', { value: order.id }),
            },
          },
          { id: true },
        ],
      });
      setCopyingOrder(false);
      navigate(Routes.orders.to(newOrder.id));
    }
    setCopyingOrder(false);
  };

  if (loading || copyingOrder) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <div className="customSpinner" />
      </div>
    );
  }
  if (!order || !mode) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        {t('toasts.orderLoadingError', { value: id })}
      </div>
    );
  }

  return (
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <TopActions createOrderCopy={createOrderCopy} />
        <OrderSummary />
        <RealizationCard />

        {mode === 'update' ? (
          <ModifyOrderPage />
        ) : (
          <>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <CustomerSelectCard />
              <AddressCard type="billing" />
              <AddressCard type="shipping" />
              <ShippingMethod />
            </div>
            <ProductsCard />
            {id && <EntityCustomFields entityName="order" id={id} />}
            <TaxSummary />
            <Payments />
            <OrderHistory />
          </>
        )}
      </div>
    </main>
  );
};
