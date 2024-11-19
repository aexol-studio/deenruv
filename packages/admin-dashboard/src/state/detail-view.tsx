import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { LanguageCode, ValueTypes } from '@deenruv/admin-types';
import {
  DetailLocationID,
  DetailLocations,
  DetailViewMarker,
  ExternalDetailLocationSelector,
  usePluginStore,
} from '@deenruv/react-ui-devkit';
import { adminApiQuery } from '@/graphql/client';

interface DetailViewProps<T extends DetailLocationID, E extends ExternalDetailLocationSelector[T]> {
  id: string;
  locationId?: T;
  tab: string;
  tabs: { name: string; component: React.ReactNode; disabled?: boolean }[];
  contentLanguage: LanguageCode;
  sidebar: React.ReactNode | null;
  generateSideBar: (sidebar: React.ReactNode) => React.ReactNode;
  view: {
    entity: E | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<E | undefined>;
  };
}
interface DetailViewState extends DetailViewProps<DetailLocationID, ExternalDetailLocationSelector[DetailLocationID]> {
  setContentLanguage: (language: LanguageCode) => void;
  setActiveTab: (tab: string) => void;
  getMarker: () => React.ReactNode | null;
}

type DetailViewStoreType = ReturnType<typeof createDetailViewStore>;

const createDetailViewStore = <T extends DetailLocationID, E extends ExternalDetailLocationSelector[T]>(
  initProps?: Partial<DetailViewProps<T, E>>,
) => {
  const DEFAULT_PROPS: DetailViewProps<T, E> = {
    id: '',
    contentLanguage: LanguageCode.en,
    tab: '',
    tabs: [],
    sidebar: null,
    generateSideBar: (sidebar) => sidebar,
    view: {
      entity: null,
      loading: false,
      error: null,
      refetch: async () => undefined,
    },
  };
  return createStore<DetailViewState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    generateSideBar: (sidebar) => {
      if (get().sidebar) return <React.Fragment />;
      set({ sidebar });
      return <React.Fragment />;
    },
    view: {
      ...DEFAULT_PROPS.view,
      refetch: async () => {
        const { id, locationId } = get();
        const entityGraphQL = DetailLocations[locationId as keyof typeof DetailLocations];
        const name = entityGraphQL['type'].toLowerCase() as keyof ValueTypes['Query'];
        const selector = entityGraphQL['selector'];
        if (!id) return;

        set({ view: { ...get().view, loading: true, error: null } });
        try {
          const query = { [name]: [{ id }, selector] } as unknown as ValueTypes['Query'];
          const data = await adminApiQuery(query);
          if (data && data[name]) {
            set({ view: { ...get().view, entity: data[name] as E, loading: false } });
            return data[name] as E;
          } else {
            set({ view: { ...get().view, entity: null, loading: false } });
          }
        } catch (error) {
          set({
            view: {
              ...get().view,
              error: error instanceof Error ? error.message : 'An unknown error occurred.',
              loading: false,
              entity: null,
            },
          });
        } finally {
          set({ view: { ...get().view, loading: false } });
        }
      },
    },
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

export function DetailViewStoreProvider({
  children,
  ...props
}: React.PropsWithChildren<
  Partial<DetailViewProps<DetailLocationID, ExternalDetailLocationSelector[DetailLocationID]>>
>) {
  const storeRef = useRef<DetailViewStoreType>();
  if (!storeRef.current) {
    storeRef.current = createDetailViewStore(props);
  }

  useEffect(() => {
    if (!props.id || !storeRef.current) return;
    storeRef.current?.getState().view.refetch();
  }, [storeRef.current, props.id]);

  return <DetailViewStoreContext.Provider value={storeRef.current}>{children}</DetailViewStoreContext.Provider>;
}

export function useDetailViewStore<T>(selector: (state: DetailViewState) => T) {
  const store = useContext(DetailViewStoreContext);
  if (!store) throw new Error('Missing DetailViewStoreContext.Provider in the tree');
  return useStore(store, selector);
}
