import { Badge } from '@/components';
import { ORDER_STATE } from '@/graphql/base';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const OrderStateBadge: React.FC<{ fullWidth?: boolean; state?: string; className?: string }> = ({
  fullWidth,
  state = 'default',
  className,
}) => {
  const { t } = useTranslation('common');
  const labelAndStyles = useMemo<{ className: string; label: string }>(() => {
    switch (state) {
      case ORDER_STATE.DRAFT:
        return { className: 'border-red-500 bg-red-100 text-red-500', label: t('draft') };
      case ORDER_STATE.ADDING_ITEMS:
        return { className: 'border-blue-600 bg-blue-100 text-blue-600', label: t('addingItems') };
      case ORDER_STATE.ARRANGING_PAYMENT:
      case ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT:
        return { className: 'border-blue-600 bg-blue-600 text-blue-100', label: t('arrangingPayment') };
      case ORDER_STATE.PAYMENT_AUTHORIZED:
        return { className: 'border-amber-600 bg-amber-50 text-amber-600', label: t('paymentAuthorized') };
      case ORDER_STATE.PAYMENT_SETTLED:
        return { className: 'border-amber-700 bg-amber-700 text-amber-50', label: t('paymentSettled') };
      case ORDER_STATE.PARTIALLY_SHIPPED:
        return { className: 'border-violet-700 bg-violet-100 text-violet-700', label: t('partiallyShipped') };
      case ORDER_STATE.SHIPPED:
        return { className: 'border-violet-700 bg-violet-700 text-violet-100', label: t('shipped') };
      case ORDER_STATE.IN_REALIZATION:
        return { className: 'border-primary bg-primary-foreground text-primary', label: t('inRealization') };
      case ORDER_STATE.PARTIALLY_DELIVERED:
        return { className: 'border-green-800 bg-green-100 text-green-800', label: t('partiallyDelivered') };
      case ORDER_STATE.DELIVERED:
        return { className: 'border-green-800 bg-green-800 text-green-100', label: t('delivered') };
      case ORDER_STATE.CANCELLED:
        return { className: 'border-red-700 bg-red-700 text-red-100', label: t('cancelled') };
      case ORDER_STATE.MODIFYING:
        return { className: 'border-orange-500 bg-orange-500 text-orange-100', label: t('modifying') };
      default:
        return { className: 'border-primary bg-primary-foreground text-primary', label: state };
    }
  }, [t, state]);

  return (
    <Badge
      noHover
      className={cn(
        'text-nowrap text-center',
        fullWidth && 'flex w-full items-center justify-center',
        labelAndStyles.className,
        className,
      )}
    >
      {labelAndStyles.label}
    </Badge>
  );
};
