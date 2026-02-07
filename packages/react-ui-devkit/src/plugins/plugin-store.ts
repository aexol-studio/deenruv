import React from "react";

import { defaultInputComponents } from "./default-input-components.js";
import { DetailLocationID, LocationKeys } from "@/types/index.js";
import {
  DeenruvUIPlugin,
  DeenruvUIPluginManifestItem,
  PluginInstallReport,
  ResolvedSurfaceExtension,
} from "./types.js";

const pagePathPrefix = "admin-ui/extensions";

const removeAllSpaces = (str: string) => str.replace(/\s/g, "-");

const getExtensionsPath = (pluginName: string, path: string) =>
  [pagePathPrefix, removeAllSpaces(pluginName.toLowerCase()), path].join("/");

type I18Next = {
  addResourceBundle: (lng: string, ns: string, trans: object) => void;
};

export type DeenruvPluginStored = DeenruvUIPlugin & {
  status: "active" | "inactive";
};

export class PluginStore {
  private i18next: I18Next;
  private pluginConfig: Map<string, Record<string, any>> = new Map();
  pluginMap: Map<string, DeenruvPluginStored> = new Map();
  private pluginPages: Array<
    NonNullable<DeenruvUIPlugin["pages"]>[number] & {
      plugin: DeenruvPluginStored;
    }
  > = [];
  private pluginsNavigationDataField: {
    groups: Array<
      NonNullable<DeenruvUIPlugin["navMenuGroups"]>[number] & {
        plugin: DeenruvPluginStored;
      }
    >;
    links: Array<
      NonNullable<DeenruvUIPlugin["navMenuLinks"]>[number] & {
        plugin: DeenruvPluginStored;
      }
    >;
  } = { groups: [], links: [] };

  /**
   * Registry of extension-surface entries from the new `extensions` API.
   * Populated during `install()`. Entries are sorted deterministically.
   */
  private extensionRegistry: ResolvedSurfaceExtension[] = [];

  /**
   * Monotonically increasing counter used to assign a stable registration
   * index to each extension across all plugins.
   */
  private extensionSeq = 0;

  getPluginMap() {
    return Array.from(this.pluginMap.values()).filter(
      (plugin) => plugin.status === "active",
    );
  }

  changePluginStatus(name: string, status: "active" | "inactive") {
    const plugin = this.pluginMap.get(name);
    if (!plugin) return;
    this.pluginMap.set(name, { ...plugin, status });
    if (status === "inactive") {
      this.pluginsNavigationDataField.links =
        this.pluginsNavigationDataField.links.filter(
          (link) => link.plugin.name !== name,
        );
      this.pluginsNavigationDataField.groups =
        this.pluginsNavigationDataField.groups.filter(
          (group) => group.plugin.name !== name,
        );
      this.pluginPages = this.pluginPages.filter(
        (page) => page.plugin.name !== name,
      );
      this.pluginConfig.delete(name);
    } else {
      this.pluginsNavigationDataField.links =
        this.pluginsNavigationDataField.links.map((link) => {
          if (link.plugin.name === name) {
            return {
              ...link,
              plugin: { ...link.plugin, status: "active" },
            };
          }
          return link;
        });
      this.pluginsNavigationDataField.groups =
        this.pluginsNavigationDataField.groups.map((group) => {
          if (group.plugin.name === name) {
            return {
              ...group,
              plugin: { ...group.plugin, status: "active" },
            };
          }
          return group;
        });
      this.pluginPages = this.pluginPages.map((page) => {
        if (page.plugin.name === name) {
          return {
            ...page,
            plugin: { ...page.plugin, status: "active" },
          };
        }
        return page;
      });
      this.pluginConfig.set(name, plugin.config || {});
    }
  }

