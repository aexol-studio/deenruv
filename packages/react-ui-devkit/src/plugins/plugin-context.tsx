import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DeenruvPluginStored, PluginStore } from "./plugin-store";
import {
  DetailLocationID,
  ModalLocationsKeys,
  ListLocationID,
  LocationKeys,
} from "@/types";
import { WidgetsStoreProvider } from "@/widgets/widgets-context";
import {
  DeenruvUIPlugin,
  PluginNavigationGroup,
  PluginNavigationLink,
  Widget,
} from "./types.js";

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
  getModalComponents: (
    location: ModalLocationsKeys,
  ) => React.ComponentType<any>[];
  getInputComponent: (id: string) => React.ComponentType<any> | null;
  getDetailViewTabs: (location: DetailLocationID) => DeenruvUIPlugin["tabs"];
  getDetailViewActions: (
    location: DetailLocationID,
  ) => DeenruvUIPlugin["actions"];
  getTableExtensions: (location: LocationKeys) => DeenruvUIPlugin["tables"];
  changePluginStatus: (name: string, status: "active" | "inactive") => void;
  navMenuData: {
    groups: PluginNavigationGroup[];
    links: PluginNavigationLink[];
  };
  widgets: Widget[];
  topNavigationComponents: DeenruvUIPlugin["topNavigationComponents"];
  topNavigationActionsMenu: DeenruvUIPlugin["topNavigationActionsMenu"];
  configs: Map<string, any>;
  plugins: DeenruvPluginStored[];
}>({
  channel: undefined,
  language: "",
  translationsLanguage: "",
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
  changePluginStatus: () => undefined,
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
    context: {
      channel?: Channel;
      language: string;
      translationsLanguage: string;
    };
  }>
> = ({ children, plugins, context }) => {
  const [_plugins, setPlugins] = useState<DeenruvPluginStored[]>(() =>
    plugins.getPluginMap(),
  );
  const [viewMarkers, setViewMarkers] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navMenuData = useMemo(() => plugins.navMenuData, [_plugins]);

  const getComponents = (position: string, tab?: string) =>
    plugins.getComponents(position, tab) || [];
  const getInputComponent = (id: string) =>
    plugins.getInputComponent(id) || null;
  const getTableExtensions = (location: LocationKeys) =>
    plugins.getTableExtensions(location);
  const getDetailViewTabs = (location: DetailLocationID) =>
    plugins.getDetailViewTabs(location);
  const getDetailViewActions = (location: DetailLocationID) =>
    plugins.getDetailViewActions(location);
  const getModalComponents = (location: ModalLocationsKeys) =>
    plugins.getModalComponents(location);
  const changePluginStatus = (name: string, status: "active" | "inactive") => {
    console.log("changePluginStatus", name, status);
    plugins.changePluginStatus(name, status);
    setPlugins(plugins.getPluginMap());
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "q") {
        setViewMarkers((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
        changePluginStatus,
        navMenuData,
        widgets: plugins.widgets,
        topNavigationComponents: plugins.topNavigationComponents,
        topNavigationActionsMenu: plugins.topNavigationActionsMenu,
        configs: plugins.configs,
        plugins: _plugins,
      }}
    >
      <WidgetsStoreProvider context={context} widgets={plugins.widgets}>
        {children}
      </WidgetsStoreProvider>
    </PluginStoreContext.Provider>
  );
};

export function usePluginStore() {
  if (!PluginStoreContext) throw new Error("PluginStoreContext is not defined");
  return useContext(PluginStoreContext);
}
