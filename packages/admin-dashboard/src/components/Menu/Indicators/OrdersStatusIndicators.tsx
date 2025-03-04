import { apiClient, cn, ORDER_STATE, SimpleTooltip, useServer } from '@deenruv/react-ui-devkit';
import { useEffect, useMemo, useState } from 'react';

const OBSERVABLE_STATUS = [ORDER_STATE.PAYMENT_AUTHORIZED];
export const OrdersStatusIndicators = () => {
  const { serverConfig } = useServer(({ serverConfig }) => ({ serverConfig }));
  const [pendingOrders, setPendingOrders] = useState(0);
  const extraStates = useMemo(() => {
    const possibleStates = serverConfig?.orderProcess.map((process) => process.name);
    const additionalStates = window.__DEENRUV_SETTINGS__.ui?.extras?.orderObservableStates || [];
    return possibleStates?.filter((state) => additionalStates.includes(state)) || [];
  }, [serverConfig]);

  const fetchStatus = async () => {
    try {
      const { orders } = await apiClient('query')({
        orders: [
          {
            options: {
              filter: {
                state: {
                  in: OBSERVABLE_STATUS.concat(extraStates as ORDER_STATE[]),
                },
              },
            },
          },
          { totalItems: true },
        ],
      });
      setPendingOrders(orders.totalItems);
    } catch {
      setPendingOrders(0);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const colorClass = useMemo(() => {
    switch (true) {
      case pendingOrders > 0:
        return 'bg-yellow-500';
      default:
        return 'bg-green-600';
    }
  }, [pendingOrders]);

  return (
    <div className="flex">
      <SimpleTooltip content={`Pending Orders: ${pendingOrders}`}>
        <div className={cn('ml-2 size-2 rounded-full', colorClass)}></div>
      </SimpleTooltip>
    </div>
  );
};
