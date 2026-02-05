import { modifyOrderSelector } from "@/selectors/ModifyOrderSelector.js";
import {
  orderHistoryEntrySelector,
  OrderHistoryEntryType,
} from "@/selectors/OrderHistorySelector.js";
import { paymentSelector } from "@/selectors/OrderPaymentSelector.js";
import { giveModificationInfo } from "@/utils/object-compare.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";

import {
  CustomFieldConfigType,
  HistoryEntryType,
  ModelTypes,
  ResolverInputTypes,
  SortOrder,
} from "@deenruv/admin-types";
import { toast } from "sonner";
import { create } from "zustand";
import { ServerConfigType } from "@/selectors/BaseSelectors.js";
import { OrderDetailSelector, OrderDetailType } from "@/selectors/index.js";
import { ORDER_STATE } from "@/utils/order_state.js";

export type UnknownObject = Record<string, unknown>;

export type ModifyOrderInput = Omit<
  ResolverInputTypes["ModifyOrderInput"],
  "dryRun" | "orderId"
>;
export type OrderLineActions = "quantity-price" | "attributes";
export type ChangesTypeKey =
  | "added"
  | "removed"
  | "primitive-json-change"
  | "primitive-change";
export type Mode = "view" | "create" | "update";

export interface ModifyOrderChange {
  changeName: string;
  values: {
    previous: string;
    current: string;
  };
}

export interface LineChange {
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
}

export interface RestChange {
  path: string;
  changed: ChangesTypeKey;
  removed: string | number;
  added: string | number;
  value?: Record<string, unknown>;
}

export interface ModifyOrderChanges {
  linesChanges: LineChange[];
  resChanges: RestChange[];
}

export interface ChangesRegistry {
  existingLines: LineChange[];
  newLines: LineChange[];
  surcharges: RestChange[];
  shippingAddress: RestChange[];
  billingAddress: RestChange[];
  shippingMethod: RestChange[];
  rest: RestChange[];
}

export interface DryRunOptions {
  recalculateShipping: boolean;
  freezePromotions: boolean;
}
interface Order {
  mode: Mode | undefined;
  loading: boolean;
  order: OrderDetailType | undefined;
  orderHistory: {
    loading: boolean;
    error: boolean;
    data: OrderHistoryEntryType[];
  };
  modifiedOrder: OrderDetailType | undefined;
  modifyOrderInput: ModifyOrderInput | undefined;
  currentOrder: OrderDetailType | undefined;
  changes: ModifyOrderChange[];
  newChanges: ModifyOrderChanges;
  customFieldsSelector: object | undefined;
  manualChange: { state: boolean; toAction?: string };
  currentPossibilities: { name: string; to: Array<string> } | undefined;
  orderProcess: { name: string; to: Array<string> }[] | undefined;
  orderLineCustomFields: CustomFieldConfigType[] | null;
}

interface Actions {
  fetchOrder(id: string): Promise<OrderDetailType | undefined>;
  setOrder(order: OrderDetailType | undefined): void;
  fetchOrderHistory(): Promise<OrderHistoryEntryType[] | undefined>;
  setModifyOrderInput(modifiedOrder: ModifyOrderInput | undefined): void;
  setModifiedOrder(modifiedOrder: OrderDetailType): void;
  checkModifyOrder(
    input: ResolverInputTypes["ModifyOrderInput"],
  ): Promise<OrderDetailType | undefined>;
  modifyOrder(onSuccess?: () => void): Promise<void>;
  isOrderModified: () => boolean;
  setChanges: (changes: ModifyOrderChange[]) => void;
  getObjectsChanges: (
    object1?: UnknownObject,
    object2?: UnknownObject,
  ) => ModifyOrderChanges;
  addPaymentToOrder: (input: ResolverInputTypes["ManualPaymentInput"]) => void;
  settlePayment: (input: { id: string }) => void;
  cancelPayment: (id: string) => void;
  cancelFulfillment: (id: string) => void;
  initializeOrderCustomFields(serverConfig: ServerConfigType): void;
  setManualChange(value: { state: boolean; toAction?: string }): void;
  setCurrentPossibilities(value: { name: string; to: Array<string> }): void;
  getChangesRegistry: (options?: DryRunOptions) => Promise<ChangesRegistry>;
  setBillingAddress: (
    input: ResolverInputTypes["CreateAddressInput"],
  ) => Promise<OrderDetailType>;
  setShippingAddress: (
    input: ResolverInputTypes["CreateAddressInput"],
  ) => Promise<OrderDetailType>;
  setCustomerAndAddressesForDraftOrder: (customerId: string) => Promise<void>;
  changeOrderState: (newStatus: ORDER_STATE) => Promise<{ id: string } | void>;
  cancelOrder: (
    input: Omit<ModelTypes["CancelOrderInput"], "orderId">,
    noOrderRefetch?: boolean,
  ) => Promise<{ id: string } | void>;
  refundOrder: (
    input: Omit<ModelTypes["RefundOrderInput"], "paymentId">,
  ) => Promise<{ id: string } | void>;
  cancelAndRefundOrder: (input: {
    cancelShipping: boolean;
    amount: number;
    lines: { orderLineId: string; quantity: number }[];
    reason: string;
    shipping: number;
    adjustment: number;
  }) => Promise<{ id: string } | void>;
}

