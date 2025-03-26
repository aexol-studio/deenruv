import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { PluginStore } from './plugin-store';
import {
    DeenruvUIPlugin,
    DetailLocationID,
    ModalLocationsKeys,
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
    getComponents: (position: string, tab?: string) => React.ComponentType<any>[];
    getModalComponents: (location: ModalLocationsKeys) => React.ComponentType<any>[];
    getInputComponent: (id: string) => React.ComponentType<any> | null;
    getDetailViewTabs: (location: DetailLocationID) => DeenruvUIPlugin['tabs'];
    getDetailViewActions: (location: DetailLocationID) => DeenruvUIPlugin['actions'];
    getTableExtensions: (location: ListLocationID) => DeenruvUIPlugin['tables'];
    navMenuData: {
        groups: PluginNavigationGroup[];
        links: PluginNavigationLink[];
    };
    widgets: Widget[];
    topNavigationComponents: DeenruvUIPlugin['topNavigationComponents'];
    topNavigationActionsMenu: DeenruvUIPlugin['topNavigationActionsMenu'];
    configs: Map<string, any>;
    plugins: DeenruvUIPlugin[];
}>({
    channel: undefined,
    language: '',
    translationsLanguage: '',
    viewMarkers: false,
    setViewMarkers: () => undefined,
    openDropdown: false,
    setOpenDropdown: () => undefined,
    getComponents: () => [],
    getModalComponents: () => [],
    getInputComponent: () => () => null,
    getDetailViewTabs: () => [],
    getDetailViewActions: () => undefined,
    getTableExtensions: () => [],
    navMenuData: { groups: [], links: [] },
    widgets: [],
    topNavigationComponents: [],
    topNavigationActionsMenu: [],
    configs: new Map(),
    plugins: [],
});

export const PluginProvider: FC<
    PropsWithChildren<{
        plugins: PluginStore;
        context: { channel?: Channel; language: string; translationsLanguage: string };
    }>
> = ({ children, plugins, context }) => {
    const [viewMarkers, setViewMarkers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const getComponents = (position: string, tab?: string) => {
        return plugins.getComponents(position, tab) || [];
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

    const getDetailViewActions = (location: DetailLocationID) => {
        return plugins.getDetailViewActions(location);
    };

    const getModalComponents = (location: ModalLocationsKeys) => {
        return plugins.getModalComponents(location);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'q') {
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
                getModalComponents,
                getInputComponent,
                getTableExtensions,
                getDetailViewTabs,
                getDetailViewActions,
                navMenuData: plugins.navMenuData,
                widgets: plugins.widgets,
                topNavigationComponents: plugins.topNavigationComponents,
                topNavigationActionsMenu: plugins.topNavigationActionsMenu,
                configs: plugins.configs,
                plugins: Array.from(plugins.pluginMap.values()),
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
