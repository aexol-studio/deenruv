import React from 'react';
import { useTranslation } from 'react-i18next';
import { translationNS } from '../translation-ns';
import { Button, ORDER_STATE, useMutation, useOrder } from '@deenruv/react-ui-devkit';
import { SEND_INVOICE } from '../graphql/mutations.js';
import { toast } from 'sonner';
import { Printer } from 'lucide-react';

const ILLEGAL_STATES = [
    ORDER_STATE.DRAFT,
    ORDER_STATE.ADDING_ITEMS,
    ORDER_STATE.ARRANGING_PAYMENT,
    ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT,
    ORDER_STATE.MODIFYING,
    ORDER_STATE.PAYMENT_AUTHORIZED,
    ORDER_STATE.CANCELLED,
    ORDER_STATE.CREATED,
];

const URLS: Record<'receipt_fiscal_normal' | 'proforma', string> = {
    receipt_fiscal_normal: 'https://wfirma.pl/invoices/index/all',
    proforma: 'https://wfirma.pl/invoices/index/proforma',
};

export const WFirmaButtons = () => {
    const { t } = useTranslation(translationNS, {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const { order } = useOrder();
    const [mutate] = useMutation(SEND_INVOICE);

    const addProforma = async () => {
        if (!order) return;
        const { sendInvoiceToWFirma } = await mutate({
            input: { orderID: order?.id, invoiceType: 'proforma' },
        });
        if (sendInvoiceToWFirma) {
            window.open(URLS['proforma'], '_blank');
            toast.success(t('invoiceGenerated'));
        } else {
            toast.error(t('invoiceGenerationError'));
        }
    };
    const addReceipt = async () => {
        if (!order) return;
        const { sendInvoiceToWFirma } = await mutate({
            input: { orderID: order?.id, invoiceType: 'receipt_fiscal_normal' },
        });
        if (sendInvoiceToWFirma) {
            window.open(URLS['receipt_fiscal_normal'], '_blank');
            toast.success(t('invoiceGenerated'));
        } else {
            toast.error(t('invoiceGenerationError'));
        }
    };

    if (!order || ILLEGAL_STATES.includes(order.state as ORDER_STATE)) return null;
    return (
        <div className="flex gap-2">
            <Button className="flex gap-2" variant="action" onClick={addProforma}>
                <Printer size={20} /> {t('createProformaInvoice')}
            </Button>
            <Button className="flex gap-2" variant="action" onClick={addReceipt}>
                <Printer size={20} />
                {t('createReceipt')}
            </Button>
        </div>
    );
};
