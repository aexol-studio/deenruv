import { useCallback, useState } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { api } from './api';
import { buildDeenruvParams } from './utils';

export function useLazyQuery<T, V extends Record<string, any> = Record<string, any>>(
    query: DocumentNode | TypedDocumentNode<T, V>,
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const runQuery = useCallback(async (variables?: V) => {
        try {
            setLoading(true);
            setError(null);
            const result = (await api(
                buildDeenruvParams({
                    adminAPIHost: 'http://localhost:3000',
                    languageCode: 'en',
                    channel: { name: 'deenruv-token', value: '__default_channel__' },
                }),
                'deenruv-auth-token',
            )(print(query), variables)) as T;
            setData(result);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return [runQuery, { data, loading, error }] as const;
}
