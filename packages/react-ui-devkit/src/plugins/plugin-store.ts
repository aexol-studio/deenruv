import React from 'react';

import { DeenruvUIPlugin, DetailLocationID, ListLocationID } from '../types/types';

const pagePathPrefix = 'admin-ui/extensions/';

const getExtensionsPath = (path: string) => pagePathPrefix + path;

type I18Next = {
    addResourceBundle: (lng: string, ns: string, trans: object) => void;
};

export class PluginStore {
    private i18next: I18Next;
    private pluginConfig: Map<string, Record<string, any>> = new Map();
    private pluginMap: Map<string, DeenruvUIPlugin> = new Map();
    private pluginPages: Array<NonNullable<DeenruvUIPlugin['pages']>[number]> = [];
    private pluginsNavigationDataField: {
        groups: Array<NonNullable<DeenruvUIPlugin['navMenuGroups']>[number]>;
        links: Array<NonNullable<DeenruvUIPlugin['navMenuLinks']>[number]>;
    } = { groups: [], links: [] };

    install(plugins: DeenruvUIPlugin[], i18next: I18Next) {
        this.i18next = i18next;
        plugins.forEach(({ translations, pages, navMenuGroups, navMenuLinks, ...plugin }) => {
            this.pluginMap.set(plugin.name, plugin);
            this.pluginConfig.set(plugin.name, plugin.config || {});

            if (!translations) return;
            for (const [lng, locales] of Object.entries(translations.data)) {
                locales.forEach(trans => i18next.addResourceBundle(lng, translations.ns, trans));
            }
        });
        this.pluginPages = plugins.flatMap(
            el => el.pages?.map(route => ({ ...route, path: getExtensionsPath(route.path) })) || [],
        );
        this.pluginsNavigationDataField.links = plugins.flatMap(el => {
            if (!el.navMenuLinks) return [];
            return el.navMenuLinks.map(linkEl => ({
                ...linkEl,
                labelId: `${el.translations?.ns}.${linkEl.labelId}`,
                href: getExtensionsPath(linkEl.href),
            }));
        });
        this.pluginsNavigationDataField.groups = plugins
            .flatMap(
                el =>
                    el.navMenuGroups?.map(groupEl => ({
                        ...groupEl,
                        labelId: `${el.translations?.ns}.${groupEl.labelId}`,
                    })) || [],
            )
            .filter((el, idx, arr) => idx === arr.findIndex(obj => obj.id === el.id));
    }

    private getUUID() {
        const timestamp = Date.now().toString(16);
        const randomString = Math.random().toString(16).slice(2);
        return `${timestamp}-${randomString}`;
    }

    getInputComponent(id: string) {
        const input = Array.from(this.pluginMap.values())
            .map(plugin => plugin.inputs?.find(input => input.id === id))
            .find(Boolean);
        return input?.component;
    }

    getComponents(location: string) {
        const uniqueMappedComponents = new Map<string, React.ComponentType>();
        this.pluginMap.forEach(plugin => {
            plugin.components?.forEach(({ component, id }) => {
                const uniqueUUID = [
                    id,
                    plugin.name,
                    this.getUUID(),
                    component.displayName && `-${component.displayName}`,
                ]
                    .filter(Boolean)
                    .join('-');

                if (id === location) {
                    uniqueMappedComponents.set(uniqueUUID, component as any);
                }
            });
        });
        return Array.from(uniqueMappedComponents.values());
    }

    getTableExtensions(location: ListLocationID) {
        const tables = new Map<string | number, NonNullable<DeenruvUIPlugin['tables']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.tables?.forEach(table => {
                tables.set(table.id, table);
            });
        });
        return Array.from(tables.values()).filter(table => table.id === location);
    }

    getDetailViewTabs(location: DetailLocationID) {
        const tabs = new Map<string | number, NonNullable<DeenruvUIPlugin['tabs']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.tabs?.forEach(tab => {
                tabs.set(tab.id, tab);
            });
        });
        return Array.from(tabs.values()).filter(tab => tab.id === location);
    }

    get topNavigationComponents() {
        const components = new Map<string, { component: React.ComponentType; id: string }>();
        this.pluginMap.forEach(plugin => {
            plugin.topNavigationComponents?.forEach(({ component, id }) => {
                components.set(id, { component, id });
            });
        });
        return Array.from(components.values());
    }

    get topNavigationActionsMenu() {
        const actions = new Map<string, NonNullable<DeenruvUIPlugin['topNavigationActionsMenu']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.topNavigationActionsMenu?.forEach(action => {
                actions.set(action.label, action);
            });
        });
        return Array.from(actions.values());
    }

    get widgets() {
        const widgets = new Map<string | number, NonNullable<DeenruvUIPlugin['widgets']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.widgets?.forEach(widget => {
                widgets.set(widget.id, { ...widget, plugin });
            });
        });
        return Array.from(widgets.values());
    }

    get navMenuData() {
        return this.pluginsNavigationDataField;
    }

    get routes() {
        return this.pluginPages;
    }

    get configs() {
        return this.pluginConfig;
    }
}
