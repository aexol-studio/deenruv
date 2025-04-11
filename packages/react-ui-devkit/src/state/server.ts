import {
  ActiveAdministratorType,
  PaymentMethodsType,
  ServerConfigType,
  ChannelType,
  CountryType,
  ConfigurableOperationDefinitionType,
} from "@/selectors";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { Permission } from "@deenruv/admin-types";

import { create } from "zustand";
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
export type GraphQLSchema = {
  fieldLookup: Record<string, Record<string, string>>;
  queryType: string;
  mutationType: string;
};
interface Server {
  loaded: boolean;
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
  setLoaded: (loaded: boolean) => void;
  setPaymentMethodsType(paymentMethodsType: PaymentMethodsType[]): void;
  setFulfillmentHandlers(
    fulfillmentHandlers: ConfigurableOperationDefinitionType[]
  ): void;
  setServerConfig(serverConfig: ServerConfigType | undefined): void;
  setActiveAdministrator(
    activeAdministrator: ActiveAdministratorType | undefined
  ): void;
  setUserPermissions(permissions: Permission[]): void;
  setChannels(channels: ChannelType[]): void;
  setCountries(countries: CountryType[]): void;
  setIsConnected(isConnected: boolean): void;
  setActiveClients(activeClients: ActiveClient[]): void;
  fetchStatus: () => Promise<void>;
  fetchPendingJobs: () => Promise<void>;
  fetchGraphQLSchema: () => Promise<GraphQLSchema | null>;
  setJobQueue: (name: string, running: boolean) => void;
}

export const getSystemStatus = async () => {
  try {
    const response = await fetch(
      window.__DEENRUV_SETTINGS__.api.uri + "/health"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch system status");
    }
    const data = await response.json();
    return data as SystemStatus;
  } catch (error) {
    console.error("Error fetching system status:", error);
    return null;
  }
};

const buildQuery = (level: number): string => {
  if (level < 1) return "";
  const buildTypeField = (currentLevel: number): string => {
    if (currentLevel <= 0) return "name";

    return `
            name
            kind
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
                mutationType {
                    name
                }
                types {
                    name
                    kind
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

const typeName = (v: { name: string | null; ofType?: any }): string =>
  v && (v.name || typeName(v.ofType));

export const useServer = create<Server & Actions>()((set, get) => ({
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
    data: { status: "", info: {}, error: {}, details: {} },
    loading: false,
    lastUpdated: null,
  },
  graphQLSchema: null,
  jobQueues: [],
  loaded: false,
  setServerConfig: (serverConfig) => set({ serverConfig }),
  setActiveAdministrator: (activeAdministrator) => set({ activeAdministrator }),
  setChannels: (channels) => set({ channels }),
  setCountries: (countries) => set({ countries }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setActiveClients: (activeClients) => set({ activeClients }),
  setPaymentMethodsType: (paymentMethodsType) => set({ paymentMethodsType }),
  setFulfillmentHandlers: (fulfillmentHandlers) => set({ fulfillmentHandlers }),
  setUserPermissions: (userPermissions) => set({ userPermissions }),
  fetchStatus: async () => {
    set((state) => ({ status: { ...state.status, loading: true } }));
    const data = await getSystemStatus();
    if (!data) {
      console.error("Failed to fetch system status");
    } else {
      set(() => ({
        status: { data, lastUpdated: new Date(), loading: false },
      }));
    }
  },
  fetchPendingJobs: async () => {
    const { jobQueues } = await apiClient("query")({
      jobQueues: { name: true, running: true },
    });
    set({ jobQueues });
  },
  fetchGraphQLSchema: async () => {
    try {
      const response = await fetch(
        window.__DEENRUV_SETTINGS__.api.uri + "/admin-api",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query: buildQuery(6) }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data, errors } = (await response.json()) as {
        data: {
          __schema: {
            queryType: { name: string };
            mutationType: { name: string };
            types: {
              name: string;
              fields: { name: string; type: { name: string } }[];
            }[];
          };
        };
        errors: any;
      };
      if (errors) {
        throw new Error(errors[0]?.message || "GraphQL query failed");
      }
      if (!data?.__schema) {
        throw new Error("No schema data received");
      }
      const [fieldLookup, queryType, mutationType] = [
        data.__schema.types.reduce(
          (pv, cv) => {
            pv[cv.name] = cv.fields?.reduce(
              (pv, cv) => {
                pv[cv.name] = typeName(cv.type);
                return pv;
              },
              {} as Record<string, string>
            );
            return pv;
          },
          {} as Record<string, Record<string, string>>
        ),
        data.__schema.queryType.name,
        data.__schema.queryType.name,
      ];
      return { fieldLookup, queryType, mutationType };
    } catch (error) {
      console.error("Error fetching GraphQL schema:", error);
      set({ graphQLSchema: null });
      throw error;
    }
  },
  setJobQueue: (name, running) => {
    const { fetchPendingJobs } = get();
    set((state) => ({
      jobQueues: state.jobQueues.map((jobQueue) =>
        jobQueue.name === name ? { ...jobQueue, running } : jobQueue
      ),
    }));
    fetchPendingJobs();
  },
  setLoaded: (loaded) => set({ loaded }),
}));