  install(plugins: DeenruvUIPlugin[], i18next: I18Next) {
    this.i18next = i18next;
    plugins.forEach(
      ({
        translations,
        pages,
        navMenuGroups,
        navMenuLinks,
        extensions,
        ...plugin
      }) => {
        this.pluginMap.set(plugin.name, { ...plugin, status: "active" });
        this.pluginConfig.set(plugin.name, plugin.config || {});

        // Index extension-surface entries
        if (extensions) {
          for (const ext of extensions) {
            this.extensionRegistry.push({
              ...ext,
              pluginName: plugin.name,
              registrationIndex: this.extensionSeq++,
            });
          }
        }

        if (!translations) return;
        for (const [lng, locales] of Object.entries(translations.data)) {
          locales.forEach((trans) =>
            i18next.addResourceBundle(lng, translations.ns, trans),
          );
        }
      },
    );
    this.pluginPages = plugins.flatMap(
      (el) =>
        el.pages?.map((route) => ({
          ...route,
          plugin: { ...el, status: "active" },
          path: getExtensionsPath(el.name, route.path),
        })) || [],
    );
    this.pluginsNavigationDataField.links = plugins.flatMap((el) => {
      if (!el.navMenuLinks) return [];
      return el.navMenuLinks.map((linkEl) => ({
        ...linkEl,
        plugin: { ...el, status: "active" },
        labelId: `${el.translations?.ns}.${linkEl.labelId}`,
        href: getExtensionsPath(el.name, linkEl.href),
      }));
    });
    this.pluginsNavigationDataField.groups = plugins
      .flatMap(
        (el) =>
          el.navMenuGroups?.map((groupEl) => ({
            ...groupEl,
            plugin: { ...el, status: "active" as const },
            labelId: `${el.translations?.ns}.${groupEl.labelId}`,
          })) || [],
      )
      .filter(
        (el, idx, arr) => idx === arr.findIndex((obj) => obj.id === el.id),
      );
  }

  /**
   * Install plugins from a manifest, filtered by a set of enabled IDs.
   * This is a convenience wrapper around `install()` that resolves which
   * plugins to activate based on the provided `enabledIds`.
   *
   * Duplicate manifest IDs are handled deterministically: the first entry
   * wins and subsequent duplicates are skipped (with a console warning).
   *
   * @param manifest - Full list of available plugin manifest entries
   * @param enabledIds - Set of plugin IDs to install (only these will be activated)
   * @param i18next - i18next instance for translation registration
   * @returns A typed report describing what was installed, skipped, or unknown
   */
  installFromManifest(
    manifest: ReadonlyArray<DeenruvUIPluginManifestItem>,
    enabledIds: ReadonlySet<string>,
    i18next: I18Next,
  ): PluginInstallReport {
    // Deduplicate manifest entries (first wins)
    const seenIds = new Set<string>();
    const duplicates: string[] = [];
    const deduped: DeenruvUIPluginManifestItem[] = [];

    for (const entry of manifest) {
      if (seenIds.has(entry.id)) {
        duplicates.push(entry.id);
        console.warn(
          `[PluginStore] Duplicate manifest ID "${entry.id}" — skipping (first entry wins).`,
        );
        continue;
      }
      seenIds.add(entry.id);
      deduped.push(entry);
    }

    // Detect unknown IDs (requested but not in manifest)
    const manifestIds = new Set(deduped.map((e) => e.id));
    const unknown: string[] = [];
    Array.from(enabledIds).forEach((id) => {
      if (!manifestIds.has(id)) {
        unknown.push(id);
      }
    });

    if (unknown.length > 0) {
      console.warn(
        `[PluginStore] Unknown plugin IDs: ${unknown.join(", ")}. ` +
          `Available: ${Array.from(manifestIds).join(", ")}`,
      );
    }

    // Filter and install
    const toInstall = deduped.filter((entry) => enabledIds.has(entry.id));
    const installed = toInstall.map((entry) => entry.id);
    this.install(
      toInstall.map((entry) => entry.plugin),
      i18next,
    );

    return {
      installed,
      unknown,
      duplicates,
      manifestSize: manifest.length,
    };
  }

  getInputComponent(id: string) {
    let component = null;
    const input = this.getPluginMap()
      .map((plugin) => plugin.inputs?.find((input) => input.id === id))
      .find(Boolean);
    if (input?.component) component = input.component;
    else
      component =
        defaultInputComponents[id as keyof typeof defaultInputComponents];
    return component;
  }

  /**
   * Resolve extension-surface components for a given location and optional tab.
   *
   * Merges entries from:
   * 1. New `extensions` API — sorted by `order` (ascending), then by
   *    registration sequence for entries with equal or missing order.
   * 2. Legacy `components` API — appended **after** new-API entries in
   *    plugin-registration order.
   *
   * Each returned entry includes a stable `key` suitable for React rendering.
   */
  getSurfaceComponents(
    location: string,
    passedTab?: string,
  ): Array<{ key: string; component: React.ComponentType<any> }> {
    const results: Array<{
      key: string;
      component: React.ComponentType<any>;
    }> = [];

    // ── 1. New extensions API (deterministic ordering) ──────────────────
    const activePluginNames = new Set(this.getPluginMap().map((p) => p.name));
    const matchingExtensions = this.extensionRegistry
      .filter(
        (ext) =>
          activePluginNames.has(ext.pluginName) &&
          ext.surface === location &&
          (!passedTab || ext.tab === passedTab),
      )
      .sort((a, b) => {
        // Entries with explicit order come first
        const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.registrationIndex - b.registrationIndex;
      });

    for (const ext of matchingExtensions) {
      const key = `ext:${ext.pluginName}:${ext.id}`;
      results.push({ key, component: ext.component });
    }

    // ── 2. Legacy components API (registration order, after extensions) ─
    let legacyIndex = 0;
    this.getPluginMap().forEach((plugin) => {
      plugin.components?.forEach(({ component, tab, id }) => {
        if (id === location && (!passedTab || tab === passedTab)) {
          const key = `legacy:${plugin.name}:${id}:${legacyIndex}`;
          results.push({ key, component });
        }
        legacyIndex++;
      });
    });

    return results;
  }

