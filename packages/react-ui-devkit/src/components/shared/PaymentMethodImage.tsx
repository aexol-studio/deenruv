import { Tooltip, TooltipContent, TooltipTrigger } from './../';
import { Banknote, CircleDollarSign, CreditCard, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { PaymentMethod } from '@/types';

export const PaymentMethodImage: React.FC<{ paymentType: PaymentMethod }> = ({ paymentType }) => {
    const { t } = useTranslation('common');

    const paymentIcon = useMemo(() => {
        switch (paymentType) {
            case PaymentMethod.Transfer:
                return <CreditCard />;

            case PaymentMethod.Standard:
                return <Banknote />;

            case PaymentMethod.Przelewy24:
                return <img src={`Przelewy24`} width={50} />;

            case PaymentMethod.OnDelivery:
                return <Wallet />;

            default:
                return <CircleDollarSign />;
        }
    }, [paymentType]);

    return paymentType ? (
        <Tooltip>
            <TooltipTrigger>{paymentIcon}</TooltipTrigger>
            <TooltipContent>{t(`paymentMethods.${paymentType}`)}</TooltipContent>
        </Tooltip>
    ) : (
        <></>
    );
};
