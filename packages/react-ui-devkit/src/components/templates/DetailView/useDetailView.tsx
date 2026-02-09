import React, { useCallback, useEffect, useRef, useState } from "react";
import { createContext, useContext } from "react";
import { DeletionResult, ModelTypes, ValueTypes } from "@deenruv/admin-types";

import {
  type DetailKeys,
  DetailLocations,
  type ExternalDetailLocationSelector,
} from "@/types";
import { DetailViewMarker, checkUnsavedChanges } from "@/components";
import { apiClient } from "@/zeus_client/deenruvAPICall";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { GraphQLError } from "graphql";
import type {
  EntityType,
  FormType,
  PropsType,
  StoreContextType,
} from "./types";
import { useRouteGuard } from "@/hooks";
import { useServer } from "@/state/server.js";
import { customFieldsForQuery } from "@/zeus_client/customFieldsForQuery.js";
interface Field {
  name: string;
  type?: string;
  fields?: Field[];
}

const handleError = (resp: { response: { errors: GraphQLError[] } }) => {
  const code = resp.response?.errors?.[0]?.extensions.code as string;
  const message = code
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (c: string) => c.toUpperCase());

  toast.error(message || "There was an error", { closeButton: false });
};

export const DetailViewStoreContext = createContext<
  StoreContextType<
    DetailKeys,
    ExternalDetailLocationSelector[DetailKeys],
    keyof ModelTypes,
    keyof ModelTypes[keyof ModelTypes]
  >
>(
  // Default value is never used — useDetailView() throws when missing Provider.
  // Using null + non-null assertion to avoid polluting with placeholder objects.
  null as unknown as StoreContextType<
    DetailKeys,
    ExternalDetailLocationSelector[DetailKeys],
    keyof ModelTypes,
    keyof ModelTypes[keyof ModelTypes]
  >,
);

export const DetailViewStoreProvider = <
  T extends DetailKeys,
  F extends keyof ModelTypes,
  FK extends keyof ModelTypes[F],