  /**
   * Legacy resolver — returns bare component array for backward compatibility.
   *
   * Delegates to `getSurfaceComponents()` internally so both APIs produce
   * consistent results.
   *
   * @deprecated Prefer `getSurfaceComponents()` for stable keys and ordering.
   */
  getComponents(location: string, passedTab?: string): React.ComponentType[] {
    return this.getSurfaceComponents(location, passedTab).map(
      (entry) => entry.component,
    );
  }

  getModalComponents(location: string) {
    const components: Array<{
      key: string;
      component: React.ComponentType<any>;
    }> = [];
    let index = 0;
    this.getPluginMap().forEach((plugin) => {
      plugin.modals?.forEach(({ component, id }) => {
        if (id === location) {
          const key = `modal:${plugin.name}:${id}:${index}`;
          components.push({ key, component });
        }
        index++;
      });
    });
    return components.map((entry) => entry.component);
  }

  getTableExtensions(location: LocationKeys) {
    const tables = new Map<
      string | number,
      NonNullable<DeenruvUIPlugin["tables"]>[number]
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.tables?.forEach((table) => {
        tables.set(table.id, table);
      });
    });
    return Array.from(tables.values()).filter((table) => table.id === location);
  }

  getDetailViewTabs(location: DetailLocationID) {
    const tabs = new Map<
      string | number,
      NonNullable<DeenruvUIPlugin["tabs"]>[number]
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.tabs?.forEach((tab) => {
        tabs.set(tab.id, tab);
      });
    });
    return Array.from(tabs.values()).filter((tab) => tab.id === location);
  }

  getDetailViewActions(
    location: DetailLocationID,
  ): NonNullable<DeenruvUIPlugin["actions"]> {
    const actionsInline = new Map<
      string,
      NonNullable<NonNullable<DeenruvUIPlugin["actions"]>["inline"]>[number]
    >();
    const actionsDropdown = new Map<
      string,
      NonNullable<NonNullable<DeenruvUIPlugin["actions"]>["dropdown"]>[number]
    >();
    this.getPluginMap().forEach((plugin, i) => {
      plugin.actions?.inline?.forEach((action, j) => {
        actionsInline.set(`${action.id}.${i}.${j}`, action);
      });
      plugin.actions?.dropdown?.forEach((action, j) => {
        actionsDropdown.set(`${action.id}.${j}.${i}`, action);
      });
    });
    const inline = Array.from(actionsInline.keys()).filter((action) => {
      const [split] = action.split(".");
      return split === location;
    });
    const dropdown = Array.from(actionsDropdown.keys()).filter((action) => {
      const [split] = action.split(".");
      return split === location;
    });
    const inlineComponents = inline.map((action) => actionsInline.get(action)!);
    const dropdownComponents = dropdown.map(
      (action) => actionsDropdown.get(action)!,
    );
    return { inline: inlineComponents, dropdown: dropdownComponents };
  }

  get topNavigationComponents() {
    const components = new Map<
      string,
      { component: React.ComponentType; id: string }
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.topNavigationComponents?.forEach(({ component, id }) => {
        components.set(id, { component, id });
      });
    });
    return Array.from(components.values());
  }

  get topNavigationActionsMenu() {
    const actions = new Map<
      string,
      NonNullable<DeenruvUIPlugin["topNavigationActionsMenu"]>[number]
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.topNavigationActionsMenu?.forEach((action) => {
        actions.set(action.label, action);
      });
    });
    return Array.from(actions.values());
  }

  get widgets() {
    const widgets = new Map<
      string | number,
      NonNullable<DeenruvUIPlugin["widgets"]>[number]
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.widgets?.forEach((widget) => {
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
    const notifications = new Map<
      string,
      NonNullable<DeenruvUIPlugin["notifications"]>[number]
    >();
    this.getPluginMap().forEach((plugin) => {
      plugin.notifications?.forEach((notification) => {
        notifications.set(notification.id, notification);
      });
    });
    return Array.from(notifications.values());
  }
}
