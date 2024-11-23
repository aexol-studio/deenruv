import { useCallback, useState } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { deenruvAPICall } from './deenruvAPICall';

export function useLazyQuery<T, V extends Record<string, any> = Record<string, any>>(
    query: DocumentNode | TypedDocumentNode<T, V>,
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const runQuery = useCallback(async (variables?: V, customParams?: Record<string, string>) => {
        try {
            setLoading(true);
            setError(null);
            const result = (await deenruvAPICall()(print(query), variables, customParams)) as T;
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
