import { useSettings } from '@/state';
import { DeenruvSettingsWindowType } from '@/types';
import { GraphQLResponse, GraphQLError, Thunder, scalars, ResolverInputTypes } from '@deenruv/admin-types';

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
    }
}
type CallOptions = { type: 'standard' | 'upload' };
export const deenruvAPICall = (options?: CallOptions) => {
    return async (
        query: string,
        variables: Record<string, unknown> = {},
        customParams?: Record<string, string>,
    ) => {
        const { translationsLanguage, selectedChannel, token, logIn } = useSettings.getState();
        const { authTokenName, channelTokenName, uri } = window.__DEENRUV_SETTINGS__.api;
        const { type } = options || {};

        const defaultParams = {
            languageCode: translationsLanguage,
        };

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
