import { createStore } from 'zustand';
import { Notification, NotificationProps, NotificationsState } from './types.js';

export const createNotificationsStore = <T,>(
    initProps?: Partial<{ notifications: Omit<Notification<T>, 'data'>[] }>,
) => {
    const DEFAULT_PROPS: NotificationProps<T> = {
        notifications: [],
    };
    return createStore<NotificationsState<unknown>>()((set, get) => {
        const notifications = (initProps?.notifications ||
            DEFAULT_PROPS.notifications) as Notification<unknown>[];
        return {
            notifications,
            addNotification: <T,>(notification: Omit<Notification<T>, 'data'>) => {
                const { notifications } = get();
                if (notifications.some(n => n.id === notification.id)) return;
                set(state => ({
                    notifications: [...state.notifications, notification] as Notification<unknown>[],
                }));
            },
            setData: <T,>(id: string, data: T) => {
                set(state => ({
                    notifications: state.notifications.map(notification =>
                        notification.id === id ? { ...notification, data } : notification,
                    ),
                }));
            },
            getNavigationNotification: (id: string) => {
                return get()
                    .notifications.map(notification => ({
                        ...notification,
                        placement: notification.placements?.navigation?.find(
                            placement => placement.id === id,
                        ),
                    }))
                    .filter(notification => notification.placement)
                    .map(notification => notification.placement?.component(notification.data));
            },
            getMainNotification: () => {
                return get()
                    .notifications.filter(notification => notification.placements?.main)
                    .map(notification => notification.placements?.main?.(notification.data));
            },
        };
    });
};

export function createNotification<T>(notification: Omit<Notification<T>, 'data'>): Notification<T> {
    return notification as Notification<T>;
}
