import React, { useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { LanguageCode } from '@deenruv/admin-types';
import { DetailLocationID, DetailViewMarker, usePluginStore } from '@deenruv/react-ui-devkit';

interface DetailViewProps {
  id: string;
  locationId?: DetailLocationID;
  tab: string;
  tabs: { name: string; component: React.ReactNode; disabled?: boolean }[];
  contentLanguage: LanguageCode;
}
interface DetailViewState extends DetailViewProps {
  setContentLanguage: (language: LanguageCode) => void;
  setActiveTab: (tab: string) => void;
  getMarker: () => React.ReactNode | null;
}

type DetailViewStoreType = ReturnType<typeof createDetailViewStore>;

const createDetailViewStore = (initProps?: Partial<DetailViewProps>) => {
  const DEFAULT_PROPS: DetailViewProps = {
    id: '',
    contentLanguage: LanguageCode.en,
    tab: '',
    tabs: [],
  };
  return createStore<DetailViewState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setActiveTab: (tab) => set({ tab }),
    setContentLanguage: (language) => set({ contentLanguage: language }),
    getMarker: () => {
      const position = get().locationId;
      if (!position) return null;
      return <DetailViewMarker position={position} />;
    },
  }));
};

export const DetailViewStoreContext = createContext<DetailViewStoreType | null>(null);

export function DetailViewStoreProvider({ children, ...props }: React.PropsWithChildren<Partial<DetailViewProps>>) {
  const storeRef = useRef<DetailViewStoreType>();
  if (!storeRef.current) {
    storeRef.current = createDetailViewStore(props);
  }
  return <DetailViewStoreContext.Provider value={storeRef.current}>{children}</DetailViewStoreContext.Provider>;
}

export function useDetailViewStore<T>(selector: (state: DetailViewState) => T) {
  const store = useContext(DetailViewStoreContext);
  if (!store) throw new Error('Missing DetailViewStoreContext.Provider in the tree');
  return useStore(store, selector);
}
