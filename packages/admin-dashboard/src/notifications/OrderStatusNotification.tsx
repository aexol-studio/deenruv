import { apiClient, cn, createNotification, ORDER_STATE, SimpleTooltip } from '@deenruv/react-ui-devkit';

export const ORDER_STATUS_NOTIFICATION = createNotification({
  id: 'order-states',
  interval: 60000,
  fetch: async () => {
    return 0;
    const additionalStates = window.__DEENRUV_SETTINGS__.ui?.extras?.orderObservableStates || [];
    try {
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
    } catch {
      return 0;
    }
  },
  placements: {
    main: () => {
      return {
        name: 'order-states',
        title: 'Pending Orders',
        description: 'You have pending orders.',
        when: (orders) => orders > 0,
        icon: (
          <SimpleTooltip content="Pending Orders">
            <div className="size-4 rounded-full bg-yellow-500"></div>
          </SimpleTooltip>
        ),
      };
    },
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
