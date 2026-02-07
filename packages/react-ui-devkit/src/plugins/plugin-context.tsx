import React, {
  createContext,
  PropsWithChildren,
  useCallback,
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

type PluginStoreContextType = {
  channel?: Channel;
  language: string;
  translationsLanguage: string;
  viewMarkers: boolean;
  setViewMarkers: (view: boolean) => void;
  openDropdown: boolean;
  setOpenDropdown: (open: boolean) => void;
  getComponents: (position: string, tab?: string) => React.ComponentType<any>[];
  getSurfaceComponents: (
    position: string,
    tab?: string,
  ) => Array<{ key: string; component: React.ComponentType<any> }>;
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
};

const PluginStoreContext = createContext<PluginStoreContextType>({
  channel: undefined,
  language: "",
  translationsLanguage: "",
  viewMarkers: false,
  setViewMarkers: () => undefined,
  openDropdown: false,
  setOpenDropdown: () => undefined,
  getComponents: () => [],
  getSurfaceComponents: () => [],
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

export function PluginProvider({
  children,
  plugins,
  context,
}: PropsWithChildren<{
  plugins: PluginStore;
  context: {
    channel?: Channel;
    language: string;
    translationsLanguage: string;
  };
}>) {
  const [_plugins, setPlugins] = useState<DeenruvPluginStored[]>(() =>
    plugins.getPluginMap(),
  );
  const [viewMarkers, setViewMarkers] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navMenuData = useMemo(() => plugins.navMenuData, [_plugins]);

  const getComponents = useCallback(
    (position: string, tab?: string) =>
      plugins.getComponents(position, tab) || [],
    [plugins],
  );
  const getSurfaceComponents = useCallback(
    (position: string, tab?: string) =>
      plugins.getSurfaceComponents(position, tab),
    [plugins],
  );
  const getInputComponent = useCallback(
    (id: string) => plugins.getInputComponent(id) || null,
    [plugins],
  );
  const getTableExtensions = useCallback(
    (location: LocationKeys) => plugins.getTableExtensions(location),
    [plugins],
  );
  const getDetailViewTabs = useCallback(
    (location: DetailLocationID) => plugins.getDetailViewTabs(location),
    [plugins],
  );
  const getDetailViewActions = useCallback(
    (location: DetailLocationID) => plugins.getDetailViewActions(location),
    [plugins],
  );
  const getModalComponents = useCallback(
    (location: ModalLocationsKeys) => plugins.getModalComponents(location),
    [plugins],
  );
  const changePluginStatus = useCallback(
    (name: string, status: "active" | "inactive") => {
      plugins.changePluginStatus(name, status);
      setPlugins(plugins.getPluginMap());
    },
    [plugins],
  );

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

  const value = useMemo<PluginStoreContextType>(
    () => ({
      ...context,
      viewMarkers,
      setViewMarkers,
      openDropdown,
      setOpenDropdown,
      getComponents,
      getSurfaceComponents,
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
    }),
    [
      context,
      viewMarkers,
      openDropdown,
      getComponents,
      getSurfaceComponents,
      getModalComponents,
      getInputComponent,
      getTableExtensions,
      getDetailViewTabs,
      getDetailViewActions,
      changePluginStatus,
      navMenuData,
      _plugins,
      plugins,
    ],
  );

  return (
    <PluginStoreContext.Provider value={value}>
      <WidgetsStoreProvider context={context} widgets={plugins.widgets}>
        {children}
      </WidgetsStoreProvider>
    </PluginStoreContext.Provider>
  );
}

export function usePluginStore() {
  if (!PluginStoreContext) throw new Error("PluginStoreContext is not defined");
  return useContext(PluginStoreContext);
}
