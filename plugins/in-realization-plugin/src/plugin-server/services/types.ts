import { Administrator, Order, ShippingMethod } from '@deenruv/core';

export type PDFProps = {
    user: Administrator | null;
    order: Order & { shippingMethod: ShippingMethod };
    options: {
        assets?: { id: string; orderLineID: string; preview: string }[];
        plannedAt: String;
        finalPlannedAt: String;
        note: String;
        color: string;
    };
};
