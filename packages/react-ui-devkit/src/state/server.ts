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

export type JobQueue = { name: string; running: boolean };

type ActiveClient = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    location: string;
    lastActive: Date;
    me: boolean;
};

type GraphQLSchemaFieldBase = {
    name: string;
    type: string;
};
export type GraphQLSchemaField = GraphQLSchemaFieldBase & {
    fields: GraphQLSchemaField[];
    description: string;
};
export type GraphQLSchema = Map<string, GraphQLSchemaField>;
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
    graphQLSchema: GraphQLSchema | null;
    jobQueues: Array<JobQueue>;
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
    fetchGraphQLSchema: () => Promise<GraphQLSchema | null>;
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

const buildQuery = (level: number): string => {
    if (level < 1) return '';
    const buildTypeField = (currentLevel: number): string => {
        if (currentLevel <= 0) return 'name';

        return `
            name
            ofType {
                ${buildTypeField(currentLevel - 1)}
            }
        `;
    };
    return `
        query IntrospectionQuery {
            __schema {
                queryType {
                    name
                }
                types {
                    name
                    fields {
                        name
                        type {
                            ${buildTypeField(level)}
                        }
                    }
                }
            }
        }
    `;
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
    graphQLSchema: null,
    jobQueues: [],
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
        set({ jobQueues });
    },
    fetchGraphQLSchema: async () => {
        try {
            const response = await fetch(window.__DEENRUV_SETTINGS__.api.uri + '/admin-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ query: buildQuery(6) }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data, errors } = await response.json();
            if (errors) {
                throw new Error(errors[0]?.message || 'GraphQL query failed');
            }
            if (!data?.__schema) {
                throw new Error('No schema data received');
            }
            const graphQLSchema = new Map<string, GraphQLSchemaField>();
            bindSchema(graphQLSchema, data.__schema);
            set({ graphQLSchema });
            return graphQLSchema;
        } catch (error) {
            console.error('Error fetching GraphQL schema:', error);
            set({ graphQLSchema: null });
            throw error;
        }
    },
}));

const bindSchema = (
    schema: GraphQLSchema,
    fetched: { types: { name: string; fields: { name: string; type: { name: string } }[] }[] },
) => {
    const processingStack = new Set<string>();
    const getFields = (
        typeObj: { name: string | null; ofType?: any } | null,
        depth = 0,
        visited = new Set<string>(),
    ): GraphQLSchemaField[] => {
        if (!typeObj || depth > 3) return [];

        let finalType = typeObj;
        let typeWrapper = '';
        while (finalType.ofType) {
            if (finalType.name === 'List') typeWrapper += '[';
            if (finalType.name === 'NonNull') typeWrapper += '!';
            finalType = finalType.ofType;
        }
        typeWrapper = typeWrapper
            .split('')
            .map(() => ']')
            .join('');
        const typeName = finalType.name || 'UnknownType';

        if (visited.has(typeName)) return [];
        if (processingStack.has(typeName)) return [];
        if (typeName.startsWith('__')) return [];
        visited.add(typeName);
        processingStack.add(typeName);
        const type = fetched.types.find(t => t.name === typeName);
        if (!type?.fields?.length) {
            processingStack.delete(typeName);
            return [];
        }
        const fields = type.fields.map(field => {
            let finalFieldType = field.type as any;
            let fieldTypeWrapper = '';
            while (finalFieldType.ofType) {
                if (finalFieldType.name === 'List') fieldTypeWrapper += '[';
                if (finalFieldType.name === 'NonNull') fieldTypeWrapper += '!';
                finalFieldType = finalFieldType.ofType;
            }
            fieldTypeWrapper = fieldTypeWrapper
                .split('')
                .map(() => ']')
                .join('');
            const fieldType = finalFieldType.name || 'UnknownType';

            return {
                name: field.name,
                type: fieldType,
                fields: getFields(field.type, depth + 1, new Set(visited)),
                description: `Field: ${field.name}`,
            };
        });
        processingStack.delete(typeName);
        return fields;
    };

    const queries = fetched.types.find(({ name }) => name === 'Query')?.fields || [];
    queries.forEach(query => {
        schema.set(query.name, {
            type: 'Query',
            description: `Query: ${query.name}`,
            name: query.name,
            fields: getFields(query.type),
        });
    });
    // fetched.types.forEach(type => {
    //     if (type.name && !type.name.startsWith('__')) {
    //         schema.set(`Type:${type.name}`, {
    //             fields: getFields({ name: type.name }),
    //             description: `Type: ${type.name}`,
    //         });
    //     }
    // });
};
