import React, { useEffect, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { LanguageCode, ValueTypes } from '@deenruv/admin-types';
import {
  DeenruvTabs,
  DetailKeys,
  DetailLocations,
  DetailViewMarker,
  ExternalDetailLocationSelector,
} from '@deenruv/react-ui-devkit';
import { adminApiQuery } from '@/graphql/client';
import { ModelTypes } from '@deenruv/admin-types';
import { useFFLP } from '@/lists/useGflp';

interface DetailViewProps<
  LOCATION extends DetailKeys,
  LOCATIONTYPE extends ExternalDetailLocationSelector[LOCATION],
  FORMKEY extends keyof ModelTypes,
  FORMKEYS extends keyof ModelTypes[FORMKEY],
> {
  id: string;
  locationId?: LOCATION;
  tab: string;
  sidebar?: React.ReactNode;
  tabs: Omit<DeenruvTabs<LOCATION>, 'id'>[];
  contentLanguage: LanguageCode;
  form: ReturnType<typeof useFFLP<Pick<ModelTypes[FORMKEY], FORMKEYS>>>;
  formKey?: FORMKEY;
  formKeys?: FORMKEYS[];
  view: {
    entity: LOCATIONTYPE | null;
    setEntity: (entity: LOCATIONTYPE) => void;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<LOCATIONTYPE | undefined>;
  };
}
interface DetailViewState<T extends DetailKeys, E extends keyof ModelTypes>
  extends DetailViewProps<T, ExternalDetailLocationSelector[T], E, keyof ModelTypes[E]> {
  setContentLanguage: (language: LanguageCode) => void;
  setActiveTab: (tab: string) => void;
  getMarker: () => React.ReactNode | null;
  setSidebar: (sidebar: React.ReactNode | undefined | null) => void;
}

type DetailViewStoreType = ReturnType<typeof createDetailViewStore>;

const createDetailViewStore = <
  LOCATION extends DetailKeys,
  LOCATIONTYPE extends ExternalDetailLocationSelector[LOCATION],
  FORMKEY extends keyof ModelTypes,
>(
  initProps?: Partial<DetailViewProps<LOCATION, LOCATIONTYPE, FORMKEY, keyof ModelTypes[FORMKEY]>>,
) => {
  const DEFAULT_PROPS: Omit<DetailViewProps<LOCATION, LOCATIONTYPE, FORMKEY, keyof ModelTypes[FORMKEY]>, 'form'> = {
    id: '',
    contentLanguage: LanguageCode.en,
    tab: '',
    tabs: [],
    view: {
      entity: null,
      loading: false,
      error: null,
      refetch: async () => undefined,
      setEntity: () => undefined,
    },
  };
  return createStore<DetailViewState<LOCATION, FORMKEY>>((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    form: initProps?.form as ReturnType<typeof useFFLP<Pick<ModelTypes[FORMKEY], keyof ModelTypes[FORMKEY]>>>,
    view: {
      ...DEFAULT_PROPS.view,
      setEntity: (entity) => set({ view: { ...get().view, entity } }),
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
            set({ view: { ...get().view, entity: data[name] as LOCATIONTYPE, loading: false } });
            return data[name] as LOCATIONTYPE;
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
    setSidebar: (sidebar) => {
      if (typeof sidebar === 'undefined') {
        set({ sidebar: initProps?.sidebar });
      } else if (sidebar === null) {
        set({ sidebar: null });
      } else {
        set({ sidebar });
      }
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
  Partial<
    DetailViewProps<
      DetailKeys,
      ExternalDetailLocationSelector[DetailKeys],
      keyof ModelTypes,
      keyof ModelTypes[keyof ModelTypes]
    >
  >
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

export function useDetailViewStore<
  LOCATION extends DetailKeys,
  FORMKEY extends keyof ModelTypes,
  RETURNTYPE extends Partial<DetailViewState<LOCATION, FORMKEY>>,
>(
  formKey: keyof ModelTypes,
  locationId: keyof typeof DetailLocations,
  selector: (state: DetailViewState<typeof locationId, typeof formKey>) => RETURNTYPE,
) {
  const store = useContext(DetailViewStoreContext);
  if (!store) throw new Error('Missing DetailViewStoreContext.Provider in the tree');
  return useStore(store, selector);
}
