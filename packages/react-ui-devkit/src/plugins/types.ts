import { GenericListContextType } from "@/components/templates/DetailList/useDetailListHook/types.js";
import { Notification } from "@/notifications/types.js";
import {
  BASE_GROUP_ID,
  DetailKeys,
  DetailLocationID,
  DetailLocationSidebarID,
  DetailLocations,
  DetailLocationsType,
  ExternalListLocationSelector,
  ListLocations,
  ListLocationsType,
  LocationKeys,
  ModalLocations,
  ModalLocationsKeys,
  ModalLocationsTypes,
} from "@/types/types.js";
import { ColumnDef } from "@tanstack/react-table";
import { FC, SVGProps } from "react";

export type Widget<T extends Record<string, any> = object> = {
  id: string | number;
  name: string;
  component: React.JSX.Element;
  visible: boolean;
  size: { width: number; height: number };
  sizes: { width: number; height: number }[];
  plugin?: DeenruvUIPlugin<T>;
};

export type DeenruvUITable<KEY extends keyof typeof ListLocations> = {
  id: KEY;
  externalSelector?: ExternalListLocationSelector[KEY];
  rowActions?: GenericListContextType<
    ExternalListLocationSelector[KEY]
  >["rowActions"];
  bulkActions?: GenericListContextType<
    ExternalListLocationSelector[KEY]
  >["bulkActions"];
  columns?: Array<
    ColumnDef<ListLocationsType<KEY>> & { label?: React.JSX.Element }
  >;
  hideColumns?: Array<keyof ListLocationsType<KEY>>;
};

export type PluginPage = {
  path: string;
  element: React.ReactNode;
};

export type PluginComponent = {
  id: string;
  component: React.ComponentType;
};

export type DeenruvUIDetailComponent<KEY extends keyof typeof DetailLocations> =
  {
    /** Used as localization */
    id: KEY | `${KEY}-sidebar`;
    /** Tab */
    tab?: string;
    /** Detail view component */
    component: React.ComponentType<{ data: DetailLocationsType<KEY> }>;
  };

/**
 * A typed extension-surface entry that plugins use to inject components
 * into named surfaces (detail views, sidebars, etc.) with explicit ordering.
 *
 * This is the **recommended** API for new plugins — prefer it over the
 * legacy `components` array.
 *
 * @example
 * ```ts
 * const plugin = createDeenruvUIPlugin({
 *   name: 'My Plugin',
 *   version: DEENRUV_UI_VERSION,
 *   extensions: [
 *     {
 *       id: 'my-plugin-badges',
 *       surface: 'products-detail-view',
 *       order: 10,
 *       component: BadgesComponent,
 *     },
 *   ],
 * });
 * ```
 */
export type SurfaceExtension = {
  /**
   * A stable, unique identifier for this extension within its plugin.
   * Used as React key and for deterministic ordering across renders.
   */
  id: string;
  /**
   * The target surface (location) where this component will be injected.
   * Matches detail view location IDs or sidebar location IDs
   * (e.g. `'products-detail-view'`, `'orders-detail-view-sidebar'`).
   */
  surface: DetailLocationID | DetailLocationSidebarID;
  /**
   * Optional tab name — when provided the component is only rendered
   * while the matching tab is active.
   */
  tab?: string;
  /**
   * Ordering hint. Lower values appear first.
   * Extensions without an explicit order are placed after ordered ones
   * in plugin-registration sequence.
   * @default undefined (appended in registration order)
   */
  order?: number;
  /** The React component to render at the surface. */
  component: React.ComponentType;
};

/**
 * A resolved extension entry stored internally by `PluginStore`.
 * Adds origin metadata used for deterministic, stable ordering.
 */
export type ResolvedSurfaceExtension = SurfaceExtension & {
  /** Name of the plugin that registered this extension. */
  pluginName: string;
  /** Registration sequence index (global across all plugins). */
  registrationIndex: number;
};

export type DeenruvUIModalComponent<KEY extends keyof typeof ModalLocations> = {
  /** Used as localization */
  id: KEY;
  /** Modal component */
  component: React.ComponentType<{ data: ModalLocationsTypes[KEY] }>;
};

