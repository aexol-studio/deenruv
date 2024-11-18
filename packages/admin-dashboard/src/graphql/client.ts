import { scalars } from '@/graphql/scalars';
import {
  GraphQLError,
  GraphQLResponse,
  ResolverInputTypes,
  Thunder,
  chainOptions,
  fetchOptions,
} from '@deenruv/admin-types';
import { ADMIN_API_URL, useSettings, deenruvAPICall } from '@deenruv/react-ui-devkit';

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

// * here we will just replace apiFetchVendure with deenruvAPICall
export const VendureChain = () => Thunder(deenruvAPICall(), { scalars });
export const VendureUploadChain = (...options: chainOptions) => Thunder(uploadFileApi(options), { scalars });

const buildURL = (): string => {
  const uri = window?.__DEENRUV_SETTINGS__?.api?.uri;
  return `${uri || ADMIN_API_URL}/admin-api?languageCode=${useSettings.getState().translationsLanguage}`;
};

export const apiCall = () => VendureChain();
export const uploadApiCall = () => VendureUploadChain(buildURL());

export const adminApiQuery = VendureChain()('query', { scalars });
export const adminApiMutation = VendureChain()('mutation', { scalars });

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
