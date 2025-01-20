import {
    ActiveAdministratorType,
    PaymentMethodsType,
    ServerConfigType,
    ChannelType,
    CountryType,
    ConfigurableOperationDefinitionType,
} from '@/selectors';
import { Permission } from '@deenruv/admin-types';

import { create } from 'zustand';

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
}

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
    setServerConfig: serverConfig => set({ serverConfig }),
    setActiveAdministrator: activeAdministrator => set({ activeAdministrator }),
    setChannels: channels => set({ channels }),
    setCountries: countries => set({ countries }),
    setIsConnected: isConnected => set({ isConnected }),
    setActiveClients: activeClients => set({ activeClients }),
    setPaymentMethodsType: paymentMethodsType => set({ paymentMethodsType }),
    setFulfillmentHandlers: fulfillmentHandlers => set({ fulfillmentHandlers }),
    setUserPermissions: userPermissions => set ({userPermissions})
}));