export type DeenruvTabs<KEY extends keyof typeof DetailLocations> = {
  /** Used as localization */
  id: KEY;
  /** Label used as readable value */
  label: string;
  /** Name used as query param */
  name: string;
  /** Tab component */
  component: React.ReactNode;
  /** Choose if sidebar is hidden */
  hideSidebar?: boolean;
  /** Choose if sidebar is replaced */
  sidebarReplacement?: React.ReactNode;
  /** Choose if tab is disabled */
  disabled?: boolean;
};

export type PluginNavigationGroup = {
  id: string;
  labelId: string;
  placement?: { groupId: BASE_GROUP_ID | (string & {}) };
};

export type PluginNavigationLink = {
  id: string;
  labelId: string;
  href: string;
  groupId: BASE_GROUP_ID | (string & {});
  icon: FC<SVGProps<SVGSVGElement>>;
  placement?: { linkId: string; where?: "above" | "under" };
};

export type NavigationAction = {
  label: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  onClick: () => void;
};

/**
 * A manifest entry describing an available UI plugin.
 * Used by the panel's plugin registry to declare which plugins are available
 * and whether they are enabled by default.
 */
export type DeenruvUIPluginManifestItem<
  T extends Record<string, any> = object,
> = {
  /** Unique identifier for the plugin (used in env var to enable/disable) */
  id: string;
  /** The plugin instance */
  plugin: DeenruvUIPlugin<T>;
  /** Whether this plugin is enabled when no env override is provided */
  enabledByDefault: boolean;
};

/**
 * Helper to create a manifest entry with full type inference.
 * Validates at the type level that the entry satisfies `DeenruvUIPluginManifestItem`.
 */
export function defineManifestEntry<T extends Record<string, any> = object>(
  entry: DeenruvUIPluginManifestItem<T>,
): DeenruvUIPluginManifestItem<T> {
  return entry;
}

/**
 * Report returned by `PluginStore.installFromManifest()` describing what happened
 * during installation.
 */
export type PluginInstallReport = {
  /** IDs that were requested AND found in the manifest → installed */
  installed: ReadonlyArray<string>;
  /** IDs present in `enabledIds` but absent from the manifest */
  unknown: ReadonlyArray<string>;
  /** IDs that appeared more than once in the manifest (first-wins) */
  duplicates: ReadonlyArray<string>;
  /** Total number of manifest entries processed */
  manifestSize: number;
};

export type DeenruvUIPlugin<T extends Record<string, any> = object> = {
  name: string;
  version: string;
  config?: T;
  /** Applied on the selected tables */
  tables?: Array<DeenruvUITable<LocationKeys>>;
  /** Applied on the detail views (pages) */
  tabs?: Array<DeenruvTabs<DetailKeys>>;
  /** Action applied on the detail view (pages) */
  actions?: {
    inline?: Array<DeenruvUIDetailComponent<DetailKeys>>;
    dropdown?: Array<DeenruvUIDetailComponent<DetailKeys>>;
  };
  /** Notifications are used to display messages to the user */
  notifications?: Array<Notification<any>>;
  /** Inputs allow to override the default components from custom fields */
  inputs?: Array<PluginComponent>;
  /**
   * Applied on the detail views (pages).
   *
   * @deprecated Prefer the typed `extensions` array which provides stable
   * keys, explicit ordering, and better type-safety. This field is still
   * fully supported and will not be removed without a major version bump.
   */
  components?: Array<DeenruvUIDetailComponent<DetailKeys>>;
  /**
   * Extension-surface components — the recommended way to inject UI into
   * detail views and sidebars.
   *
   * Each entry targets a named surface with a stable `id`, optional `tab`
   * filter, and optional `order` for deterministic placement.
   *
   * @see {@link SurfaceExtension} for the entry shape.
   */
  extensions?: Array<SurfaceExtension>;
  /** Applied on the modals */
  modals?: Array<DeenruvUIModalComponent<ModalLocationsKeys>>;
  /** Applied on the dashboard */
  widgets?: Array<Widget<T>>;
  /** Applied on the navigation */
  navMenuGroups?: Array<PluginNavigationGroup>;
  /** Applied on the navigation */
  navMenuLinks?: Array<PluginNavigationLink>;
  /** Applied on the app globally */
  pages?: Array<PluginPage>;
  /** Applied on top navigation bar */
  topNavigationComponents?: Array<PluginComponent>;
  /** Applied on top navigation action menu */
  topNavigationActionsMenu?: Array<NavigationAction>;
  /** Applied on the app globally */
  translations?: { ns: string; data: Record<string, Array<object>> };
};
