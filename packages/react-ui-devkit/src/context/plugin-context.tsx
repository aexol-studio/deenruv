import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { PluginStore } from './plugin-store';
import { PluginNavigationGroup, PluginNavigationLink, Widget } from '@/types';
import { WidgetsStoreProvider } from '@/widgets/widgets-context';

const PluginStoreContext = createContext<{
    viewMarkers: boolean;
    setViewMarkers: (view: boolean) => void;
    openDropdown: boolean;
    setOpenDropdown: (open: boolean) => void;
    getComponents: (position: string) => React.ComponentType<{}>[];
    navMenuData: {
        groups: PluginNavigationGroup[];
        links: PluginNavigationLink[];
    };
    widgets: Widget[];
}>({
    viewMarkers: false,
    setViewMarkers: () => undefined,
    openDropdown: false,
    setOpenDropdown: () => undefined,
    getComponents: () => [],
    navMenuData: {
        groups: [],
        links: [],
    },
    widgets: [],
});

export const PluginProvider: FC<PropsWithChildren<{ store: PluginStore }>> = ({ children, store }) => {
    const [viewMarkers, setViewMarkers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

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
                navMenuData: store.navMenuData,
                widgets: store.widgets,
            }}
        >
            <WidgetsStoreProvider widgets={store.widgets}>{children}</WidgetsStoreProvider>
        </PluginStoreContext.Provider>
    );
};

export function usePluginStore() {
    if (!PluginStoreContext) throw new Error('PluginStoreContext is not defined');
    return useContext(PluginStoreContext);
}
