import { GenericListContextType } from "@/components/templates/DetailList/useDetailListHook/types.js";
import { Notification } from "@/notifications/types.js";
import {
  BASE_GROUP_ID,
  DetailKeys,
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
  component: JSX.Element;
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
  /** Applied on the detail views (pages) */
  components?: Array<DeenruvUIDetailComponent<DetailKeys>>;
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
