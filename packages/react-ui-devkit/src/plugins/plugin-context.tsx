import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { PluginStore } from './plugin-store';
import {
    DeenruvUIPlugin,
    DetailLocationID,
    ListLocationID,
    PluginNavigationGroup,
    PluginNavigationLink,
    Widget,
} from '@/types';
import { WidgetsStoreProvider } from '@/widgets/widgets-context';

export type Channel = {
    id: string;
    code: string;
    currencyCode: string;
    token: string;
    defaultLanguageCode: string;
};

const PluginStoreContext = createContext<{
    channel?: Channel;
    language: string;
    translationsLanguage: string;
    viewMarkers: boolean;
    setViewMarkers: (view: boolean) => void;
    openDropdown: boolean;
    setOpenDropdown: (open: boolean) => void;
    getComponents: (position: string) => React.ComponentType<any>[];
    getInputComponent: (id: string) => React.ComponentType<any> | null;
    getDetailViewTabs: (location: DetailLocationID) => DeenruvUIPlugin['tabs'];
    getTableExtensions: (location: ListLocationID) => DeenruvUIPlugin['tables'];
    navMenuData: {
        groups: PluginNavigationGroup[];
        links: PluginNavigationLink[];
    };
    widgets: Widget[];
}>({
    channel: undefined,
    language: '',
    translationsLanguage: '',
    viewMarkers: false,
    setViewMarkers: () => undefined,
    openDropdown: false,
    setOpenDropdown: () => undefined,
    getComponents: () => [],
    getInputComponent: () => () => null,
    getDetailViewTabs: () => [],
    getTableExtensions: () => [],
    navMenuData: {
        groups: [],
        links: [],
    },
    widgets: [],
});

export const PluginProvider: FC<
    PropsWithChildren<{
        plugins: PluginStore;
        context: { channel?: Channel; language: string; translationsLanguage: string };
    }>
> = ({ children, plugins, context }) => {
    const [viewMarkers, setViewMarkers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const getComponents = (position: string) => {
        return plugins.getComponents(position) || [];
    };

    const getInputComponent = (id: string) => {
        return plugins.getInputComponent(id) || null;
    };

    const getTableExtensions = (location: ListLocationID) => {
        return plugins.getTableExtensions(location);
    };

    const getDetailViewTabs = (location: DetailLocationID) => {
        return plugins.getDetailViewTabs(location);
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
                ...context,
                viewMarkers,
                setViewMarkers,
                openDropdown,
                setOpenDropdown,
                getComponents,
                getInputComponent,
                getTableExtensions,
                getDetailViewTabs,
                navMenuData: plugins.navMenuData,
                widgets: plugins.widgets,
            }}
        >
            <WidgetsStoreProvider context={context} widgets={plugins.widgets}>
                {children}
            </WidgetsStoreProvider>
        </PluginStoreContext.Provider>
    );
};

export function usePluginStore() {
    if (!PluginStoreContext) throw new Error('PluginStoreContext is not defined');
    return useContext(PluginStoreContext);
}
