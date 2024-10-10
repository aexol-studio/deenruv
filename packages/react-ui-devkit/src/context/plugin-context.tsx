import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { PluginStore } from './plugin-store';
import { NavigationItem } from '@/types';
import { Chain } from '@/zeus';

const PluginStoreContext = createContext<{
    viewMarkers: boolean;
    setViewMarkers: (view: boolean) => void;
    openDropdown: boolean;
    setOpenDropdown: (open: boolean) => void;
    getComponents: (position: string) => React.ComponentType<{}>[];
    navigation: NavigationItem[];
}>({
    viewMarkers: false,
    setViewMarkers: () => undefined,
    openDropdown: false,
    setOpenDropdown: () => undefined,
    getComponents: () => [],
    navigation: [],
});

export const PluginProvider: FC<PropsWithChildren<{ store: PluginStore }>> = ({ children, store }) => {
    const [viewMarkers, setViewMarkers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const [channel, setChannel] = useState<string | null>(null);
    const headers = {
        'x-channel': channel || '',
    };

    const getComponents = (position: string) => {
        return store.getComponents(position) || [];
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'x') {
                setViewMarkers(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <PluginStoreContext.Provider
            value={{
                viewMarkers,
                setViewMarkers,
                openDropdown,
                setOpenDropdown,
                getComponents,
                navigation: store.getNavigation,
            }}
        >
            {children}
        </PluginStoreContext.Provider>
    );
};

export function usePluginStore() {
    if (!PluginStoreContext) throw new Error('PluginStoreContext is not defined');
    return useContext(PluginStoreContext);
}
