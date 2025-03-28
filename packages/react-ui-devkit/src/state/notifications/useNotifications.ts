import { useContext } from 'react';
import { useStore } from 'zustand';
import { NotificationContext } from './context.js';
import { NotificationsState } from './types.js';

export function useNotifications<T>(selector: (state: NotificationsState<unknown>) => T): T {
    const store = useContext(NotificationContext);
    if (!store) throw new Error('Missing BearContext.Provider in the tree');
    return useStore(store, selector);
}
