import { ReactNode } from 'react';
import { createNotificationsStore } from './state.js';

export interface Notification<T = any> {
    id: string;
    fetch: () => T | Promise<T>;
    interval: number;
    data?: T;
    placements?: {
        main?: (data: T) => React.ReactNode;
        navigation?: Array<{ id: string; component: (data: T) => React.ReactNode }>;
    };
}

export interface NotificationProps<T> {
    notifications: Notification<T>[];
}

export type NotificationProviderProps = React.PropsWithChildren<{
    notifications: Omit<Notification<any>, 'data'>[];
}>;
export type NotificationStore = ReturnType<typeof createNotificationsStore>;
export interface NotificationsState<T> extends NotificationProps<T> {
    setData: <T>(id: string, data: T) => void;
    addNotification: <T>(notification: Omit<Notification<T>, 'data'>) => void;
    getNavigationNotification: (id: string) => ReactNode[];
    getMainNotification: () => ReactNode[];
}
