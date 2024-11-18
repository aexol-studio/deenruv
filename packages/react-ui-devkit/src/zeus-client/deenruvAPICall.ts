import { GraphQLResponse, GraphQLError, fetchOptions } from '@deenruv/admin-types';

// * We can think about caching the response in the future
// ! TODO: Add pattern of authToken from dashboard so we need `useSettings` here
// const MINUTE = 1000 * 60;
// export const cache = new LRUCache({
//     ttl: MINUTE * 0.5,
//     ttlAutopurge: true,
// });

export const deenruvAPICall = (options: fetchOptions) => {
    return async (query: string, variables: Record<string, unknown> = {}) => {
        const fetchOptions = options[1] || {};
        if (fetchOptions.method && fetchOptions.method === 'GET') {
            return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
                .then(handleFetchResponse)
                .then((response: GraphQLResponse) => {
                    if (response.errors) {
                        throw new GraphQLError(response);
                    }
                    return response.data;
                });
        }
        return fetch(`${options[0]}`, {
            body: JSON.stringify({ query, variables }),
            method: 'POST',
            headers: {
                ...fetchOptions.headers,
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
            ...fetchOptions,
        })
            .then(r => {
                const authTokenName = 'deenruv-auth-token';
                const authToken = r.headers.get(authTokenName);
                // if (authToken != null) token = authToken;
                return handleFetchResponse(r);
            })
            .then((response: GraphQLResponse) => {
                if (response.errors) {
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
