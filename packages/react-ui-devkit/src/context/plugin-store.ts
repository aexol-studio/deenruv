import React from 'react';

import { DeenruvUIPlugin } from '../types';

const pagePathPrefix = 'admin-ui/extensions/';

const getExtensionsPath = (path: string) => pagePathPrefix + path;

type I18Next = {
    addResourceBundle: (lng: string, ns: string, trans: object) => void;
};

export class PluginStore {
    private i18next: I18Next;
    constructor(i18next: I18Next) {
        this.i18next = i18next;
    }

    private pluginMap: Map<string, DeenruvUIPlugin> = new Map();
    private pluginPages: Array<NonNullable<DeenruvUIPlugin['pages']>[number]> = [];
    private pluginsNavigationDataField: {
        groups: Array<NonNullable<DeenruvUIPlugin['navMenuGroups']>[number]>;
        links: Array<NonNullable<DeenruvUIPlugin['navMenuLinks']>[number]>;
    } = { groups: [], links: [] };

    install(plugins: DeenruvUIPlugin[]) {
        plugins.forEach(({ translations, pages, navMenuGroups, navMenuLinks, ...plugin }) => {
            this.pluginMap.set(plugin.name, plugin);

            if (!translations) return;
            for (const [lng, locales] of Object.entries(translations.data)) {
                locales.forEach(trans => this.i18next.addResourceBundle(lng, translations.ns, trans));
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
        this.pluginsNavigationDataField.groups = plugins.flatMap(
            el =>
                el.navMenuGroups?.map(groupEl => ({
                    ...groupEl,
                    labelId: `${el.translations?.ns}.${groupEl.labelId}`,
                })) || [],
        );
    }

    private getUUID() {
        const timestamp = Date.now().toString(16);
        const randomString = Math.random().toString(16).slice(2);
        return `${timestamp}-${randomString}`;
    }

    getInputComponents(id: string) {
        const uniqueMappedComponents = new Map<string, React.ComponentType>();
        this.pluginMap.forEach(plugin => {
            plugin.inputs?.forEach(({ component, id }) => {
                const uniqueUUID = [
                    id,
                    plugin.name,
                    this.getUUID(),
                    component.displayName && `-${component.displayName}`,
                ]
                    .filter(Boolean)
                    .join('-');

                if (id === id) {
                    uniqueMappedComponents.set(uniqueUUID, component);
                }
            });
        });
        return Array.from(uniqueMappedComponents.values());
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