>({
  children,
  ...props
}: React.PropsWithChildren<PropsType<T, F, FK>>) => {
  const [queue, setQueue] = useState<
    Record<string, { callback: () => Promise<void> }>
  >({});
  const addToQueue = useCallback(
    (key: string, callback: () => Promise<void>) => {
      setQueue((prev) => ({ ...prev, [key]: { callback } }));
    },
    [],
  );
  const removeFromQueue = useCallback((key: string) => {
    setQueue((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const { form, id, locationId, sidebar: _sidebar, tabs, tab: _tab } = props;
  const graphQLSchema = useServer((p) => p.graphQLSchema);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<EntityType | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(_tab);
  const [sidebar, _setSidebar] = useState(_sidebar);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [additionalData, setAdditionalData] =
    useState<Record<string, unknown>>();
  const [markedAsDirty, setMarkedAsDirty] = useState(false);
  useRouteGuard({ shouldBlock: hasUnsavedChanges });

  const markAsDirty = useCallback(() => {
    setMarkedAsDirty(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("tab")) {
      const newTab = searchParams.get("tab") as string;
      if (tabs.some((t) => t.name === newTab)) {
        setTab(newTab);
      } else {
        setTab(tabs[0].name);
      }
    } else {
      setTab(tabs[0].name);
    }
  }, [searchParams, tabs]);

  useEffect(() => {
    if (id !== undefined) fetchEntity();
  }, [tab, id]);

  // Track the latest entity & markedAsDirty in refs so the watch callback
  // (which must remain stable) always sees current values without being
  // a dependency that restarts the subscription.
  const entityRef = useRef(entity);
  entityRef.current = entity;
  const markedAsDirtyRef = useRef(markedAsDirty);
  markedAsDirtyRef.current = markedAsDirty;

  // Recompute unsaved-changes whenever the form values change via RHF's
  // `watch()` subscription — this does NOT cause provider re-renders on
  // every keystroke because `setHasUnsavedChanges` bails out when the
  // boolean value is unchanged (React state identity check).
  useEffect(() => {
    const compute = () => {
      if (markedAsDirtyRef.current) {
        setHasUnsavedChanges(true);
        return;
      }
      const formValues = form.base.getValues();
      setHasUnsavedChanges(checkUnsavedChanges(formValues, entityRef.current));
    };

    // Initial computation
    compute();

    // Subscribe to all form value changes — watch() returns an unsubscribe fn
    const subscription = form.base.watch(() => {
      compute();
    });

    return () => subscription.unsubscribe();
  }, [form.base]);

  // Re-run when entity or markedAsDirty change (refs are updated above,
  // but we still need to trigger a recompute for these external changes).
  useEffect(() => {
    if (markedAsDirty) {
      setHasUnsavedChanges(true);
      return;
    }
    const formValues = form.base.getValues();
    setHasUnsavedChanges(checkUnsavedChanges(formValues, entity));
  }, [entity, markedAsDirty]);

  const handleSuccess = useCallback(
    (resp: Record<string, unknown>) => {
      const [mutationName] = Object.keys(resp);

      if (mutationName.startsWith("delete") && Array.isArray(resp)) {
        const result = Object.values(resp)[0].result;

        if (result !== DeletionResult.DELETED) {
          toast.warning(Object.values(resp)[0].message, { closeButton: false });
          return;
        }
      }

      const string =
        mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
      const message = `${string.replace(/([A-Z])/g, " $1").trim()} - Success`;
      const listPath = location.pathname.replace(/\/[^/]+$/, "");

      if (
        mutationName.startsWith("create") ||
        mutationName.startsWith("delete")
      ) {
        setHasUnsavedChanges(false);
        setTimeout(() => navigate(listPath, { viewTransition: true }));
      } else {
        fetchEntity();
      }

      toast.success(message, { closeButton: false });
    },
    [navigate],
  );

  const actionHandler = useCallback(
    (type: "submit" | "delete") => {
      const { onDeleted, onSubmitted, base } = form || {};
      Object.entries(queue).forEach(([key, { callback }]) => {
        callback().then(() => removeFromQueue(key));
      });
      const formValues = base?.getValues() as Record<string, unknown>;
      if (type === "submit")
        onSubmitted?.(formValues, additionalData)
          ?.then(handleSuccess)
          .catch(handleError);
      if (type === "delete")
        onDeleted?.(formValues, additionalData)
          ?.then(handleSuccess)
          .catch(handleError);
      Object.keys(queue).forEach(removeFromQueue);
    },
    [props.form, handleSuccess],
  );

  const setSidebar = useCallback((sidebar: React.ReactNode) => {
    if (typeof sidebar === "undefined") {
      const tabWithSidebar = tabs.find(
        (t): t is typeof t & { sidebar: React.ReactNode } =>
          "sidebar" in t && t.sidebar !== undefined,
      );
      _setSidebar(tabWithSidebar ? tabWithSidebar.sidebar : sidebar);
    } else if (sidebar === null) {
      _setSidebar(null);
    } else {
      _setSidebar(sidebar);
    }
  }, []);

  const getMarker = () => {
    if (!locationId) return null;
    return <DetailViewMarker position={locationId} tab={tab} />;
  };

  const fetchEntity = useCallback(async () => {
    const entityGraphQL =
      DetailLocations[locationId as keyof typeof DetailLocations];
    const name = (entityGraphQL["type"].charAt(0).toLowerCase() +
      entityGraphQL["type"].slice(1)) as keyof ValueTypes["Query"];

    if (id === undefined) return;
    setLoading(true);
    try {
      const query =
        typeof id === "string"
          ? ({
              [name]: [{ id }, entityGraphQL["selector"]],
            } as unknown as ValueTypes["Query"])
          : ({
              [name]: entityGraphQL["selector"],
            } as unknown as ValueTypes["Query"]);
      const data = await apiClient("query")(query);
      const entity = data[name] as EntityType;
      if (data && data[name]) {
        setEntity(entity);
        return entity;
      } else {
        setEntity(null);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, locationId, graphQLSchema]);

  return (
    <DetailViewStoreContext.Provider
      value={{
        id,
        form,
        loading,
        entity,
        error,
        tab,
        sidebar,
        tabs,
        actionHandler,
        addToQueue,
        fetchEntity,
        setEntity,
        setSidebar,
        setActiveTab: setTab,
        getMarker,
        hasUnsavedChanges,
        setAdditionalData,
        setLoading,
        additionalData,
        markAsDirty,
      }}
    >
      {children}
    </DetailViewStoreContext.Provider>
  );
};

export function useDetailView<
  T extends DetailKeys,
  E extends ExternalDetailLocationSelector[T],
  F extends keyof ModelTypes,
  FK extends keyof ModelTypes[F],
>(_type?: T, _key?: F, ..._pick: FK[]): StoreContextType<T, E, F, FK> {
  const ctx = useContext(DetailViewStoreContext);
  if (!ctx)
    throw new Error("Missing DetailViewStoreContext.Provider in the tree");

  return ctx as unknown as StoreContextType<T, E, F, FK>;
}

/**
 * Like `useDetailView`, but returns `null` when there is no
 * `DetailViewStoreProvider` in the component tree instead of throwing.
 *
 * Useful in components (e.g. list pages) that may or may not be rendered
 * inside a detail-view context.
 */
export function useOptionalDetailView<
  T extends DetailKeys,
  E extends ExternalDetailLocationSelector[T],
  F extends keyof ModelTypes,
  FK extends keyof ModelTypes[F],
>(): StoreContextType<T, E, F, FK> | null {
  const ctx = useContext(DetailViewStoreContext);
  if (!ctx) return null;
  return ctx as unknown as StoreContextType<T, E, F, FK>;
}
