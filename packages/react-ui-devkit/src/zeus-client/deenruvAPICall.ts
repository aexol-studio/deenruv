import { useSettings } from '@/state';
import { GraphQLResponse, GraphQLError, fetchOptions } from '@deenruv/admin-types';

// * We can think about caching the response in the future
// ! TODO: Add pattern of authToken from dashboard so we need `useSettings` here
// const MINUTE = 1000 * 60;
// export const cache = new LRUCache({
//     ttl: MINUTE * 0.5,
//     ttlAutopurge: true,
// });

export const deenruvAPICall = () => {
    return async (query: string, variables: Record<string, unknown> = {}) => {
        const { language, selectedChannel, token, logIn } = useSettings.getState();
        const { authTokenName, channelTokenName, uri } = window.__DEENRUV_SETTINGS__.api;
        const url = `${uri}/admin-api?languageCode=${language}`;
        console.log(token);
        const additionalHeaders: Record<string, string> = token
            ? {
                  Authorization: `Bearer ${token}`,
                  ...(selectedChannel?.token && { [channelTokenName]: selectedChannel.token }),
              }
            : {};
        return fetch(url, {
            body: JSON.stringify({ query, variables }),
            method: 'POST',
            credentials: 'include',
            headers: {
                ...additionalHeaders,
                'Content-Type': 'application/json',
            },
        })
            .then(r => {
                const authToken = r.headers.get(authTokenName);
                if (authToken !== null) logIn(authToken);
                return handleFetchResponse(r);
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
