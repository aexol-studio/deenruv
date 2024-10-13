import React, { useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createContext, useContext } from 'react';
import { Widget } from '@/types';

interface WidgetsStoreProps {
    widgets: Widget[];
    options?: {
        localStorageKey?: string;
    };
}
type WidgetsStoreProviderProps = React.PropsWithChildren<WidgetsStoreProps>;

interface WidgetsStoreState extends WidgetsStoreProps {
    reorderWidgets: (oldIndex: number, newIndex: number) => void;
    removeWidget: (id: string | number) => void;
    resizeWidget: (id: string | number, size: { width: number; height: number }) => void;
    setShowWidget: (id: string | number, visible: boolean) => void;
}
type WidgetsStoreType = ReturnType<typeof createWidgetsStore>;

const createWidgetsStore = (initProps?: Partial<WidgetsStoreProps>) => {
    const DEFAULT_PROPS: WidgetsStoreProps = {
        widgets: [],
        options: {
            localStorageKey: 'dashboard-widgets',
        },
    };
    return createStore<WidgetsStoreState>()(
        persist(
            set => {
                return {
                    ...DEFAULT_PROPS,
                    ...initProps,
                    reorderWidgets: (oldIndex, newIndex) => {
                        set(state => {
                            const widgets = arrayMove(state.widgets, oldIndex, newIndex);
                            return { widgets };
                        });
                    },
                    removeWidget: id => {
                        set(state => {
                            const widgets = state.widgets.map(widget =>
                                widget.id === id ? { ...widget, visible: false } : widget,
                            );
                            return { widgets };
                        });
                    },
                    resizeWidget: (id, size) => {
                        set(state => {
                            const widgets = state.widgets.map(widget =>
                                widget.id === id ? { ...widget, size } : widget,
                            );
                            return { widgets };
                        });
                    },
                    setShowWidget: (id, visible) => {
                        set(state => {
                            const widgets = state.widgets.map(widget =>
                                widget.id === id ? { ...widget, visible } : widget,
                            );
                            return { widgets };
                        });
                    },
                };
            },
            {
                name: initProps?.options?.localStorageKey || DEFAULT_PROPS?.options?.localStorageKey!,
                storage: createJSONStorage(() => localStorage, {
                    replacer: (key, value) => {
                        if (key === 'component') return undefined;
                        return value;
                    },
                    reviver: (_, value) => {
                        if (Array.isArray(value)) {
                            return value.map(data => {
                                const widget = initProps?.widgets?.find(widget => widget.id === data.id);
                                return {
                                    ...data,
                                    component: widget?.component || <div>Widget not found</div>,
                                };
                            });
                        }
                        return value;
                    },
                }),
            },
        ),
    );
};

export const WidgetsStoreContext = createContext<WidgetsStoreType | null>(null);

export function WidgetsStoreProvider({ children, ...props }: WidgetsStoreProviderProps) {
    const storeRef = useRef<WidgetsStoreType>();
    if (!storeRef.current) {
        storeRef.current = createWidgetsStore(props);
    }
    return <WidgetsStoreContext.Provider value={storeRef.current}>{children}</WidgetsStoreContext.Provider>;
}

export function useWidgetsStore<T>(selector: (state: WidgetsStoreState) => T) {
    const store = useContext(WidgetsStoreContext);
    if (!store) throw new Error('Missing WidgetsStoreContext.Provider in the tree');
    return useStore(store, selector);
}
