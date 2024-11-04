import React, { useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { DeenruvAdminPanelSettings } from '@/type';

type BrandingStoreProps = DeenruvAdminPanelSettings;
type BrandingStoreProviderProps = React.PropsWithChildren<BrandingStoreProps>;

type BrandingStoreType = ReturnType<typeof createBrandingStore>;

const createBrandingStore = (initProps?: Partial<BrandingStoreProps>) => {
  const DEFAULT_PROPS: BrandingStoreProps = {
    branding: { name: 'Deenruv' },
  };
  return createStore<BrandingStoreProps>()(() => ({
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

export function useBrandingStore<T>(selector: (state: BrandingStoreProps) => T) {
  const store = useContext(BrandingStoreContext);
  if (!store) throw new Error('Missing BrandingStoreContext.Provider in the tree');
  return useStore(store, selector);
}
