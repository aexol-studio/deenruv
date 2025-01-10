import React, { useCallback, useState } from 'react';
import { createContext, useContext } from 'react';
import { DeletionResult, ModelTypes, ValueTypes } from '@deenruv/admin-types';

import { type DetailKeys, DetailLocations, type ExternalDetailLocationSelector } from '@/types';
import { DetailViewMarker } from '@/components';
import { apiClient } from '@/zeus_client/deenruvAPICall';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { GraphQLError } from 'graphql';
import type { EntityType, PropsType, StoreContextType } from './types';

const handleError = (resp: { response: { errors: GraphQLError[] } }) => {
    const code = resp.response?.errors?.[0]?.extensions.code as string;
    const message = code
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/^\w/, (c: string) => c.toUpperCase());

    toast.error(message || 'There was an error', { closeButton: false });
};

export const DetailViewStoreContext = createContext<
    StoreContextType<
        DetailKeys,
        ExternalDetailLocationSelector[DetailKeys],
        keyof ModelTypes,
        keyof ModelTypes[keyof ModelTypes]
    >
>({
    loading: false,
    entity: null,
    error: '',
    tab: '',
    tabs: [],
    form: {
        base: {
            state: {},
            setField: () => {},
            checkIfAllFieldsAreValid: () => true,
            clearErrors: () => {},
            haveValidFields: true,
            setState: () => {},
        },
        onSubmitted: () => Promise.resolve({}),
        onDeleted: () => Promise.resolve({}),
    },
    actionHandler: () => {},
    fetchEntity: async () => null,
    setEntity: () => {},
    setSidebar: () => {},
    setActiveTab: () => {},
    getMarker: () => null,
});

export const DetailViewStoreProvider = <
    T extends DetailKeys,
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
>({
    children,
    ...props
}: React.PropsWithChildren<PropsType<T, F, FK>>) => {
    const { form, id, locationId, sidebar: _sidebar, tabs, tab: _tab } = props;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState<EntityType | null>(null);
    const [error, setError] = useState('');
    const [tab, setTab] = useState(_tab);
    const [sidebar, _setSidebar] = useState(_sidebar);

    const handleSuccess = useCallback(
        (resp: Record<string, unknown>) => {
            const [mutationName] = Object.keys(resp);

            if (mutationName.startsWith('delete') && Array.isArray(resp)) {
                const result = Object.values(resp)[0].result;

                if (result !== DeletionResult.DELETED) {
                    toast.warning(Object.values(resp)[0].message, { closeButton: false });
                    return;
                }
            }

            const string = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
            const message = `${string.replace(/([A-Z])/g, ' $1').trim()} - Success`;
            const listPath = location.pathname.replace(/\/[^/]+$/, '');

            if (mutationName.startsWith('create') || mutationName.startsWith('delete')) {
                navigate(listPath);
            }

            toast.success(message, { closeButton: false });
        },
        [navigate],
    );

    const actionHandler = useCallback(
        (type: 'submit' | 'delete') => {
            const { onDeleted, onSubmitted, base } = form || {};

            if (type === 'submit') onSubmitted?.(base?.state)?.then(handleSuccess).catch(handleError);
            if (type === 'delete') onDeleted?.(base?.state)?.then(handleSuccess).catch(handleError);
        },
        [props.form, handleSuccess],
    );

    const setSidebar = useCallback(
        (sidebar: React.ReactNode) => {
            if (typeof sidebar === 'undefined') {
                _setSidebar(sidebar);
            } else if (sidebar === null) {
                _setSidebar(null);
            } else {
                _setSidebar(sidebar);
            }
        },
        [props.form, handleSuccess],
    );

    const getMarker = () => {
        if (!locationId) return null;
        return <DetailViewMarker position={locationId} />;
    };

    const fetchEntity = async () => {
        const entityGraphQL = DetailLocations[locationId as keyof typeof DetailLocations];
        const name = (entityGraphQL['type'].charAt(0).toLowerCase() +
            entityGraphQL['type'].slice(1)) as keyof ValueTypes['Query'];
        const selector = entityGraphQL['selector'];
        if (!id) return;

        setLoading(true);
        try {
            const query = { [name]: [{ id }, selector] } as unknown as ValueTypes['Query'];
            const data = await apiClient('query')(query);
            const entity = data[name] as EntityType;
            if (data && data[name]) {
                setEntity(entity);
                return entity;
            } else {
                setEntity(null);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DetailViewStoreContext.Provider
            value={{
                id,
                form,
                loading,
                entity,
                error,
                tab,
                sidebar,
                tabs,
                actionHandler,
                fetchEntity,
                setEntity,
                setSidebar,
                setActiveTab: setTab,
                getMarker,
            }}
        >
            {children}
        </DetailViewStoreContext.Provider>
    );
};

export function useDetailView<
    T extends DetailKeys,
    E extends ExternalDetailLocationSelector[T],
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
>(_type?: T, _key?: F, ..._pick: FK[]): StoreContextType<T, E, F, FK> {
    const ctx = useContext(DetailViewStoreContext);
    if (!ctx) throw new Error('Missing DetailViewStoreContext.Provider in the tree');

    //@ts-expect-error can't avoid this error...
    return ctx;
}
