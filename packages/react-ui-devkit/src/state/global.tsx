import React, { useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { DeenruvAdminPanelSettings } from '@/types';

type GlobalStoreProviderProps = React.PropsWithChildren<DeenruvAdminPanelSettings>;

type GlobalStoreType = ReturnType<typeof createGlobalStore>;

const createGlobalStore = (initProps?: Partial<DeenruvAdminPanelSettings>) => {
    const DEFAULT_PROPS: DeenruvAdminPanelSettings = {
        branding: { name: 'Deenruv' },
        api: {
            uri: 'http://localhost:3000',
            channelTokenName: 'deenruv-token',
            authTokenName: 'deenruv-auth-token',
        },
    };
    return createStore<DeenruvAdminPanelSettings>()(() => ({
        ...DEFAULT_PROPS,
        ...initProps,
    }));
};

export const GlobalStoreContext = createContext<GlobalStoreType | null>(null);

export function GlobalStoreProvider({ children, ...props }: GlobalStoreProviderProps) {
    const storeRef = useRef<GlobalStoreType>();
    if (!storeRef.current) {
        storeRef.current = createGlobalStore(props);
    }
    return <GlobalStoreContext.Provider value={storeRef.current}>{children}</GlobalStoreContext.Provider>;
}

export function useGlobalStore<T>(selector: (state: DeenruvAdminPanelSettings) => T) {
    const store = useContext(GlobalStoreContext);
    if (!store) throw new Error('Missing GlobalStoreContext.Provider in the tree');
    return useStore(store, selector);
}
