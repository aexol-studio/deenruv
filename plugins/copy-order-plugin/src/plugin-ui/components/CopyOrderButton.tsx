import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    Button,
    DropdownMenuItem,
    ORDER_STATE,
    Routes,
    useMutation,
    useOrder,
    usePluginStore,
} from '@deenruv/react-ui-devkit';
import { COPY_ORDER } from '../graphql/mutations.js';
import { PLUGIN_NAME } from '../constants.js';

const DEFAULT_NOT_ALLOWED = [ORDER_STATE.ADDING_ITEMS, ORDER_STATE.ARRANGING_PAYMENT];
export const CopyOrderButton = () => {
    const { order } = useOrder();
    const { t } = useTranslation('copy-order-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const [mutate] = useMutation(COPY_ORDER);
    const navigate = useNavigate();
    const { configs } = usePluginStore();
    const NOT_ALLOWED = configs.get(PLUGIN_NAME)?.notAllowedStates || DEFAULT_NOT_ALLOWED;
    const copyOrder = async () => {
        if (!order) return;
        try {
            const result = await mutate({ id: order.id });
            if (result?.copyOrder.__typename === 'Order') {
                toast.success(t('copy-order-success'));
                navigate(Routes.orders.to(result.copyOrder.id));
            } else {
                toast.error(result?.copyOrder.message);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('copy-order-error');
            toast.error(errorMessage);
        }
    };
    if (!order || NOT_ALLOWED.includes(order.state as ORDER_STATE)) return null;
    return (
        <DropdownMenuItem asChild>
            <Button
                onClick={copyOrder}
                variant="ghost"
                className="w-full cursor-pointer justify-start px-4 py-2 focus-visible:ring-transparent dark:focus-visible:ring-transparent text-blue-600"
            >
                {t('copy-order')}
            </Button>
        </DropdownMenuItem>
    );
};
