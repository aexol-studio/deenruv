import { useCallback, useEffect, useState } from "react";
import { DocumentNode } from "graphql";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { deenruvAPICall } from "./deenruvAPICall";
import { useSettings } from "@/state/settings.js";

export function useQuery<
  T,
  V extends Record<string, unknown> = Record<string, unknown>,
>(
  query: DocumentNode | TypedDocumentNode<T, V>,
  options?: {
    initialVariables?: V;
    customParams?: Record<string, string>;
    onSuccess?: (data: T) => void;
    stopRefetchOnChannelChange?: boolean;
  },
) {
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const { initialVariables, customParams, onSuccess } = options || {};
  const [variables] = useState<V | undefined>(initialVariables);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runQuery = useCallback(
    async (
      passedVariables?: V,
      passedCustomParams?: Record<string, string>,
    ) => {
      try {
        setLoading(true);
        setError(null);
        const result = (await deenruvAPICall()(
          print(query),
          passedVariables || variables,
          passedCustomParams || customParams,
        )) as T;
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [customParams],
  );

  useEffect(() => {
    runQuery(initialVariables).catch(() => {
      // * Allow the consuming component to handle the error
    });
  }, []);

  useEffect(() => {
    if (options?.stopRefetchOnChannelChange) return;
    runQuery(variables, customParams).catch(() => {
      // * Allow the consuming component to handle the error
    });
  }, [selectedChannel]);

  return { data, loading, error, runQuery };
}
