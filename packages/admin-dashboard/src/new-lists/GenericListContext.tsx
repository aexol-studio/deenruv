import { createContext, PropsWithChildren } from 'react';

interface GenericListContextType<T> {
  deleteDialog: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    itemsToDelete: T[];
    setItemsToDelete: (items: T[]) => void;
  };
}

const defaultContextValue: GenericListContextType<unknown> = {
  deleteDialog: {
    opened: false,
    setOpened: () => {},
    itemsToDelete: [],
    setItemsToDelete: () => {},
  },
};

const GenericListContext = createContext<GenericListContextType<unknown>>(defaultContextValue);

export const GenericListProvider = <T,>({
  children,
  context,
}: PropsWithChildren<{ context?: GenericListContextType<T> }>) => {
  return (
    <GenericListContext.Provider value={context as GenericListContextType<unknown>}>
      {children}
    </GenericListContext.Provider>
  );
};

export function useGenericListContext<T>() {
  return GenericListContext as unknown as GenericListContextType<T>;
}
