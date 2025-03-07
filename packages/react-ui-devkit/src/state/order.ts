import { modifyOrderSelector } from '@/selectors/ModifyOrderSelector.js';
import { OrderDetailSelector, OrderDetailType } from '@/selectors/OrderDetailSelector.js';
import { orderHistoryEntrySelector, OrderHistoryEntryType } from '@/selectors/OrderHistorySelector.js';
import { paymentSelector } from '@/selectors/OrderPaymentSelector.js';
import { ORDER_STATE } from '@/types/types.js';
import { giveModificationInfo } from '@/utils/object-compare.js';
import { apiClient } from '@/zeus_client/deenruvAPICall.js';

import { CustomFieldConfigType, HistoryEntryType, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { create } from 'zustand';
import { mergeSelectorWithCustomFields, deepMerge } from '@/utils/zeus-utils.js';
import { ServerConfigType } from '@/selectors/BaseSelectors.js';
import { customFieldsForQuery } from '@/zeus_client/customFieldsForQuery.js';
import { GraphQLSchema } from './server.js';

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
    order: OrderDetailType | undefined;
    orderHistory: { loading: boolean; error: boolean; data: OrderHistoryEntryType[] };
    modifiedOrder: OrderDetailType | undefined;
    modifyOrderInput: ModifyOrderInput | undefined;
    currentOrder: OrderDetailType | undefined;
    changes: ModifyOrderChange[];
    newChanges: ModifyOrderChanges;
    customFieldsSelector: object | undefined;
    manualChange: { state: boolean; toAction?: string };
    currentPossibilities: { name: string; to: Array<string> } | undefined;
    orderProcess: { name: string; to: Array<string> }[] | undefined;
    graphQLSchema: GraphQLSchema | null;
}

