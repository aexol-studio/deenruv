import { ORDER_STATE } from '@/graphql/base';

import {
  DraftOrderType,
  OrderHistoryEntryType,
  draftOrderSelector,
  modifyOrderSelector,
  orderHistoryEntrySelector,
} from '@/graphql/draft_order';
import { paymentSelector } from '@/graphql/orders';

import { giveModificationInfo } from '@/utils/objectCompare';
import { HistoryEntryType, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { apiClient } from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownObject = Record<string, any>;

export type ModifyOrderInput = Omit<ResolverInputTypes['ModifyOrderInput'], 'dryRun' | 'orderId'>;
export type OrderLineActions = 'quantity-price' | 'attributes';
export type ChangesTypeKey = 'added' | 'removed' | 'primitive-json-change' | 'primitive-change';
export type Mode = 'view' | 'create' | 'update';

export interface ModifyOrderChange {
  changeName: string;
  values: {
    previous: string;
    current: string;
  };
}
type LinePriceInputWithAdministrator = {
  linesToOverride: any;
  // linesToOverride: ModelTypes['OverrideLinesPricesInput']['linesToOverride'];
  activeAdministrator?: string;
};
export interface ModifyOrderChanges {
  linesChanges: {
    lineID: string;
    isNew?: boolean;
    variantName: string;
    changes: {
      path: string;
      changed: ChangesTypeKey;
      removed: string | number;
      added: string | number;
      value?: Record<string, unknown> | string | number;
    }[];
  }[];
  resChanges: {
    path: string;
    changed: ChangesTypeKey;
    removed: string | number;
    added: string | number;
    value?: Record<string, any>;
  }[];
}

interface Order {
  mode: Mode | undefined;
  loading: boolean;
  order: DraftOrderType | undefined;
  orderHistory: { loading: boolean; error: boolean; data: OrderHistoryEntryType[] };
  modifiedOrder: DraftOrderType | undefined;
  linePriceChangeInput: LinePriceInputWithAdministrator | undefined;
  modifyOrderInput: ModifyOrderInput | undefined;
  currentOrder: DraftOrderType | undefined;
  changes: ModifyOrderChange[];
  newChanges: ModifyOrderChanges;
}

interface Actions {
  fetchOrder(id: string): Promise<void>;
  setOrder(order: DraftOrderType | undefined): void;
  fetchOrderHistory(): Promise<void>;
  setModifyOrderInput(modifiedOrder: ModifyOrderInput | undefined): void;
  setModifiedOrder(modifiedOrder: DraftOrderType): void;
  checkModifyOrder(): Promise<DraftOrderType | undefined>;
  modifyOrder(onSuccess?: () => void): Promise<void>;
  isOrderModified: () => boolean;
  setChanges: (changes: ModifyOrderChange[]) => void;
  getObjectsChanges: (object1?: UnknownObject, object2?: UnknownObject) => ModifyOrderChanges;
  addPaymentToOrder: (input: ResolverInputTypes['ManualPaymentInput']) => void;
  settlePayment: (input: { id: string }) => void;
  // addLinePriceChangeInput: (data: {
  //   newLine: ModelTypes['OverrideLinesPricesInput']['linesToOverride'][number];
  //   activeAdministrator?: string;
  // }) => void;
  cancelPayment: (id: string) => void;
  cancelFulfillment: (id: string) => void;
  deleteLinePriceChangeInput: (lineID: string) => void;
  resetLinePriceChangeInput: () => void;
}

const cancelPaymentMutation = (id: string) =>
  apiClient('mutation')({
    cancelPayment: [{ id }, { '...on CancelPaymentError': { message: true } }],
  });

const cancelFulfillmentMutation = (id: string) =>
  apiClient('mutation')({
    transitionFulfillmentToState: [
      { id, state: 'Cancelled' },
      {
        __typename: true,
        '...on Fulfillment': {
          id: true,
        },
        '...on FulfillmentStateTransitionError': {
          errorCode: true,
          message: true,
        },
      },
    ],
  });

const TAKE = 100;
const getAllOrderHistory = async (id: string) => {
  let history: OrderHistoryEntryType[] = [];
  let totalItems = 0;
  let skip = 0;
  do {
    const { order } = await apiClient('query')({
      order: [
        { id },
        {
          history: [
            { options: { skip, take: TAKE, sort: { createdAt: SortOrder.DESC } } },
            { items: orderHistoryEntrySelector, totalItems: true },
          ],
        },
      ],
    });
    history = [...history, ...(order?.history.items || [])];
    totalItems = order?.history.totalItems || 0;
    skip += TAKE;
  } while (history.length < totalItems);
  return { history };
};

export const useOrder = create<Order & Actions>()((set, get) => ({
  mode: undefined,
  loading: true,
  order: undefined,
  modifiedOrder: undefined,
  modifyOrderInput: undefined,
  linePriceChangeInput: undefined,
  currentOrder: undefined,
  orderHistory: {
    loading: true,
    error: false,
    data: [],
  },
  changes: [],
  newChanges: {
    linesChanges: [],
    resChanges: [],
  },
  resetLinePriceChangeInput: () => {
    set({ linePriceChangeInput: undefined });
  },
  cancelPayment: async (id: string) => {
    const { fetchOrder, order } = get();
    cancelPaymentMutation(id).then(() => fetchOrder(order!.id));
  },
  cancelFulfillment: async (id: string) => {
    const { fetchOrder, order } = get();
    cancelFulfillmentMutation(id).then(() => fetchOrder(order!.id));
  },
  // addLinePriceChangeInput: ({ newLine, activeAdministrator }) => {
  //   set((state) => ({
  //     linePriceChangeInput: {
  //       activeAdministrator,
  //       linesToOverride: [
  //         ...(state.linePriceChangeInput?.linesToOverride.filter((line) => line.lineID !== newLine.lineID) || []),
  //         newLine,
  //       ],
  //     },
  //   }));
  // },
  deleteLinePriceChangeInput: (lineID) => {
    // set((state) => ({
    //   linePriceChangeInput: {
    //     ...state.linePriceChangeInput,
    //     // linesToOverride: (state.linePriceChangeInput?.linesToOverride ?? []).filter((l) => l.lineID !== lineID),
    //   },
    // }));
  },
  setOrder: (order) => {
    const mode = !order
      ? undefined
      : order?.state === ORDER_STATE.DRAFT
        ? ('create' as const)
        : order?.state === ORDER_STATE.MODIFYING
          ? ('update' as const)
          : ('view' as const);
    set({ mode, order });
  },
  fetchOrder: async (id: string) => {
    const { setOrder, fetchOrderHistory, setModifiedOrder } = get();
    set({ loading: true });
    try {
      const { order } = await apiClient('query')({ order: [{ id }, draftOrderSelector] });
      if (!order) toast.error(`Failed to load order with id ${id}`);
      setOrder(order);
      set({ modifiedOrder: undefined });
      if (order) setModifiedOrder(Object.assign({}, { ...order }));
      fetchOrderHistory();
    } catch {
      toast.error(``);
    } finally {
      set({ loading: false });
    }
  },
  checkModifyOrder: async () => {
    const { order, modifiedOrder } = get();
    const { surcharges, ...restInput } = modifiedOrder ?? {};
    if (order?.id) {
      try {
        const { modifyOrder } = await apiClient('mutation')({
          modifyOrder: [{ input: { orderId: order.id, dryRun: true, ...restInput } }, modifyOrderSelector],
        });

        if (modifyOrder.__typename === 'Order') {
          return modifyOrder;
        }
      } catch {
        toast.error(`GlobalError: failed to check modify order`);
      }
    }
  },
  modifyOrder: async (onSuccess) => {
    const {
      setOrder,
      setModifiedOrder,
      order,
      modifiedOrder,
      modifyOrderInput,
      setModifyOrderInput,
      // linePriceChangeInput,
      resetLinePriceChangeInput,
      orderHistory,
    } = get();

    delete modifiedOrder?.billingAddress?.country;
    delete modifiedOrder?.shippingAddress?.country;

    if (!order?.id) return;
    const latestOrderTransition = orderHistory?.data?.find((el) => el.type === HistoryEntryType.ORDER_STATE_TRANSITION);

    if (!latestOrderTransition) throw new Error('No state transition history entry found');

    // const orderState = (latestOrderTransition.data.from as ORDER_STATE) || modifiedOrder?.nextStates?.[0];
    try {
      // const modifyOrderTotalPrice = linePriceChangeInput?.linessToOverride.reduce((acc, el) => {
      //   const line = modifiedOrder?.lines.find((l) => l.id === el.lineID);

      //   if (!line) return acc;
      //   acc += line.quantity * (el.netto ? el.value * (1 + line.taxRate) : el.value);
      //   return acc;
      // }, 0);
      // const orderTotalPrice = order?.subTotalWithTax;

      const { modifyOrder } = await apiClient('mutation')({
        modifyOrder: [
          {
            input: {
              orderId: order.id,
              dryRun: false,
              adjustOrderLines: modifiedOrder?.lines
                .filter((l) => order.lines.findIndex((ol) => ol.id === l.id) >= 0)
                .map((ol) => ({
                  orderLineId: ol.id,
                  quantity: ol.quantity,
                  // customFields: {
                  //   attributes: ol.customFields?.attributes,
                  //   discountBy: ol.customFields?.discountBy,
                  // },
                })),
              surcharges: modifyOrderInput?.surcharges,
              updateBillingAddress: modifiedOrder?.billingAddress,
              updateShippingAddress: modifiedOrder?.shippingAddress,
              addItems: modifiedOrder?.lines
                .filter((modifiedLine) => !order.lines.some((orginalLine) => orginalLine.id === modifiedLine.id))
                .map((l) => ({
                  productVariantId: l.productVariant.id,
                  quantity: l.quantity,
                  // customFields: {
                  //   attributes: l.customFields?.attributes,
                  //   discountBy: l.customFields?.discountBy,
                  // },
                })),
              shippingMethodIds: modifiedOrder?.shippingLines.map((el) => el.shippingMethod?.id),
              ...modifyOrderInput,
            },
          },
          modifyOrderSelector,
        ],
      });

      if (modifyOrder.__typename !== 'Order') throw new Error(modifyOrder.message);
      // WE ARE NOT FOR SURE IF IT IS WORKING 100% CORRECTLY, THERE COULD BE SOME BUGS dont judge
      // const surcharges = modifyOrder.lines.reduce(
      //   (acc, line) => {
      //     const activeAdministrator = linePriceChangeInput?.activeAdministrator;
      //     const orginalLine = order?.lines.find((l) => l.id === line.id);
      //     const linePriceInput = linePriceChangeInput?.linesToOverride.find(
      //       (lineInput) => lineInput.lineID === line.id,
      //     );

      //     const addedSurchargesValue = modifyOrder?.surcharges
      //       ?.filter((s) => s.sku === line.id)
      //       .reduce((acc, s) => acc + s.priceWithTax, 0);
      //     const quantityDelta =
      //       line.quantity - (orginalLine?.quantity || 0) > 0 ? line.quantity - (orginalLine?.quantity || 0) : 0;

      //     if (linePriceInput && orginalLine) {
      //       const priceDelta =
      //         line.quantity *
      //           (linePriceInput?.netto ? linePriceInput.value * (1 + line.taxRate) : linePriceInput.value) -
      //         (line.customFields?.modifiedListPrice
      //           ? line.customFields?.modifiedListPrice * orginalLine.quantity
      //           : line.linePriceWithTax) -
      //         quantityDelta * orginalLine.productVariant.priceWithTax;

      //       if (priceDelta > 0) {
      //         acc.push({
      //           price: priceDelta,
      //           sku: line.id,
      //           // for now we assume that price includes tax
      //           priceIncludesTax: true,
      //           description: `[ MODYFIKACJA CENY ]
      //           SKU: ${line.productVariant.sku}
      //           Data: ${new Date().toISOString()}
      //           Zmiana ceny: ${(priceDelta / 100).toFixed(2)}
      //           Zmieniono przez: ${activeAdministrator}`,
      //         });
      //       }
      //     } else if (orginalLine && orginalLine.quantity !== line.quantity) {
      //       const priceDelta =
      //         (line.customFields?.modifiedListPrice
      //           ? line.customFields?.modifiedListPrice * line.quantity
      //           : orginalLine.linePriceWithTax) -
      //         addedSurchargesValue -
      //         line.quantity * orginalLine.productVariant.priceWithTax;

      //       if (priceDelta > 0) {
      //         acc.push({
      //           price: priceDelta,
      //           sku: line.id,
      //           // for now we assume that price includes tax
      //           priceIncludesTax: true,
      //           description: `[ MODYFIKACJA CENY ]
      //         SKU: ${line.productVariant.sku}
      //         Data: ${new Date().toISOString()}
      //         Zmiana ceny: ${(priceDelta / 100).toFixed(2)}
      //         Zmieniono przez: ${activeAdministrator}`,
      //         });
      //       }
      //     }
      //     return acc;
      //   },
      //   [] as ModelTypes['SurchargeInput'][],
      // );

      // if (surcharges?.length) {
      //   await apiClient('mutation')({
      //     modifyOrder: [{ input: { dryRun: false, orderId: order.id, surcharges } }, { __typename: true }],
      //   });
      // }

      // if (linePriceChangeInput?.linesToOverride.length) {
      //   const { overrideLinesPrices } = await apiClient('mutation')({
      //     overrideLinesPrices: [
      //       {
      //         input: {
      //           orderID: order.id,
      //           linesToOverride: linePriceChangeInput.linesToOverride,
      //         },
      //       },
      //       true,
      //     ],
      //   });
      //   if (!overrideLinesPrices) throw new Error('Failed to override lines prices');
      // }
      // const linePriceModification = await apiClient('mutation')({
      //   setPricesAfterModification: [{ orderID: order.id }, true],
      // });
      // if (!linePriceModification.setPricesAfterModification) throw new Error('Failed to set prices after modification');

      // if (orderTotalPrice !== modifyOrderTotalPrice) {
      //   const { transitionOrderToState } = await apiClient('mutation')({
      //     transitionOrderToState: [
      //       { id: order.id, state: ORDER_STATE.PAYMENT_SETTLED },
      //       {
      //         __typename: true,
      //         '...on Order': draftOrderSelector,
      //         '...on OrderStateTransitionError': {
      //           errorCode: true,
      //           message: true,
      //           fromState: true,
      //           toState: true,
      //           transitionError: true,
      //         },
      //       },
      //     ],
      //   });
      //   if (transitionOrderToState?.__typename !== 'Order') {
      //     const { transitionOrderToState } = await apiClient('mutation')({
      //       transitionOrderToState: [
      //         { id: order.id, state: ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT },
      //         {
      //           __typename: true,
      //           '...on Order': draftOrderSelector,
      //           '...on OrderStateTransitionError': {
      //             errorCode: true,
      //             message: true,
      //             fromState: true,
      //             toState: true,
      //             transitionError: true,
      //           },
      //         },
      //       ],
      //     });

      //     if (transitionOrderToState?.__typename !== 'Order') {
      //       const { transitionOrderToState } = await apiClient('mutation')({
      //         transitionOrderToState: [
      //           { id: order.id, state: ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT },
      //           {
      //             __typename: true,
      //             '...on Order': draftOrderSelector,
      //             '...on OrderStateTransitionError': {
      //               errorCode: true,
      //               message: true,
      //               fromState: true,
      //               toState: true,
      //               transitionError: true,
      //             },
      //           },
      //         ],
      //       });

      //       if (transitionOrderToState?.__typename !== 'Order') {
      //         const { transitionOrderToState } = await apiClient('mutation')({
      //           transitionOrderToState: [
      //             { id: order.id, state: orderState },
      //             {
      //               __typename: true,
      //               '...on Order': draftOrderSelector,
      //               '...on OrderStateTransitionError': {
      //                 errorCode: true,
      //                 message: true,
      //                 fromState: true,
      //                 toState: true,
      //                 transitionError: true,
      //               },
      //             },
      //           ],
      //         });
      //         if (transitionOrderToState?.__typename !== 'Order') throw new Error(transitionOrderToState?.message);
      //       }
      //     }
      //   }
      // }

      const { order: modfiedOrderWithOverwrittenPrices } = await apiClient('query')({
        order: [{ id: order.id }, draftOrderSelector],
      });

      if (!modfiedOrderWithOverwrittenPrices) throw new Error('Failed to fetch order after price override');

      const finalOrder = { ...modfiedOrderWithOverwrittenPrices };

      setOrder(finalOrder);
      setModifiedOrder(finalOrder);
      setModifyOrderInput(undefined);
      resetLinePriceChangeInput();
      onSuccess && onSuccess();
    } catch (e) {
      toast.error(`GlobalError: failed to modify order: ${e instanceof Error ? e.message : e}`);
    }
  },
  setModifyOrderInput: (modifyOrderInput: ModifyOrderInput | undefined) => set({ modifyOrderInput }),
  setModifiedOrder: (modifiedOrder) => set({ modifiedOrder }),
  fetchOrderHistory: async () => {
    const { order } = get();
    if (!order?.id) return;
    set((state) => ({ orderHistory: { ...state.orderHistory, loading: true } }));
    try {
      const { history } = await getAllOrderHistory(order.id);
      set({ orderHistory: { data: history, error: false, loading: false } });
    } catch {
      toast.error(`Failed to load order history with id ${order.id}`);
      set({ orderHistory: { data: [], error: true, loading: false } });
    }
  },
  isOrderModified: () => {
    const { getObjectsChanges } = get();
    const modifications = getObjectsChanges();
    return !!modifications.linesChanges.length || !!modifications.resChanges.length;
  },
  setChanges: (changes: ModifyOrderChange[]) => {
    set({
      changes,
    });
  },

  getObjectsChanges: (_orginalOrderObject?: UnknownObject, _modifiedOrderObject?: UnknownObject) => {
    const { order, modifiedOrder } = get();

    const originalObj = _orginalOrderObject ?? order;
    const modifiedObj = _modifiedOrderObject ?? modifiedOrder;
    const modificationInfo = giveModificationInfo(originalObj, modifiedObj, ['selectedImage', 'id', 'preview']);
    return modificationInfo;
  },

  addPaymentToOrder: async (input) => {
    const { setOrder, fetchOrderHistory } = get();
    const { addManualPaymentToOrder } = await apiClient('mutation')({
      addManualPaymentToOrder: [
        { input },
        {
          __typename: true,
          '...on Order': draftOrderSelector,
          '...on ManualPaymentStateError': { message: true, errorCode: true },
        },
      ],
    });
    if (addManualPaymentToOrder.__typename !== 'Order') {
      toast.error(`${addManualPaymentToOrder.message}`, { position: 'top-center' });
      return;
    }
    setOrder(addManualPaymentToOrder);
    fetchOrderHistory();
    // if (order) fetchOrder(order.id);
  },
  settlePayment: async (input) => {
    const { order, fetchOrder, fetchOrderHistory } = get();
    if (!order) return;
    const { settlePayment } = await apiClient('mutation')({
      settlePayment: [
        input,
        {
          __typename: true,
          '...on Payment': paymentSelector,
          '...on SettlePaymentError': { message: true, errorCode: true },
          '...on OrderStateTransitionError': { message: true, errorCode: true },
          '...on PaymentStateTransitionError': { message: true, errorCode: true },
        },
      ],
    });

    if (settlePayment.__typename !== 'Payment') {
      toast.error(`${settlePayment.message}`, { position: 'top-center' });
      return;
    }

    fetchOrder(order.id);
    fetchOrderHistory();
  },
}));

// tax jest included czyli zmienić działanie
// dodać info o zmianie ceny