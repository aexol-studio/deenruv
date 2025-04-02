import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
    ORDER_STATE,
    useDetailView,
} from '@deenruv/react-ui-devkit';
import { NotepadText, Printer } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const illegalStates = [
    ORDER_STATE.DRAFT,
    ORDER_STATE.ADDING_ITEMS,
    ORDER_STATE.ARRANGING_PAYMENT,
    ORDER_STATE.MODIFYING,
    ORDER_STATE.PAYMENT_AUTHORIZED,
    ORDER_STATE.PAYMENT_SETTLED,
    ORDER_STATE.CANCELLED,
];

export const DedicatedButtons = () => {
    const { t } = useTranslation();
    const { entity: order } = useDetailView('orders-detail-view');

    const createProforma = async (type: 'proforma' | 'receipt') => {
        if (!order) return;
        // const { sendInvoiceToWFirma } = await apiClient('mutation')({
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
    };

    if (!order || illegalStates.includes(order.state as ORDER_STATE)) {
        return null;
    }

    return (
        <>
            <Button className="flex gap-2" onClick={() => createProforma('proforma')}>
                <Printer size={20} /> {t('invoice.createProformaButton')}
            </Button>
            <Button className="flex gap-2" onClick={() => createProforma('receipt')}>
                <Printer size={20} /> {t('invoice.createReceiptButton')}
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="flex gap-2">
                        <NotepadText size={20} /> {t('realization.createRealization')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[60vw]"></DialogContent>
            </Dialog>
        </>
    );
};
