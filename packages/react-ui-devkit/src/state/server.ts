import {
    ActiveAdministratorType,
    PaymentMethodsType,
    ServerConfigType,
    ChannelType,
    CountryType,
    ConfigurableOperationDefinitionType,
} from '@/selectors';
import { apiClient } from '@/zeus_client/deenruvAPICall.js';
import { Permission } from '@deenruv/admin-types';

import { create } from 'zustand';
export type SystemStatus = {
    status: string;
    info: { [key: string]: { status: string } };
    error: Record<string, unknown>;
    details: { [key: string]: { status: string } };
};

type ActiveClient = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    location: string;
    lastActive: Date;
    me: boolean;
};

interface Server {
    paymentMethodsType: PaymentMethodsType[];
    fulfillmentHandlers: ConfigurableOperationDefinitionType[];
    serverConfig: ServerConfigType | undefined;
    activeAdministrator: ActiveAdministratorType | undefined;
    userPermissions: Permission[];
    channels: ChannelType[];
    countries: CountryType[];
    isConnected: boolean;
    activeClients: ActiveClient[];
    status: { data: SystemStatus; loading: boolean; lastUpdated: Date | null };
    pendingJobs: number;
}

interface Actions {
    setPaymentMethodsType(paymentMethodsType: PaymentMethodsType[]): void;
    setFulfillmentHandlers(fulfillmentHandlers: ConfigurableOperationDefinitionType[]): void;
    setServerConfig(serverConfig: ServerConfigType | undefined): void;
    setActiveAdministrator(activeAdministrator: ActiveAdministratorType | undefined): void;
    setUserPermissions(permissions: Permission[]): void;
    setChannels(channels: ChannelType[]): void;
    setCountries(countries: CountryType[]): void;
    setIsConnected(isConnected: boolean): void;
    setActiveClients(activeClients: ActiveClient[]): void;
    fetchStatus: () => Promise<void>;
    fetchPendingJobs: () => Promise<void>;
}

const getSystemStatus = async () => {
    try {
        const response = await fetch(window.__DEENRUV_SETTINGS__.api.uri + '/health');
        if (!response.ok) {
            throw new Error('Failed to fetch system status');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching system status:', error);
        return null;
    }
};

export const useServer = create<Server & Actions>()(set => ({
    serverConfig: undefined,
    activeAdministrator: undefined,
    channels: [],
    countries: [],
    paymentMethodsType: [],
    fulfillmentHandlers: [],
    isConnected: false,
    activeClients: [],
    userPermissions: [],
    status: {
        data: { status: '', info: {}, error: {}, details: {} },
        loading: false,
        lastUpdated: null,
    },
    pendingJobs: 0,
    setServerConfig: serverConfig => set({ serverConfig }),
    setActiveAdministrator: activeAdministrator => set({ activeAdministrator }),
    setChannels: channels => set({ channels }),
    setCountries: countries => set({ countries }),
    setIsConnected: isConnected => set({ isConnected }),
    setActiveClients: activeClients => set({ activeClients }),
    setPaymentMethodsType: paymentMethodsType => set({ paymentMethodsType }),
    setFulfillmentHandlers: fulfillmentHandlers => set({ fulfillmentHandlers }),
    setUserPermissions: userPermissions => set({ userPermissions }),
    fetchStatus: async () => {
        set(state => ({ status: { ...state.status, loading: true } }));
        const data = await getSystemStatus();
        if (!data) {
            console.error('Failed to fetch system status');
        } else {
            set(() => ({ status: { data, lastUpdated: new Date(), loading: false } }));
        }
    },
    fetchPendingJobs: async () => {
        const { jobQueues } = await apiClient('query')({ jobQueues: { name: true, running: true } });
        const activeJobs = jobQueues.reduce((acc, queue) => acc + (queue.running ? 1 : 0), 0);
        set({ pendingJobs: activeJobs });
    },
}));
