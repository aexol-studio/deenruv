import { GraphQLSchema, GraphQLSchemaField, useSettings } from '@/state';
import { DeenruvSettingsWindowType } from '@/types';
import { GraphQLResponse, GraphQLError, Thunder, scalars, ResolverInputTypes } from '@deenruv/admin-types';
import {
    parse,
    print,
    visit,
    DocumentNode,
    FieldNode,
    SelectionSetNode,
    Kind,
    SelectionNode,
    ASTNode,
} from 'graphql';

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
    Asset: ['id', 'source', 'preview'],
    PaymentMethod: ['id'],
};

const processSelections = (selections: readonly SelectionNode[], parentQuery: GraphQLSchemaField): any => {
    return selections.map(selection => {
        if (selection.kind !== 'Field') return selection;
        const founded = parentQuery.fields.find(field => field.name === selection.name.value);
        if (!founded) return selection;
        const nestedSelections =
            selection.selectionSet?.selections &&
            processSelections(selection.selectionSet.selections, founded);
        const updatedSelection = {
            ...selection,
            selectionSet: nestedSelections
                ? { kind: 'SelectionSet', selections: nestedSelections }
                : undefined,
        };
        const foundedCustomFields = founded.fields?.find(
            field => field.name === 'customFields' && field.type !== 'JSON',
        );

        if (foundedCustomFields && foundedCustomFields.fields.length) {
            updatedSelection.selectionSet = {
                kind: 'SelectionSet',
                selections: [
                    ...(updatedSelection.selectionSet?.selections || []),
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'customFields' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: foundedCustomFields.fields.map(field => {
                                if (field?.fields?.length || Object.keys(CUSTOM_MAP).includes(field.type)) {
                                    const fields =
                                        CUSTOM_MAP[field.type as keyof typeof CUSTOM_MAP] ||
                                        field.fields.map(field => field.name);
                                    const index = fields.indexOf('customFields');
                                    if (index > -1) fields.splice(index, 1);
                                    return {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: field.name },
                                        selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: fields.map(field => ({
                                                kind: 'Field',
                                                name: { kind: 'Name', value: field },
                                            })),
                                        },
                                    };
                                } else return { kind: 'Field', name: { kind: 'Name', value: field.name } };
                            }),
                        },
                    },
                ],
            };
        }
        return updatedSelection;
    });
};

const modifyQuery = (query: string, variables: Record<string, unknown>) => {
    const ast: DocumentNode = parse(query);
    const schema = window.__DEENRUV_SCHEMA__;
    if (!schema) return { query, variables };
    const result = visit(ast, {
        Field: {
            enter(node) {
                const data = schema.get(node.name.value);
                if (!data) return node;
                const selections = processSelections(node.selectionSet?.selections || [], data);
                const haveCustomFields = data.fields.find(field => field.name === 'customFields');
                if (
                    data.fields.length &&
                    haveCustomFields &&
                    haveCustomFields.type !== 'JSON' &&
                    haveCustomFields.fields.length
                ) {
                    selections.push({
                        kind: 'Field',
                        name: { kind: 'Name', value: 'customFields' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: data.fields
                                .find(field => field.name === 'customFields')
                                ?.fields.map(field => {
                                    if (
                                        field?.fields?.length ||
                                        Object.keys(CUSTOM_MAP).includes(field.type)
                                    ) {
                                        const fields =
                                            CUSTOM_MAP[field.type as keyof typeof CUSTOM_MAP] ||
                                            field.fields.map(field => field.name);
                                        const index = fields.indexOf('customFields');
                                        if (index > -1) fields.splice(index, 1);
                                        return {
                                            kind: 'Field',
                                            name: { kind: 'Name', value: field.name },
                                            selectionSet: {
                                                kind: 'SelectionSet',
                                                selections: fields.map(field => ({
                                                    kind: 'Field',
                                                    name: { kind: 'Name', value: field },
                                                })),
                                            },
                                        };
                                    }
                                    return {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: field.name },
                                    };
                                }),
                        },
                    });
                }

                return { ...node, selectionSet: { kind: 'SelectionSet', selections } };
            },
        },
    });
    return { query: print(result), variables };
};

export const deenruvAPICall = (options?: CallOptions) => {
    return async (
        _query: string,
        _variables: Record<string, unknown> = {},
        customParams?: Record<string, string>,
    ) => {
        const { query, variables } = modifyQuery(_query, _variables);
        console.log(query);
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
            formData.append('operations', JSON.stringify({ query: _query, variables: _variables }));
            const mapData: Record<string, string[]> = {};
            const files = _variables.input as ResolverInputTypes['CreateAssetInput'][];
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
