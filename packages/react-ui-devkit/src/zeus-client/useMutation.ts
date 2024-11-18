import { useCallback, useState } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { deenruvAPICall } from './deenruvAPICall';
import { buildDeenruvParams } from './utils';

export function useMutation<T, V extends Record<string, any> = Record<string, any>>(
    mutation: DocumentNode | TypedDocumentNode<T, V>,
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const runMutation = useCallback(async (variables?: V) => {
        try {
            setLoading(true);
            setError(null);
            const result = (await deenruvAPICall(
                buildDeenruvParams({
                    adminAPIHost: 'http://localhost:3000',
                    languageCode: 'en',
                    channel: { name: 'deenruv-token', value: '__default_channel__' },
                }),
            )(print(mutation), variables)) as T;
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
