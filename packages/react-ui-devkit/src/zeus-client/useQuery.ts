import { useCallback, useEffect, useState } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { api } from './api';
import { buildDeenruvParams } from './utils';

export function useQuery<T, V extends Record<string, any> = Record<string, any>>(
    query: DocumentNode | TypedDocumentNode<T, V>,
    initialVariables?: V,
) {
    const [variables] = useState<V | undefined>(initialVariables);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const runQuery = useCallback(async (passedVariables?: V) => {
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
            )(print(query), passedVariables || variables)) as T;
            setData(result);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        runQuery(initialVariables).catch(() => {
            // * Allow the consuming component to handle the error
        });
    }, []);

    return { data, loading, error, runQuery };
}
