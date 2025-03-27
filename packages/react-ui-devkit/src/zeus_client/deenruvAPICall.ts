import { GraphQLSchema, GraphQLSchemaField, useSettings } from '@/state';
import { DeenruvSettingsWindowType } from '@/types';
import { GraphQLResponse, GraphQLError, Thunder, scalars, ResolverInputTypes } from '@deenruv/admin-types';
import { parse, print, visit } from 'graphql';

// * We can think about caching the response in the future
// ! TODO: Add pattern of authToken from dashboard so we need `useSettings` here
// const MINUTE = 1000 * 60;
// export const cache = new LRUCache({
//     ttl: MINUTE * 0.5,
//     ttlAutopurge: true,
// });

declare global {
    interface Window {
        __DEENRUV_SETTINGS__: DeenruvSettingsWindowType;
        __DEENRUV_SCHEMA__: GraphQLSchema | null;
    }
}
type CallOptions = { type: 'standard' | 'upload' };
const CUSTOM_MAP = {
    Administrator: ['id'],
    Channel: ['id'],
    Collection: ['id'],
    Country: ['id'],
    Facet: ['id'],
    Asset: ['id', 'source', 'preview'],
    PaymentMethod: ['id'],
    Job: ['id'],
    Product: ['id', 'name', 'slug', 'description'],
    ProductVariant: ['id', 'sku'],
};
const buildSelectionSet = (lookup: string, depth: number): any => {
    if (depth) {
        const selections = Object.entries(window.__DEENRUV_SCHEMA__?.fieldLookup[lookup] || {})
            .map(([field, tp]) => {
                const selectionSet = buildSelectionSet(tp, depth - 1);
                if (!window.__DEENRUV_SCHEMA__?.fieldLookup[tp] || selectionSet?.selections.length) {
                    const selections = CUSTOM_MAP[tp as keyof typeof CUSTOM_MAP]?.map(field => ({
                        kind: 'Field',
                        name: { kind: 'Name', value: field },
                    }));
                    return {
                        kind: 'Field',
                        name: { kind: 'Name', value: field },
                        selectionSet: selections?.length ? { ...selectionSet, selections } : selectionSet,
                    };
                }
            })
            .filter(v => v !== undefined);
        if (selections.length) return { kind: 'SelectionSet', selections };
    }
};
const findType = (rootType: string, path: string[]) =>
    path.reduce((pv, cv) => window.__DEENRUV_SCHEMA__?.fieldLookup[pv]?.[cv]!, rootType);

const addCustomQuery = (query: string) => {
    if (!window.__DEENRUV_SCHEMA__) return query;
    const { mutationType, queryType, fieldLookup } = window.__DEENRUV_SCHEMA__;
    const ast = parse(query);
    const path: string[] = [];
    let operation = '';

    const result = visit(ast, {
        OperationDefinition: {
            enter(node) {
                operation = node.operation;
            },
        },
        Field: {
            enter(node) {
                path.push(node.name.value);
                const type = findType(operation === 'query' ? queryType : mutationType, path);
                const fields = fieldLookup[type];
                if (fields && 'customFields' in fields && !path.includes('customFields')) {
                    const selectionSet = buildSelectionSet(fields['customFields'], 3);
                    if (selectionSet) {
                        return {
                            ...node,
                            selectionSet: {
                                ...node.selectionSet,
                                selections: [
                                    ...(node.selectionSet?.selections || []),
                                    {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: 'customFields' },
                                        selectionSet,
                                    },
                                ],
                            },
                        };
                    }
                }
                return node;
            },
            leave(node) {
                path.pop();
                return node;
            },
        },
    });
    return print(result);
};

export const deenruvAPICall = (options?: CallOptions) => {
    return async (
        _query: string,
        variables: Record<string, unknown> = {},
        customParams?: Record<string, string>,
    ) => {
        const query = addCustomQuery(_query);
        const { translationsLanguage, selectedChannel, token, logIn } = useSettings.getState();
        const { authTokenName, channelTokenName, uri } = window.__DEENRUV_SETTINGS__.api;
        const { type } = options || {};
        const defaultParams = { languageCode: translationsLanguage };
        const params = new URLSearchParams(customParams || defaultParams).toString();

        let body: RequestInit['body'];

        const headers: Record<string, string> = token
            ? {
                  Authorization: `Bearer ${token}`,
                  ...(selectedChannel?.token && { [channelTokenName]: selectedChannel.token }),
              }
            : {};

        if (type === 'upload') {
            const formData = new FormData();
            formData.append('operations', JSON.stringify({ query: _query, variables }));
            const mapData: Record<string, string[]> = {};
            const files = variables.input as ResolverInputTypes['CreateAssetInput'][];
            files.forEach((_, index) => {
                mapData[(index + 1).toString()] = ['variables.input.' + index + '.file'];
            });
            formData.append('map', JSON.stringify(mapData));
            files.forEach((item, index) => {
                formData.append((index + 1).toString(), item.file as Blob);
            });
            body = formData;
        }

        if (!type || type === 'standard') {
            body = JSON.stringify({ query, variables });
            headers['Content-Type'] = 'application/json';
        }

        const url = `${uri}/admin-api?${params}`;
        return fetch(url, {
            body,
            headers,
            method: 'POST',
            credentials: 'include',
        })
            .then(response => {
                const authToken = response.headers.get(authTokenName);
                if (authToken !== null) logIn(authToken);
                if (!response.ok) {
                    return new Promise((_, reject) => {
                        response
                            .text()
                            .then(text => {
                                try {
                                    reject(JSON.parse(text));
                                } catch {
                                    reject(text);
                                }
                            })
                            .catch(reject);
                    }) as Promise<GraphQLResponse>;
                }
                return response.json() as Promise<GraphQLResponse>;
            })
            .then((response: GraphQLResponse) => {
                if (response.errors) {
                    const shouldLogout = response.errors.some(
                        (e: any) => 'extensions' in e && e.extensions.code === 'FORBIDDEN',
                    );
                    if (shouldLogout) {
                        useSettings.getState().logOut();
                        return response.data;
                    }
                    throw new GraphQLError(response);
                }
                return response.data;
            });
    };
};

export const apiClient = Thunder(deenruvAPICall({ type: 'standard' }), { scalars });
export const apiUploadClient = Thunder(deenruvAPICall({ type: 'upload' }), { scalars });
