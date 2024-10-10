import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { PluginStore } from './plugin-store';

const PluginStoreContext = createContext<{
    store: PluginStore | null;
    viewMarkers: boolean;
    setViewMarkers: (view: boolean) => void;
    openDropdown: boolean;
    setOpenDropdown: (open: boolean) => void;
}>({
    store: null,
    viewMarkers: false,
    setViewMarkers: () => undefined,
    openDropdown: false,
    setOpenDropdown: () => undefined,
});
export const PluginProvider: FC<PropsWithChildren<{ store: PluginStore }>> = ({ children, store }) => {
    const [viewMarkers, setViewMarkers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

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
            value={{ store, viewMarkers, setViewMarkers, openDropdown, setOpenDropdown }}
        >
            {children}
        </PluginStoreContext.Provider>
    );
};

export function usePluginStore() {
    if (!PluginStoreContext) throw new Error('PluginStoreContext is not defined');
    return useContext(PluginStoreContext);
}
