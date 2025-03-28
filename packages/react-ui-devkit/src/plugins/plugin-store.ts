import React from 'react';

import { DeenruvUIPlugin, DetailLocationID, ListLocationID } from '../types/types';
import { defaultInputComponents } from './default-input-components.js';

const pagePathPrefix = 'admin-ui/extensions';

const removeAllSpaces = (str: string) => str.replace(/\s/g, '-');

const getExtensionsPath = (pluginName: string, path: string) =>
    [pagePathPrefix, removeAllSpaces(pluginName.toLowerCase()), path].join('/');

type I18Next = {
    addResourceBundle: (lng: string, ns: string, trans: object) => void;
};

export class PluginStore {
    private i18next: I18Next;
    private pluginConfig: Map<string, Record<string, any>> = new Map();
    pluginMap: Map<string, DeenruvUIPlugin> = new Map();
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
            el =>
                el.pages?.map(route => ({
                    ...route,
                    path: getExtensionsPath(el.name, route.path),
                })) || [],
        );
        this.pluginsNavigationDataField.links = plugins.flatMap(el => {
            if (!el.navMenuLinks) return [];
            return el.navMenuLinks.map(linkEl => ({
                ...linkEl,
                labelId: `${el.translations?.ns}.${linkEl.labelId}`,
                href: getExtensionsPath(el.name, linkEl.href),
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
        let component = null;
        const input = Array.from(this.pluginMap.values())
            .map(plugin => plugin.inputs?.find(input => input.id === id))
            .find(Boolean);
        if (input?.component) component = input.component;
        else component = defaultInputComponents[id as keyof typeof defaultInputComponents];
        return component;
    }

    getComponents(location: string, passedTab?: string) {
        const uniqueMappedComponents = new Map<string, React.ComponentType>();
        this.pluginMap.forEach(plugin => {
            plugin.components?.forEach(({ component, tab, id }) => {
                const uniqueUUID = [
                    id,
                    plugin.name,
                    this.getUUID(),
                    component.displayName && `-${component.displayName}`,
                    tab && `-${tab}`,
                ]
                    .filter(Boolean)
                    .join('-');
                if (id === location && (!passedTab || tab === passedTab)) {
                    uniqueMappedComponents.set(uniqueUUID, component as any);
                }
            });
        });
        return Array.from(uniqueMappedComponents.values());
    }

    getModalComponents(location: string) {
        const uniqueMappedComponents = new Map<string, React.ComponentType>();
        this.pluginMap.forEach(plugin => {
            plugin.modals?.forEach(({ component, id }) => {
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

    getDetailViewActions(location: DetailLocationID): NonNullable<DeenruvUIPlugin['actions']> {
        const actionsInline = new Map<
            string,
            NonNullable<NonNullable<DeenruvUIPlugin['actions']>['inline']>[number]
        >();
        const actionsDropdown = new Map<
            string,
            NonNullable<NonNullable<DeenruvUIPlugin['actions']>['dropdown']>[number]
        >();
        this.pluginMap.forEach((plugin, i) => {
            plugin.actions?.inline?.forEach((action, j) => {
                actionsInline.set(`${action.id}.${i}.${j}`, action);
            });
            plugin.actions?.dropdown?.forEach((action, j) => {
                actionsDropdown.set(`${action.id}.${j}.${i}`, action);
            });
        });
        const inline = Array.from(actionsInline.keys()).filter(action => {
            const [split] = action.split('.');
            return split === location;
        });
        const dropdown = Array.from(actionsDropdown.keys()).filter(action => {
            const [split] = action.split('.');
            return split === location;
        });
        const inlineComponents = inline.map(action => actionsInline.get(action)!);
        const dropdownComponents = dropdown.map(action => actionsDropdown.get(action)!);
        return { inline: inlineComponents, dropdown: dropdownComponents };
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

    get notifications() {
        const notifications = new Map<string, NonNullable<DeenruvUIPlugin['notifications']>[number]>();
        this.pluginMap.forEach(plugin => {
            plugin.notifications?.forEach(notification => {
                notifications.set(notification.id, notification);
            });
        });
        return Array.from(notifications.values());
    }
}
