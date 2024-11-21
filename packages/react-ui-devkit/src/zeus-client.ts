import {
    Chain,
    GraphQLError,
    GraphQLResponse,
    ResolverInputTypes,
    Thunder,
    chainOptions,
    fetchOptions,
} from '@deenruv/admin-types';
import type { DeenruvSettingsWindowType } from './types/types';
declare global {
    interface Window {
        __DEENRUV_SETTINGS__: DeenruvSettingsWindowType;
    }
}

const ADMIN_API_URL = '/admin-api';
const client = Chain(ADMIN_API_URL, { credentials: 'include' });

const uploadFileApi =
    (options: fetchOptions) =>
    async (query: string, variables: Record<string, unknown> = {}) => {
        const fetchOptions = options[1] || {};
        if (fetchOptions.method && fetchOptions?.method === 'GET') {
            return;
        }

        const formData = new FormData();
        formData.append('operations', JSON.stringify({ query, variables }));
        const mapData: Record<string, string[]> = {};
        const files = variables.input as ResolverInputTypes['CreateAssetInput'][];
        files.forEach((_, index) => {
            mapData[(index + 1).toString()] = ['variables.input.' + index + '.file'];
        });
        formData.append('map', JSON.stringify(mapData));
        files.forEach((item, index) => {
            formData.append((index + 1).toString(), item.file as Blob);
        });

        return fetch(`${options[0]}`, {
            body: formData,
            method: 'POST',
            credentials: 'include',
            ...fetchOptions,
        })
            .then(r => {
                return handleFetchResponse(r);
            })
            .then((response: GraphQLResponse) => {
                if (response.errors) {
                    throw new GraphQLError(response);
                }
                return response.data;
            });
    };

const VendureUploadChain = (...options: chainOptions) => Thunder(uploadFileApi(options));

const uploadClient = VendureUploadChain(ADMIN_API_URL, { credentials: 'include' });

const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
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
        });
    }
    return response.json() as Promise<GraphQLResponse>;
};

export { client, uploadClient, ADMIN_API_URL };
