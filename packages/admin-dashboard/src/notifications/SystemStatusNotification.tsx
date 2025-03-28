import { cn, createNotification, getSystemStatus, SimpleTooltip } from '@deenruv/react-ui-devkit';

export const SYSTEM_STATUS_NOTIFICATION = createNotification({
  id: 'system-status',
  interval: 30000,
  fetch: () => getSystemStatus(),
  placements: {
    navigation: [
      {
        id: 'link-system-status',
        component: (data) => {
          if (!data) return null;
          return (
            <div className="flex">
              <SimpleTooltip content={`Status: ${data.status}`}>
                <div className={cn('ml-2 size-2 rounded-full', data.status === 'ok' ? 'bg-green-600' : 'bg-red-500')} />
              </SimpleTooltip>
            </div>
          );
        },
      },
    ],
  },
});
