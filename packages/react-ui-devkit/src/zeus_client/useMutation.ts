import { useCallback, useState } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { deenruvAPICall } from './deenruvAPICall';

export function useMutation<T, V extends Record<string, any> = Record<string, any>>(
    mutation: DocumentNode | TypedDocumentNode<T, V>,
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const runMutation = useCallback(async (variables?: V, customParams?: Record<string, string>) => {
        try {
            setLoading(true);
            setError(null);
            const result = (await deenruvAPICall()(print(mutation), variables, customParams)) as T;
            setData(result);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return [runMutation, { data, loading, error }] as const;
}
