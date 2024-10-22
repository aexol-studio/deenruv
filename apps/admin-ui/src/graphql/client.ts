import { scalars } from '@/graphql/scalars';
import { useSettings } from '@/state/settings';
import {
  GraphQLError,
  GraphQLResponse,
  ResolverInputTypes,
  Thunder,
  chainOptions,
  fetchOptions,
} from '@deenruv/admin-types';
import { toast } from 'sonner';

//use 'http://localhost:3000/shop-api/' in local .env file for localhost development and provide env to use on prod/dev envs

export const VENDURE_HOST = `http://localhost:3000/admin-api`;
// export const VENDURE_HOST = `https://shop.qa.minko.aexol.work/admin-api`;
// export const VENDURE_HOST = `${import.meta.env.VITE_ADMINUI_HOST || 'https://shop.dev.minko.aexol.work'}/admin-api`;

const apiFetchVendure =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            response.errors.forEach((e) =>
              toast.error(`GlobalError: ${'path' in e ? (e.path as string) : ''} ${e.message}`),
            );
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    const token = useSettings.getState().token;
    const logIn = useSettings.getState().logIn;
    const selectedChannel = useSettings.getState().selectedChannel;
    const additionalHeaders: Record<string, string> = token
      ? {
          ...(selectedChannel && { 'vendure-token': selectedChannel.token }),
          Authorization: `Bearer ${token}`,
        }
      : {};

    return fetch(`${options[0]}`, {
      ...fetchOptions,
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
    })
      .then((r) => {
        const authToken = r.headers.get('deenruv-auth-token');
        if (authToken !== null) {
          logIn(authToken);
        }
        return handleFetchResponse(r);
      })
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          response.errors.forEach((e) =>
            toast.error(`GlobalError: ${'path' in e ? (e.path as string) : ''} ${e.message}`),
          );
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

const uploadFileApi =
  (options: fetchOptions) =>
  async (query: string, variables: Record<string, unknown> = {}) => {
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

    let token = useSettings.getState().token;
    const selectedChannel = useSettings.getState().selectedChannel;
    const additionalHeaders: Record<string, string> = token
      ? {
          ...(selectedChannel && { 'vendure-token': selectedChannel.token }),
          Authorization: `Bearer ${token}`,
        }
      : {};

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
      headers: {
        ...additionalHeaders,
      },
      ...fetchOptions,
    })
      .then((r) => {
        const authToken = r.headers.get('vendure-auth-token');
        if (authToken != null) {
          token = authToken;
        }
        return handleFetchResponse(r);
      })
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const VendureChain = (...options: chainOptions) => Thunder(apiFetchVendure(options), { scalars });
export const VendureUploadChain = (...options: chainOptions) => Thunder(uploadFileApi(options), { scalars });

const buildHeaders = (): Parameters<typeof VendureChain>[1] => {
  const channel = useSettings.getState().selectedChannel;

  return channel
    ? {
        headers: {
          'Content-Type': 'application/json',
          'vendure-token': channel.token,
        },
      }
    : {
        headers: {
          'Content-Type': 'application/json',
        },
      };
};
const buildURL = (): string => {
  return `${VENDURE_HOST}?languageCode=${useSettings.getState().translationsLanguage}`;
};

export const apiCall = () => VendureChain(buildURL(), { ...buildHeaders() });
export const uploadApiCall = () => VendureUploadChain(buildURL());

export const adminApiQuery = VendureChain(buildURL(), { ...buildHeaders() })('query', { scalars });
export const adminApiMutation = VendureChain(buildURL(), { ...buildHeaders() })('mutation', { scalars });

const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
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
