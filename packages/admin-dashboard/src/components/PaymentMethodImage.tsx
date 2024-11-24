import { Tooltip, TooltipContent, TooltipTrigger } from '@deenruv/react-ui-devkit';
import { Banknote, CircleDollarSign, CreditCard, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import common from '@/locales/en/common.json';
import { useMemo } from 'react';

export const PaymentMethodImage: React.FC<{ paymentType: string }> = ({ paymentType }) => {
  const { t } = useTranslation('common');

  const paymentIcon = useMemo(() => {
    switch (paymentType) {
      case 'transfer':
        return <CreditCard />;

      case 'standard':
        return <Banknote />;

      case 'przelewy24':
        return <img src={`Przelewy24`} width={50} />;

      case 'onDelivery':
        return <Wallet />;

      default:
        return <CircleDollarSign />;
    }
  }, [paymentType]);

  return paymentType ? (
    <Tooltip>
      <TooltipTrigger>{paymentIcon}</TooltipTrigger>
      <TooltipContent>{t(`paymentMethods.${paymentType as keyof typeof common.paymentMethods}`)}</TooltipContent>
    </Tooltip>
  ) : (
    <></>
  );
};
