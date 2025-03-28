import {
  apiClient,
  cn,
  createNotification,
  Notification,
  ORDER_STATE,
  SimpleTooltip,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useEffect, useMemo, useState } from 'react';

export const ORDER_STATUS_NOTIFICATION = createNotification({
  id: 'order-states',
  interval: 60000,
  fetch: async () => {
    const additionalStates = window.__DEENRUV_SETTINGS__.ui?.extras?.orderObservableStates || [];
    const { orders } = await apiClient('query')({
      orders: [
        {
          options: {
            filter: {
              state: {
                in: [ORDER_STATE.PAYMENT_AUTHORIZED].concat(additionalStates as ORDER_STATE[]),
              },
            },
          },
        },
        { totalItems: true },
      ],
    });
    return orders.totalItems;
  },
  placements: {
    navigation: [
      {
        id: 'link-orders',
        component: (data) => (
          <div className="flex">
            <SimpleTooltip content={`Pending Orders: ${data}`}>
              <div className={cn('ml-2 size-2 rounded-full', data > 0 ? 'bg-yellow-500' : 'bg-green-600')}></div>
            </SimpleTooltip>
          </div>
        ),
      },
    ],
  },
});
