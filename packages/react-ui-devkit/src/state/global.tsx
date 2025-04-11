import React, { useRef } from "react";
import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import {
  DeenruvAdminPanelSettings,
  DeenruvSettingsWindowType,
} from "@/DeenruvAdminPanelSettingsTypes.js";

type GlobalStoreProviderProps =
  React.PropsWithChildren<DeenruvAdminPanelSettings>;

type GlobalStoreType = ReturnType<typeof createGlobalStore>;

const createGlobalStore = (initProps?: Partial<DeenruvAdminPanelSettings>) => {
  const DEFAULT_PROPS: DeenruvSettingsWindowType = {
    base: "/admin-ui",
    appVersion: "0.0.1",
    branding: { name: "Deenruv" },
    api: {
      uri: "http://localhost:3000",
      channelTokenName: "deenruv-token",
      authTokenName: "deenruv-auth-token",
    },
    i18n: {},
  };

  return createStore<DeenruvSettingsWindowType>()(
    () =>
      ({
        ...DEFAULT_PROPS,
        ...initProps,
      }) as DeenruvSettingsWindowType,
  );
};

export const GlobalStoreContext = createContext<GlobalStoreType | null>(null);

export function GlobalStoreProvider({
  children,
  ...props
}: GlobalStoreProviderProps) {
  const storeRef = useRef<GlobalStoreType>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore(props);
  }
  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

export function useGlobalStore<T>(
  selector: (state: DeenruvSettingsWindowType) => T,
) {
  const store = useContext(GlobalStoreContext);
  if (!store)
    throw new Error("Missing GlobalStoreContext.Provider in the tree");
  return useStore(store, selector);
}
