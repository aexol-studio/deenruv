import React from 'react';

import { DeenruvUIPlugin } from '../types';

export class PluginStore {
    private pluginMap: Map<string, DeenruvUIPlugin> = new Map();
    private routesField: Array<NonNullable<DeenruvUIPlugin['routes']>[number]> = [];

    installPlugins(plugins: DeenruvUIPlugin[]) {
        plugins.forEach(plugin => this.pluginMap.set(plugin.name, plugin));
        this.routesField = plugins.flatMap(
            el => el.routes?.map(route => ({ ...route, path: `admin-ui/extensions/${route.path}` })) || [],
        );
    }

    private getUUID() {
        const timestamp = Date.now().toString(16);
        const randomString = Math.random().toString(16).slice(2);
        return `${timestamp}-${randomString}`;
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
