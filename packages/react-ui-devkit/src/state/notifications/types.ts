import { createNotificationsStore } from './state.js';

export interface Notification<T> {
    id: string;
    fetch: () => T | Promise<T>;
    timeout: number;
    data?: T;
    placements?: {
        main: (data: T) => React.ReactNode;
        navigation: Array<{ id: string; component: (data: T) => React.ReactNode }>;
    };
}

export interface NotificationProps<T> {
    notifications: Notification<T>[];
}

export type NotificationProviderProps<T> = React.PropsWithChildren<NotificationProps<T>>;
export type NotificationStore = ReturnType<typeof createNotificationsStore>;
export interface NotificationsState extends NotificationProps<unknown> {
    setData: <T>(id: string, data: T) => void;
    addNotification: <T>(notification: Omit<Notification<T>, 'data'>) => void;
}
