import React, { useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { DeenruvAdminPanelSettings } from '@deenruv/react-ui-devkit';

type BrandingStoreProviderProps = React.PropsWithChildren<DeenruvAdminPanelSettings>;

type BrandingStoreType = ReturnType<typeof createBrandingStore>;

const createBrandingStore = (initProps?: Partial<DeenruvAdminPanelSettings>) => {
  const DEFAULT_PROPS: DeenruvAdminPanelSettings = {
    branding: { name: 'Deenruv' },
    api: { uri: 'http://localhost:3000' },
  };
  return createStore<DeenruvAdminPanelSettings>()(() => ({
    ...DEFAULT_PROPS,
    ...initProps,
  }));
};

export const BrandingStoreContext = createContext<BrandingStoreType | null>(null);

export function BrandingStoreProvider({ children, ...props }: BrandingStoreProviderProps) {
  const storeRef = useRef<BrandingStoreType>();
  if (!storeRef.current) {
    storeRef.current = createBrandingStore(props);
  }
  return <BrandingStoreContext.Provider value={storeRef.current}>{children}</BrandingStoreContext.Provider>;
}

export function useBrandingStore<T>(selector: (state: DeenruvAdminPanelSettings) => T) {
  const store = useContext(BrandingStoreContext);
  if (!store) throw new Error('Missing BrandingStoreContext.Provider in the tree');
  return useStore(store, selector);
}
