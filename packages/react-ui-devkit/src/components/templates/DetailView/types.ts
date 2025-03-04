import type { useFFLP } from '@/hooks';
import { ServerConfigType } from '@/selectors/BaseSelectors.js';
import type { DeenruvTabs, DetailKeys, ExternalDetailLocationSelector } from '@/types';
import type { ModelTypes } from '@deenruv/admin-types';

export type FormKey = keyof ModelTypes;
export type FormKeys = keyof ModelTypes['Query'];
export type EntityType = ExternalDetailLocationSelector[DetailKeys];
export type PropsType<
    T extends DetailKeys,
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
> = DetailViewProviderProps<T, F, FK>;

export interface FormType<F extends keyof ModelTypes, FK extends keyof ModelTypes[F]> {
    base: ReturnType<typeof useFFLP<Pick<ModelTypes[F], FK>>>;
    onSubmitted: (data: ModelTypes[FormKey]) => Promise<Record<string, unknown>> | undefined;
    onDeleted?: (data: ModelTypes[FormKey]) => Promise<Record<string, unknown>> | undefined;
}

export interface StoreContextType<
    T extends DetailKeys,
    E extends ExternalDetailLocationSelector[T],
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
> {
    id?: string | null;
    loading: boolean;
    entity: E | null;
    error: string;
    tab: string;
    tabs: Array<{
        name: string;
        label: string;
        component: React.ReactNode;
        hideSidebar?: boolean;
        sidebarReplacement?: React.ReactNode;
        disabled?: boolean;
    }>;
    form: FormType<F, FK>;
    sidebar?: React.ReactNode;
    actionHandler: (type: 'submit' | 'delete') => void;
    fetchEntity: () => Promise<E | undefined | null>;
    setEntity: (entity: E | null) => void;
    setSidebar: (sidebar: React.ReactNode) => void;
    setActiveTab: (tab: string) => void;
    getMarker: () => React.ReactNode;
    hasUnsavedChanges: boolean;
}

export interface DetailViewProps<
    T extends DetailKeys,
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
> {
    id?: string;
    locationId: T;
    main: {
        name: string;
        label: string;
        component: React.ReactNode;
        sidebar?: React.ReactNode;
        form: FormType<F, FK>;
    };
    defaultTabs?: Array<{
        label: string;
        name: string;
        component: React.ReactNode;
        hideSidebar?: boolean;
        sidebarReplacement?: React.ReactNode;
    }>;
}

export interface DetailViewProviderProps<
    T extends DetailKeys,
    F extends keyof ModelTypes,
    FK extends keyof ModelTypes[F],
> {
    id?: string | null;
    form: FormType<F, FK>;
    locationId?: T;
    tab: string;
    sidebar?: React.ReactNode;
    tabs: Omit<DeenruvTabs<T>, 'id'>[];
}