const cancelPaymentMutation = (id: string) =>
  apiClient("mutation")({
    cancelPayment: [{ id }, { "...on CancelPaymentError": { message: true } }],
  });

const cancelFulfillmentMutation = (id: string) =>
  apiClient("mutation")({
    transitionFulfillmentToState: [
      { id, state: "Cancelled" },
      {
        __typename: true,
        "...on Fulfillment": {
          id: true,
        },
        "...on FulfillmentStateTransitionError": {
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
    const { order } = await apiClient("query")({
      order: [
        { id },
        {
          history: [
            {
              options: {
                skip,
                take: TAKE,
                sort: { createdAt: SortOrder.DESC },
              },
            },
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

export const useOrder = create<Order & Actions>()((set, get) => {
  const setAddress = (
    type: "billing" | "shipping",
    input: ResolverInputTypes["CreateAddressInput"],
  ) => {
    const { order } = get();
    if (!order) return;
    if (type === "billing") {
      return apiClient("mutation")({
        setDraftOrderBillingAddress: [
          { orderId: order.id, input },
          OrderDetailSelector,
        ],
      }).then((resp) => resp.setDraftOrderBillingAddress as OrderDetailType);
    }
    return apiClient("mutation")({
      setDraftOrderShippingAddress: [
        { orderId: order.id, input },
        OrderDetailSelector,
      ],
    }).then((resp) => resp.setDraftOrderShippingAddress as OrderDetailType);
  };

  return {
    mode: undefined,
    loading: true,
    order: undefined,
    modifiedOrder: undefined,
    modifyOrderInput: undefined,
    currentOrder: undefined,
    orderHistory: { loading: true, error: false, data: [] },
    changes: [],
    newChanges: { linesChanges: [], resChanges: [] },
    customFieldsSelector: undefined,
    manualChange: { state: false, toAction: undefined },
    currentPossibilities: undefined,
    orderProcess: undefined,
    orderLineCustomFields: null,
    setBillingAddress: async (input) => {
      const { setModifiedOrder, setOrder } = get();
      const order = await setAddress("billing", input);
      if (!order) throw new Error("Failed to set billing address");
      setModifiedOrder(order);
      setOrder(order);
      return order;
    },
    setShippingAddress: async (input) => {
      const { setModifiedOrder, setOrder } = get();
      const newOrder = await setAddress("shipping", input);
      if (!newOrder) throw new Error("Failed to set shipping address");
      setModifiedOrder(newOrder);
      setOrder(newOrder);
      return newOrder;
    },
    setCustomerAndAddressesForDraftOrder: async (id: string) => {
      const { order, setOrder, setBillingAddress, setShippingAddress } = get();
      if (!order) return;

      apiClient("mutation")({
        setCustomerForDraftOrder: [
          {
            orderId: order.id,
            customerId: id,
          },
          {
            __typename: true,
            "...on Order": OrderDetailSelector,
            "...on EmailAddressConflictError": {
              errorCode: true,
              message: true,
            },
          },
        ],
      }).then(({ setCustomerForDraftOrder }) => {
        if (setCustomerForDraftOrder.__typename === "Order") {
          const shippingAddress =
            setCustomerForDraftOrder.customer?.addresses?.find(
              (a) => a.defaultShippingAddress,
            ) ?? setCustomerForDraftOrder.customer?.addresses?.[0];
          const billingAddress =
            setCustomerForDraftOrder.customer?.addresses?.find(
              (a) => a.defaultBillingAddress,
            ) ?? setCustomerForDraftOrder.customer?.addresses?.[0];
          const _updatedOrder: OrderDetailType = {
            ...setCustomerForDraftOrder,
          };
          setOrder(_updatedOrder);

          if (billingAddress) {
            const { id, country, ...rest } = billingAddress;
            setBillingAddress({
              ...rest,
              countryCode: billingAddress?.country.code,
              ...("customFields" in billingAddress
                ? { customFields: billingAddress.customFields as any }
                : {}),
            });
          }

          if (shippingAddress) {
            const { id, country, ...rest } = shippingAddress;

            setShippingAddress({
              ...rest,
              countryCode: shippingAddress?.country.code,
              ...("customFields" in shippingAddress
                ? { customFields: shippingAddress.customFields as any }
                : {}),
            });
          }
        }
      });
    },
    setCurrentPossibilities: (value) => set({ currentPossibilities: value }),
    setManualChange: (manualChange) => set({ manualChange }),
    cancelPayment: async (id: string) => {
      const { fetchOrder, order } = get();
      cancelPaymentMutation(id).then(() => fetchOrder(order!.id));
    },
    cancelFulfillment: async (id: string) => {
      const { fetchOrder, order } = get();
      cancelFulfillmentMutation(id).then(() => fetchOrder(order!.id));
    },
    setOrder: (order) => {
      const { orderProcess, modifiedOrder } = get();
      let mode: Mode | undefined;
      let currentOrder: OrderDetailType | undefined;
      if (!order) {
        mode = undefined;
        currentOrder = undefined;
      } else if (order.state === ORDER_STATE.DRAFT) {
        mode = "create";
        currentOrder = order;
      } else if (order.state === ORDER_STATE.MODIFYING) {
        mode = "update";
        currentOrder = modifiedOrder ? modifiedOrder : order;
      } else {
        mode = "view";
        currentOrder = order;
      }
      if (order) {
        const currentPossibilities = orderProcess?.find(
          (el) => el.name === order?.state,
        );
        if (currentPossibilities) set({ currentPossibilities });
      }
      if (order?.state === ORDER_STATE.MODIFYING) {
        const modifiedOrder = Object.assign({}, { ...order });
        set({ modifiedOrder });
      }

      set({ mode, order, currentOrder });
    },
    initializeOrderCustomFields: (serverConfig: ServerConfigType) => {
      const { order } = get();
      if (order) {
        const currentPossibilities = serverConfig.orderProcess?.find(
          (el) => el.name === order.state,
        );
        if (currentPossibilities) set({ currentPossibilities });
      }
      const orderLineCustomFields = serverConfig.entityCustomFields?.find(
        (el) => el.entityName === "OrderLine",
      )?.customFields;
      set({ orderLineCustomFields, orderProcess: serverConfig.orderProcess });
    },
    fetchOrder: async (id: string) => {
      const {
        orderProcess,
        setCurrentPossibilities,
        setOrder,
        fetchOrderHistory,
        setModifiedOrder,
      } = get();
      set({ loading: true });
      try {
        const { order } = await apiClient("query")({
          order: [{ id }, OrderDetailSelector],
        });
        if (!order) {
          throw new Error(`Failed to load order with id ${id}`);
        }
        setOrder(order as OrderDetailType);
        set({ modifiedOrder: undefined });
        if (order)
          setModifiedOrder(Object.assign({}, { ...order }) as OrderDetailType);
        fetchOrderHistory();
        const currentPossibilities = orderProcess?.find(
          (el) => el.name === order?.state,
        );
        if (currentPossibilities) setCurrentPossibilities(currentPossibilities);
        return order as OrderDetailType;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : `Failed to load order with id ${id}`;
        toast.error(message);
      } finally {
        set({ loading: false });
      }
    },
    checkModifyOrder: async (input) => {
      try {
        const { modifyOrder } = await apiClient("mutation")({
          modifyOrder: [
            { input: { ...input, dryRun: true } },
            modifyOrderSelector,
          ],
        });
        if (modifyOrder.__typename === "Order") {
          return modifyOrder;
        }
      } catch {
        toast.error(`GlobalError: failed to check modify order`);
      }
    },
    modifyOrder: async (onSuccess) => {
      const {
        fetchOrder,
        setModifiedOrder,
        order,
        modifiedOrder,
        modifyOrderInput,
        setModifyOrderInput,
        orderHistory,
        orderLineCustomFields,
        checkModifyOrder,
        changeOrderState,
      } = get();

      delete modifiedOrder?.billingAddress?.country;
      delete modifiedOrder?.shippingAddress?.country;
      if (!order?.id) return;
      const latestOrderTransition = orderHistory?.data?.find(
        (el) => el.type === HistoryEntryType.ORDER_STATE_TRANSITION,
      );
      if (!latestOrderTransition)
        throw new Error("No state transition history entry found");
      let orderState =
        (latestOrderTransition.data.from as ORDER_STATE) ||
        modifiedOrder?.nextStates?.[0];

      const convertCustomFields = (customFields: object) => {
        if (!orderLineCustomFields) return customFields;
        const newCustomFields: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(customFields)) {
          const customField = orderLineCustomFields.find(
            (el) => el.name === key,
          );
          if (!customField || customField.readonly) continue;
          if (customField?.type === "relation") {
            if (value) {
              const modifiedKey = `${key}${customField.list ? "Ids" : "Id"}`;
              if (Array.isArray(value))
                newCustomFields[modifiedKey] = value.map(
                  (el: { id: string }) => el.id,
                );
              if (typeof value === "object")
                newCustomFields[modifiedKey] = value.id;
            }
          } else newCustomFields[key] = value;
        }
        return newCustomFields;
      };

      try {
        const input = {
          orderId: order.id,
          dryRun: false,
          adjustOrderLines: modifiedOrder?.lines
            .filter((l) => order.lines.findIndex((ol) => ol.id === l.id) >= 0)
            .map((ol) => {
              if ("customFields" in ol && ol.customFields) {
                return {
                  orderLineId: ol.id,
                  quantity: ol.quantity,
                  customFields: convertCustomFields(ol.customFields),
                };
              }
              return { orderLineId: ol.id, quantity: ol.quantity };
            }),
          surcharges: modifyOrderInput?.surcharges,
          updateBillingAddress: modifiedOrder?.billingAddress,
          updateShippingAddress: modifiedOrder?.shippingAddress,
          addItems: modifiedOrder?.lines
            .filter(
              (modifiedLine) =>
                !order.lines.some(
                  (originalLine) => originalLine.id === modifiedLine.id,
                ),
            )
            .map((l) => {
              if ("customFields" in l && l.customFields) {
                return {
                  productVariantId: l.productVariant.id,
                  quantity: l.quantity,
                  customFields: convertCustomFields(l.customFields),
                };
              }
              return {
                productVariantId: l.productVariant.id,
                quantity: l.quantity,
              };
            }),
          shippingMethodIds: modifiedOrder?.shippingLines.map(
            (el) => el.shippingMethod?.id,
          ),
          ...modifyOrderInput,
        };

        const data = await checkModifyOrder(input);
        const isPriceChanged = data?.total !== order?.total;
        if (isPriceChanged) {
          orderState = ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT;
        }
        const { modifyOrder } = await apiClient("mutation")({
          modifyOrder: [{ input }, { __typename: true }],
        });
        if (modifyOrder?.__typename === "Order") {
          changeOrderState(orderState).catch((err) => {
            throw new Error(err?.message);
          });
        }

        const result = await fetchOrder(order.id);
        if (result) setModifiedOrder(result);
        setModifyOrderInput(undefined);
        onSuccess && onSuccess();
      } catch (e) {
        toast.error(
          `GlobalError: failed to modify order: ${e instanceof Error ? e.message : e}`,
        );
      }
    },
    setModifyOrderInput: (modifyOrderInput: ModifyOrderInput | undefined) =>
      set({ modifyOrderInput }),
    setModifiedOrder: (modifiedOrder) => set({ modifiedOrder }),
    fetchOrderHistory: async () => {
      const { order } = get();
      if (!order?.id) return;
      set((state) => ({
        orderHistory: { ...state.orderHistory, loading: true },
      }));
      try {
        const { history } = await getAllOrderHistory(order.id);
        set({ orderHistory: { data: history, error: false, loading: false } });
        return history;
      } catch {
        toast.error(`Failed to load order history with id ${order.id}`);
        set({ orderHistory: { data: [], error: true, loading: false } });
        return [];
      }
    },
    isOrderModified: () => {
      const { getObjectsChanges } = get();
      const modifications = getObjectsChanges();
      return modifications.linesChanges.length > 0
        ? !!modifications.linesChanges.length ||
            !!modifications.resChanges.length
        : true;
    },
    setChanges: (changes: ModifyOrderChange[]) => set({ changes }),
    getObjectsChanges: (
      _originalOrderObject?: UnknownObject,
      _modifiedOrderObject?: UnknownObject,
    ) => {
      const { order, modifiedOrder } = get();
      const originalObj = _originalOrderObject ?? order;
      const modifiedObj = _modifiedOrderObject ?? modifiedOrder;
      const modificationInfo = giveModificationInfo(originalObj, modifiedObj, [
        "selectedImage",
        "id",
        "preview",
      ]);
      return modificationInfo;
    },
    getChangesRegistry: async (options?: DryRunOptions) => {
      const { checkModifyOrder, modifyOrderInput, modifiedOrder, order } =
        get();
      if (!order)
        return {
          existingLines: [],
          newLines: [],
          surcharges: [],
          shippingAddress: [],
          billingAddress: [],
          shippingMethod: [],
          rest: [],
        } satisfies ChangesRegistry;

      const { country: _, ...shippingAddress } =
        modifiedOrder?.shippingAddress ?? {};
      const { country: __, ...billingAddress } =
        modifiedOrder?.billingAddress ?? {};

      const dryRunOrder = await checkModifyOrder({
        orderId: order.id,
        dryRun: true,
        adjustOrderLines: modifiedOrder?.lines
          .filter((l) => order.lines.findIndex((ol) => ol.id === l.id) >= 0)
          .map((ol) => {
            if ("customFields" in ol && ol.customFields) {
              return {
                orderLineId: ol.id,
                quantity: ol.quantity,
                // customFields: convertCustomFields(ol.customFields),
              };
            }
            return { orderLineId: ol.id, quantity: ol.quantity };
          }),
        surcharges: modifyOrderInput?.surcharges,
        updateBillingAddress: billingAddress,
        updateShippingAddress: shippingAddress,
        addItems: modifiedOrder?.lines
          .filter(
            (modifiedLine) =>
              !order.lines.some(
                (originalLine) => originalLine.id === modifiedLine.id,
              ),
          )
          .map((l) => {
            if ("customFields" in l && l.customFields) {
              return {
                productVariantId: l.productVariant.id,
                quantity: l.quantity,
                // customFields: convertCustomFields(l.customFields),
              };
            }
            return {
              productVariantId: l.productVariant.id,
              quantity: l.quantity,
            };
          }),
        shippingMethodIds: modifiedOrder?.shippingLines.map(
          (el) => el.shippingMethod?.id,
        ),
        ...modifyOrderInput,
        options,
      });

      const rawChanges = giveModificationInfo(order, dryRunOrder, [
        "selectedImage",
        "id",
        "preview",
        "linePrice",
        "linePriceWithTax",
        "shippingLines.0.priceWithTax",
        "shippingLines.0.price",
        "__typename",
      ]);

      const latestShippingLinesIndex = Math.max(
        ...rawChanges.resChanges
          .map(
            (change: RestChange) =>
              change.path.match(/^shippingLines\.(\d+)\./)?.[1],
          )
          .filter(Boolean)
          .map(Number),
      );

      return {
        existingLines: rawChanges.linesChanges.filter(
          (change: LineChange) => !change.isNew,
        ),
        newLines: rawChanges.linesChanges.filter(
          (change: LineChange) => change.isNew,
        ),
        surcharges: rawChanges.resChanges.filter((change: RestChange) =>
          change.path.startsWith("surcharges"),
        ),
        billingAddress: rawChanges.resChanges.filter((change: RestChange) =>
          change.path.startsWith("billingAddress"),
        ),
        shippingAddress: rawChanges.resChanges.filter((change: RestChange) =>
          change.path.startsWith("shippingAddress"),
        ),
        shippingMethod: rawChanges.resChanges
          .filter((change: RestChange) =>
            change.path.startsWith("shippingLines"),
          )
          .filter((change: RestChange) => {
            const match = change.path.match(/^shippingLines\.(\d+)\./);
            const index = match ? Number(match[1]) : null;
            return (
              index === latestShippingLinesIndex &&
              change.path !==
                `shippingLines.${latestShippingLinesIndex}.price` &&
              change.path !==
                `shippingLines.${latestShippingLinesIndex}.priceWithTax` &&
              change.path !==
                `shippingLines.${latestShippingLinesIndex}.shippingMethod.code`
            );
          })
          .map((change: RestChange) => ({
            ...change,
            path: change.path.replace(
              /^shippingLines\.\d+\./,
              "shippingLines.",
            ),
          })),
        rest: rawChanges.resChanges.filter(
          (change: RestChange) =>
            !change.path.startsWith("shippingAddress") &&
            !change.path.startsWith("billingAddress") &&
            !change.path.startsWith("shippingLines") &&
            !change.path.startsWith("surcharges"),
        ),
      };
    },
    addPaymentToOrder: async (input) => {
      const { setOrder, fetchOrderHistory } = get();

      apiClient("mutation")({
        addManualPaymentToOrder: [
          { input },
          {
            __typename: true,
            "...on Order": OrderDetailSelector,
            "...on ManualPaymentStateError": { message: true, errorCode: true },
          },
        ],
      })
        .then((res) => {
          if (res.addManualPaymentToOrder.__typename === "Order") {
            setOrder(res.addManualPaymentToOrder);
            fetchOrderHistory();
          }
        })
        .catch((err) => {
          toast.error(`${err.response.errors[0].message}`);
        });
    },
    settlePayment: async (input) => {
      const { order, fetchOrder, fetchOrderHistory } = get();
      if (!order) return;
      const { settlePayment } = await apiClient("mutation")({
        settlePayment: [
          input,
          {
            __typename: true,
            "...on Payment": paymentSelector,
            "...on SettlePaymentError": { message: true, errorCode: true },
            "...on OrderStateTransitionError": {
              message: true,
              errorCode: true,
            },
            "...on PaymentStateTransitionError": {
              message: true,
              errorCode: true,
            },
          },
        ],
      });

      // if (settlePayment.__typename !== 'Payment') {
      //     toast.error(`${settlePayment.message}`, { position: 'top-center' });
      //     return;
      // }

      fetchOrder(order.id);
      fetchOrderHistory();
    },
    changeOrderState: async (newState: ORDER_STATE) => {
      const { order, fetchOrder, fetchOrderHistory } = get();
      if (!order) return;

      return apiClient("mutation")({
        transitionOrderToState: [
          { id: order.id, state: newState },
          {
            "...on Order": { id: true },
            "...on OrderStateTransitionError": {
              errorCode: true,
              message: true,
              fromState: true,
              toState: true,
              transitionError: true,
            },
            __typename: true,
          },
        ],
      }).then((resp) => {
        if (resp.transitionOrderToState?.__typename === "Order") {
          fetchOrder(resp.transitionOrderToState?.id);
          fetchOrderHistory();
        }
      });
    },
    cancelOrder: async (
      input: Omit<ModelTypes["CancelOrderInput"], "orderId">,
      noOrderRefetch?: boolean,
    ) => {
      const { order, fetchOrder, fetchOrderHistory } = get();
      if (!order || !order.payments?.length) return;

      return apiClient("mutation")({
        cancelOrder: [
          {
            input: {
              orderId: order.id,
              ...input,
            },
          },
          {
            __typename: true,
            "...on Order": { id: true },
            "...on EmptyOrderLineSelectionError": {
              errorCode: true,
              message: true,
            },
            "...on QuantityTooGreatError": {
              errorCode: true,
              message: true,
            },
            "...on MultipleOrderError": {
              errorCode: true,
              message: true,
            },
            "...on CancelActiveOrderError": {
              errorCode: true,
              message: true,
            },
            "...on OrderStateTransitionError": {
              errorCode: true,
              message: true,
            },
          },
        ],
      }).then((resp) => {
        if (!noOrderRefetch && resp.cancelOrder?.__typename === "Order") {
          fetchOrder(order?.id);
          fetchOrderHistory();
        }
      });
    },
    refundOrder: async (
      input: Omit<ModelTypes["RefundOrderInput"], "paymentId">,
    ) => {
      const { order, fetchOrder, fetchOrderHistory } = get();
      if (!order || !order.payments?.length) return;

      const paymentId = order.payments[order.payments?.length - 1].id;

      return apiClient("mutation")({
        refundOrder: [
          {
            input: {
              paymentId,
              ...input,
            },
          },
          {
            "...on Refund": { id: true },
            __typename: true,
          },
        ],
      }).then((resp) => {
        if (resp.refundOrder?.__typename === "Refund") {
          fetchOrder(order?.id);
          fetchOrderHistory();
        }
      });
    },
    cancelAndRefundOrder: async (input: {
      cancelShipping: boolean;
      amount: number;
      lines: { orderLineId: string; quantity: number }[];
      reason: string;
      shipping: number;
      adjustment: number;
    }) => {
      const { order, cancelOrder, refundOrder } = get();
      if (!order || !order.payments?.length) return;
      const { adjustment, amount, cancelShipping, lines, reason, shipping } =
        input;

      return cancelOrder({ cancelShipping, lines, reason }, true).then(() =>
        refundOrder({ adjustment, lines, shipping, amount, reason }),
      );
    },
  };
});
