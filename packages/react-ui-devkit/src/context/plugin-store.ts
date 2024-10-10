import React from 'react';

import { DeenruvUIPlugin } from '../types';

export class PluginStore {
    private pluginMap: Map<string, DeenruvUIPlugin> = new Map();
    private routesField: Array<NonNullable<DeenruvUIPlugin['routes']>[number]> = [];
    private navigation: Array<NonNullable<DeenruvUIPlugin['navigation']>[number]> = [];

    installPlugins(plugins: DeenruvUIPlugin[]) {
        plugins.forEach(plugin => this.pluginMap.set(plugin.name, plugin));
        this.routesField = plugins.flatMap(
            el => el.routes?.map(route => ({ ...route, path: `admin-ui/extensions/${route.path}` })) || [],
        );
        this.navigation = Array.from(this.pluginMap.values()).flatMap(el => {
            if (!el.navigation) return [];
            return el.navigation.map(element => ({
                ...element,
                route: `admin-ui/extensions/${element.route}`,
            }));
        });
    }

    private getUUID() {
        const timestamp = Date.now().toString(16);
        const randomString = Math.random().toString(16).slice(2);
        return `${timestamp}-${randomString}`;
    }

    get getNavigation() {
        return this.navigation;
    }

    getComponents(location: string) {
        const uniqueMappedComponents = new Map<string, React.ComponentType>();
        this.pluginMap.forEach(plugin => {
            plugin.components?.forEach(({ component, location: { id } }) => {
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

    get routes() {
        return this.routesField;
    }
}
