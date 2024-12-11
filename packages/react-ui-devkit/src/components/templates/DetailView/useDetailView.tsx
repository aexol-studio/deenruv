import React, { useEffect, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { createContext, useContext } from 'react';
import { LanguageCode, ValueTypes } from '@deenruv/admin-types';

import { ModelTypes } from '@deenruv/admin-types';
import { DeenruvTabs, DetailKeys, DetailLocations, ExternalDetailLocationSelector } from '@/types';
import { DetailViewMarker } from '@/components';
import { useFFLP } from '@/hooks';
import { apiClient } from '@/zeus_client/deenruvAPICall';

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
    form: {
        base: ReturnType<typeof useFFLP<Pick<ModelTypes[FORMKEY], FORMKEYS>>>;
        onSubmitted: (
            event:
                | React.FormEvent<HTMLFormElement>
                | React.MouseEvent<HTMLButtonElement, MouseEvent>
                | React.MouseEvent<HTMLDivElement>,
            data: ModelTypes[FORMKEY],
        ) => void;
        onDeleted?: (
            event:
                | React.FormEvent<HTMLFormElement>
                | React.MouseEvent<HTMLButtonElement, MouseEvent>
                | React.MouseEvent<HTMLDivElement>,
            data: ModelTypes[FORMKEY],
        ) => void;
    };
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
interface DetailViewState<
    LOCATION extends DetailKeys,
    FORMKEY extends keyof ModelTypes,
    FORMKEYS extends keyof ModelTypes[FORMKEY],
> extends DetailViewProps<LOCATION, ExternalDetailLocationSelector[LOCATION], FORMKEY, FORMKEYS> {
    onSubmit: (
        event:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>
            | React.MouseEvent<HTMLDivElement>,
    ) => void;
    onDelete: (
        event:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>
            | React.MouseEvent<HTMLDivElement>,
    ) => void;
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
    FORMKEYS extends keyof ModelTypes[FORMKEY],
>(
    initProps?: Partial<DetailViewProps<LOCATION, LOCATIONTYPE, FORMKEY, FORMKEYS>>,
) => {
    const DEFAULT_PROPS: Omit<DetailViewProps<LOCATION, LOCATIONTYPE, FORMKEY, FORMKEYS>, 'form'> = {
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

    return createStore<DetailViewState<LOCATION, FORMKEY, FORMKEYS>>((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        form: initProps?.form as DetailViewProps<LOCATION, LOCATIONTYPE, FORMKEY, FORMKEYS>['form'],
        view: {
            ...DEFAULT_PROPS.view,
            setEntity: entity => set({ view: { ...get().view, entity } }),
            // @ts-expect-error - This is a valid use case TODO: Fix this
            refetch: async () => {
                const { id, locationId } = get();
                const entityGraphQL = DetailLocations[locationId as keyof typeof DetailLocations];
                const name = (entityGraphQL['type'].charAt(0).toLowerCase() +
                    entityGraphQL['type'].slice(1)) as keyof ValueTypes['Query'];
                const selector = entityGraphQL['selector'];
                if (!id) return;

                set({ view: { ...get().view, loading: true, error: null } });
                try {
                    const query = { [name]: [{ id }, selector] } as unknown as ValueTypes['Query'];
                    const data = await apiClient('query')(query);
                    // @ts-expect-error - This is a valid use case TODO: Fix this
                    const entity = data[name] as LOCATIONTYPE;
                    if (data && data[name]) {
                        set({
                            view: {
                                ...get().view,
                                entity,
                                loading: false,
                            },
                        });
                        return data[name];
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
        onDelete: event => {
            const { onDeleted } = get().form;
            if (!onDeleted) return;
            onDeleted(event, get().form.base.state);
        },
        onSubmit: event => {
            const { onSubmitted, base } = get().form;
            onSubmitted(event, base.state);
            // TODO GLOBAL SUCCESS / ERROR HANDLING
            // console.log('SUMIS');
        },
        setSidebar: sidebar => {
            if (typeof sidebar === 'undefined') {
                set({ sidebar: initProps?.sidebar });
            } else if (sidebar === null) {
                set({ sidebar: null });
            } else {
                set({ sidebar });
            }
        },
        setActiveTab: tab => set({ tab }),
        setContentLanguage: language => set({ contentLanguage: language }),
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
    //TODO: Check if this is the correct way to create a store
    storeRef.current = createDetailViewStore(props);

    return (
        <DetailViewStoreContext.Provider value={storeRef.current}>{children}</DetailViewStoreContext.Provider>
    );
}

export function useDetailView<
    LOCATION extends DetailKeys,
    FORMKEY extends keyof ModelTypes,
    FORMKEYS extends keyof ModelTypes[FORMKEY],
    RETURNTYPE extends Partial<DetailViewState<LOCATION, FORMKEY, FORMKEYS>>,
>(
    locationId: LOCATION,
    selector: (state: DetailViewState<typeof locationId, typeof key, (typeof pick)[number]>) => RETURNTYPE,
    key: FORMKEY,
    ...pick: FORMKEYS[]
) {
    const store = useContext(DetailViewStoreContext);

    if (!store) throw new Error('Missing DetailViewStoreContext.Provider in the tree');
    // @ts-expect-error - This is a valid use case
    return useStore(store, selector);
}
