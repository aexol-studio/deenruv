import React, { useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createContext, useContext } from "react";
import type { Channel, Widget } from "@/plugins";

interface WidgetsStoreProps {
  widgets: Widget[];
  context:
    | { channel?: Channel; language: string; translationsLanguage: string }
    | undefined;
  options?: {
    localStorageKey?: string;
  };
}
type WidgetsStoreProviderProps = React.PropsWithChildren<WidgetsStoreProps>;

interface WidgetsStoreState extends WidgetsStoreProps {
  reorderWidgets: (oldIndex: number, newIndex: number) => void;
  removeWidget: (id: string | number) => void;
  resizeWidget: (
    id: string | number,
    size: { width: number; height: number },
  ) => void;
  setShowWidget: (id: string | number, visible: boolean) => void;
}
type WidgetsStoreType = ReturnType<typeof createWidgetsStore>;

const DEFAULT_LOCAL_STORAGE_KEY = "dashboard-widgets";

type PersistedWidgetLayout = Pick<Widget, "id"> &
  Partial<Pick<Widget, "visible" | "size">>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isPersistedWidgetLayout = (
  value: unknown,
): value is PersistedWidgetLayout =>
  isRecord(value) &&
  (typeof value.id === "string" || typeof value.id === "number");

export const mergePersistedWidgets = (
  currentWidgets: Widget[],
  persistedWidgets: unknown,
): Widget[] => {
  if (!Array.isArray(persistedWidgets)) return currentWidgets;

  const currentById = new Map(
    currentWidgets.map((widget) => [widget.id, widget]),
  );
  const hydrated: Widget[] = [];
  for (const persisted of persistedWidgets) {
    if (!isPersistedWidgetLayout(persisted)) continue;
    const current = currentById.get(persisted.id);
    if (!current) continue;
    hydrated.push({
      ...current,
      ...(typeof persisted.visible === "boolean"
        ? { visible: persisted.visible }
        : {}),
      ...(isRecord(persisted.size) &&
      typeof persisted.size.width === "number" &&
      typeof persisted.size.height === "number"
        ? {
            size: {
              width: persisted.size.width,
              height: persisted.size.height,
            },
          }
        : {}),
    });
    currentById.delete(persisted.id);
  }

  return [
    ...hydrated,
    ...currentWidgets.filter((widget) => currentById.has(widget.id)),
  ];
};

const createWidgetsStore = (initProps?: Partial<WidgetsStoreProps>) => {
  const DEFAULT_PROPS: WidgetsStoreProps = {
    widgets: [],
    context: undefined,
    options: {
      localStorageKey: DEFAULT_LOCAL_STORAGE_KEY,
    },
  };
  return createStore<WidgetsStoreState>()(
    persist(
      (set) => {
        return {
          ...DEFAULT_PROPS,
          ...initProps,
          reorderWidgets: (oldIndex, newIndex) => {
            set((state) => {
              const widgets = arrayMove(state.widgets, oldIndex, newIndex);
              return { widgets };
            });
          },
          removeWidget: (id) => {
            set((state) => {
              const widgets = state.widgets.map((widget) =>
                widget.id === id ? { ...widget, visible: false } : widget,
              );
              return { widgets };
            });
          },
          resizeWidget: (id, size) => {
            set((state) => {
              const widgets = state.widgets.map((widget) =>
                widget.id === id ? { ...widget, size } : widget,
              );
              return { widgets };
            });
          },
          setShowWidget: (id, visible) => {
            set((state) => {
              const widgets = state.widgets.map((widget) =>
                widget.id === id ? { ...widget, visible } : widget,
              );
              return { widgets };
            });
          },
        };
      },
      {
        name: initProps?.options?.localStorageKey || DEFAULT_LOCAL_STORAGE_KEY,
        storage: createJSONStorage(() => globalThis.localStorage, {
          replacer: (key, value) => {
            if (key === "component") return undefined;
            return value;
          },
        }),
        partialize: (state) => ({
          widgets: state.widgets.map(({ id, size, visible }) => ({
            id,
            size,
            visible,
          })),
        }),
        merge: (persistedState, currentState) => {
          const persistedWidgets = isRecord(persistedState)
            ? persistedState.widgets
            : undefined;
          return {
            ...currentState,
            widgets: mergePersistedWidgets(
              currentState.widgets,
              persistedWidgets,
            ),
          };
        },
      },
    ),
  );
};

export const WidgetsStoreContext = createContext<WidgetsStoreType | null>(null);

export function WidgetsStoreProvider({
  children,
  ...props
}: WidgetsStoreProviderProps) {
  const storeRef = useRef<WidgetsStoreType>(undefined);
  if (!storeRef.current) {
    storeRef.current = createWidgetsStore(props);
  }
  return (
    <WidgetsStoreContext.Provider value={storeRef.current}>
      {children}
    </WidgetsStoreContext.Provider>
  );
}

export function useWidgetsStore<T>(selector: (state: WidgetsStoreState) => T) {
  const store = useContext(WidgetsStoreContext);
  if (!store)
    throw new Error("Missing WidgetsStoreContext.Provider in the tree");
  return useStore(store, selector);
}