interface Actions {
    fetchOrder(id: string): Promise<OrderDetailType | undefined>;
    setOrder(order: OrderDetailType | undefined): void;
    fetchOrderHistory(): Promise<void>;
    setModifyOrderInput(modifiedOrder: ModifyOrderInput | undefined): void;
    setModifiedOrder(modifiedOrder: OrderDetailType): void;
    checkModifyOrder(): Promise<OrderDetailType | undefined>;
    modifyOrder(onSuccess?: () => void): Promise<void>;
    isOrderModified: () => boolean;
    setChanges: (changes: ModifyOrderChange[]) => void;
    getObjectsChanges: (object1?: UnknownObject, object2?: UnknownObject) => ModifyOrderChanges;
    addPaymentToOrder: (input: ResolverInputTypes['ManualPaymentInput']) => void;
    settlePayment: (input: { id: string }) => void;
    cancelPayment: (id: string) => void;
    cancelFulfillment: (id: string) => void;
    initializeOrderCustomFields(graphQLSchema: GraphQLSchema | null, serverConfig: ServerConfigType): void;
    setManualChange(value: { state: boolean; toAction?: string }): void;
    setCurrentPossibilities(value: { name: string; to: Array<string> }): void;
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

export const useOrder = create<Order & Actions>()((set, get) => {
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
        graphQLSchema: null,
        setCurrentPossibilities: value => set({ currentPossibilities: value }),
        setManualChange: manualChange => set({ manualChange }),
        cancelPayment: async (id: string) => {
            const { fetchOrder, order } = get();
            cancelPaymentMutation(id).then(() => fetchOrder(order!.id));
        },
        cancelFulfillment: async (id: string) => {
            const { fetchOrder, order } = get();
            cancelFulfillmentMutation(id).then(() => fetchOrder(order!.id));
        },
        setOrder: order => {
            const { orderProcess } = get();
            let mode: Mode | undefined;
            if (!order) {
                mode = undefined;
            } else if (order.state === ORDER_STATE.DRAFT) {
                mode = 'create';
            } else if (order.state === ORDER_STATE.MODIFYING) {
                mode = 'update';
            } else {
                mode = 'view';
            }
            if (order) {
                const currentPossibilities = orderProcess?.find(el => el.name === order?.state);
                if (currentPossibilities) set({ currentPossibilities });
            }
            set({ mode, order });
        },
        initializeOrderCustomFields: (graphQLSchema: GraphQLSchema, serverConfig: ServerConfigType) => {
            const { order } = get();
            if (order) {
                const currentPossibilities = serverConfig.orderProcess?.find(el => el.name === order.state);
                if (currentPossibilities) set({ currentPossibilities });
            }
            set({ graphQLSchema, orderProcess: serverConfig.orderProcess });
        },
        fetchOrder: async (id: string) => {
            const {
                orderProcess,
                setCurrentPossibilities,
                setOrder,
                fetchOrderHistory,
                setModifiedOrder,
                graphQLSchema,
            } = get();
            set({ loading: true });
            try {
                const selector = customFieldsForQuery(
                    OrderDetailSelector,
                    graphQLSchema?.get('order')?.fields || [],
                );
                const { order } = await apiClient('query')({ order: [{ id }, selector] });
                if (!order) {
                    toast.error(`Failed to load order with id ${id}`);
                    throw new Error(`Failed to load order with id ${id}`);
                }
                setOrder(order as OrderDetailType);
                set({ modifiedOrder: undefined });
                if (order) setModifiedOrder(Object.assign({}, { ...order }) as OrderDetailType);
                fetchOrderHistory();
                const currentPossibilities = orderProcess?.find(el => el.name === order?.state);
                if (currentPossibilities) setCurrentPossibilities(currentPossibilities);
                return order as OrderDetailType;
            } catch (e) {
                const message = e instanceof Error ? e.message : `Failed to load order with id ${id}`;
                toast.error(message);
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
                        modifyOrder: [
                            { input: { orderId: order.id, dryRun: true, ...restInput } },
                            modifyOrderSelector,
                        ],
                    });

                    if (modifyOrder.__typename === 'Order') {
                        return modifyOrder;
                    }
                } catch {
                    toast.error(`GlobalError: failed to check modify order`);
                }
            }
        },
        modifyOrder: async onSuccess => {
            const {
                fetchOrder,
                setModifiedOrder,
                order,
                modifiedOrder,
                modifyOrderInput,
                setModifyOrderInput,
                orderHistory,
            } = get();

            delete modifiedOrder?.billingAddress?.country;
            delete modifiedOrder?.shippingAddress?.country;
            if (!order?.id) return;
            const latestOrderTransition = orderHistory?.data?.find(
                el => el.type === HistoryEntryType.ORDER_STATE_TRANSITION,
            );
            if (!latestOrderTransition) throw new Error('No state transition history entry found');
            const orderState =
                (latestOrderTransition.data.from as ORDER_STATE) || modifiedOrder?.nextStates?.[0];
            try {
                const { modifyOrder } = await apiClient('mutation')({
                    modifyOrder: [
                        {
                            input: {
                                orderId: order.id,
                                dryRun: false,
                                adjustOrderLines: modifiedOrder?.lines
                                    .filter(l => order.lines.findIndex(ol => ol.id === l.id) >= 0)
                                    .map(ol => {
                                        if ('customFields' in ol && ol.customFields) {
                                            return {
                                                orderLineId: ol.id,
                                                quantity: ol.quantity,
                                                customFields: ol.customFields,
                                            };
                                        }
                                        return { orderLineId: ol.id, quantity: ol.quantity };
                                    }),
                                surcharges: modifyOrderInput?.surcharges,
                                updateBillingAddress: modifiedOrder?.billingAddress,
                                updateShippingAddress: modifiedOrder?.shippingAddress,
                                addItems: modifiedOrder?.lines
                                    .filter(
                                        modifiedLine =>
                                            !order.lines.some(
                                                originalLine => originalLine.id === modifiedLine.id,
                                            ),
                                    )
                                    .map(l => {
                                        if ('customFields' in l && l.customFields) {
                                            return {
                                                productVariantId: l.productVariant.id,
                                                quantity: l.quantity,
                                                customFields: l.customFields,
                                            };
                                        }
                                        return {
                                            productVariantId: l.productVariant.id,
                                            quantity: l.quantity,
                                        };
                                    }),
                                shippingMethodIds: modifiedOrder?.shippingLines.map(
                                    el => el.shippingMethod?.id,
                                ),
                                ...modifyOrderInput,
                            },
                        },
                        modifyOrderSelector,
                    ],
                });

                if (modifyOrder?.__typename === 'Order') {
                    const { transitionOrderToState } = await apiClient('mutation')({
                        transitionOrderToState: [
                            { id: order.id, state: orderState },
                            {
                                __typename: true,
                                '...on Order': OrderDetailSelector,
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
                    if (transitionOrderToState?.__typename !== 'Order')
                        throw new Error(transitionOrderToState?.message);
                }

                const result = await fetchOrder(order.id);
                if (result) setModifiedOrder(result);
                setModifyOrderInput(undefined);
                onSuccess && onSuccess();
            } catch (e) {
                toast.error(`GlobalError: failed to modify order: ${e instanceof Error ? e.message : e}`);
            }
        },
        setModifyOrderInput: (modifyOrderInput: ModifyOrderInput | undefined) => set({ modifyOrderInput }),
        setModifiedOrder: modifiedOrder => set({ modifiedOrder }),
        fetchOrderHistory: async () => {
            const { order } = get();
            if (!order?.id) return;
            set(state => ({ orderHistory: { ...state.orderHistory, loading: true } }));
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
            console.log(modifications);
            return modifications.linesChanges.length > 0
                ? !!modifications.linesChanges.length || !!modifications.resChanges.length
                : true;
        },
        setChanges: (changes: ModifyOrderChange[]) => set({ changes }),
        getObjectsChanges: (_originalOrderObject?: UnknownObject, _modifiedOrderObject?: UnknownObject) => {
            const { order, modifiedOrder } = get();
            const originalObj = _originalOrderObject ?? order;
            const modifiedObj = _modifiedOrderObject ?? modifiedOrder;
            const modificationInfo = giveModificationInfo(originalObj, modifiedObj, [
                'selectedImage',
                'id',
                'preview',
            ]);
            return modificationInfo;
        },
        addPaymentToOrder: async input => {
            const { setOrder, fetchOrderHistory } = get();
            const { addManualPaymentToOrder } = await apiClient('mutation')({
                addManualPaymentToOrder: [
                    { input },
                    {
                        __typename: true,
                        '...on Order': OrderDetailSelector,
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
        },
        settlePayment: async input => {
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
    };
});
