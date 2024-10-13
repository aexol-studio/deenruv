import React from 'react';

import { DeenruvUIPlugin } from '../types';

const pagePathPrefix = 'admin-ui/extensions/';

const getExtensionsPath = (path: string) => pagePathPrefix + path;

export class PluginStore {
    private pluginMap: Map<string, DeenruvUIPlugin> = new Map();
    private pluginPages: Array<NonNullable<DeenruvUIPlugin['pages']>[number]> = [];
    private pluginsNavigationDataField: {
        groups: Array<NonNullable<DeenruvUIPlugin['navMenuGroups']>[number]>;
        links: Array<NonNullable<DeenruvUIPlugin['navMenuLinks']>[number]>;
    } = { groups: [], links: [] };

    installPlugins(plugins: DeenruvUIPlugin[]) {
        plugins.forEach(plugin => this.pluginMap.set(plugin.name, plugin));
        this.pluginPages = plugins.flatMap(
            el => el.pages?.map(route => ({ ...route, path: getExtensionsPath(route.path) })) || [],
        );
        this.pluginsNavigationDataField.links = plugins.flatMap(el => {
            if (!el.navMenuLinks) return [];
            return el.navMenuLinks.map(linkEl => ({
                ...linkEl,
                href: getExtensionsPath(linkEl.href),
            }));
        });
        this.pluginsNavigationDataField.groups = plugins.flatMap(el => el.navMenuGroups || []);
    }

    private getUUID() {
        const timestamp = Date.now().toString(16);
        const randomString = Math.random().toString(16).slice(2);
        return `${timestamp}-${randomString}`;
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
                    uniqueMappedComponents.set(uniqueUUID, component);
                }
            });
        });
        return Array.from(uniqueMappedComponents.values());
    }

    get widgets() {
        const widgets = new Map<string | number, NonNullable<DeenruvUIPlugin['widgets']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.widgets?.forEach(widget => {
                widgets.set(widget.id, widget);
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
}
