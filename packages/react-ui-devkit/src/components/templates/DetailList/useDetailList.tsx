import { Table } from '@tanstack/react-table';
import React from 'react';
import { createContext, useContext } from 'react';

interface DetailListStore {
    value: { table: Table<any> | null; refetch: () => void };
}

export const DetailListStoreContext = createContext<DetailListStore>({
    value: { table: null, refetch: () => {} },
});

export const DetailListStoreProvider = ({ children, ...props }: React.PropsWithChildren<DetailListStore>) => {
    return <DetailListStoreContext.Provider value={props}>{children}</DetailListStoreContext.Provider>;
};

export function useDetailList() {
    const ctx = useContext(DetailListStoreContext);
    if (!ctx) throw new Error('Missing DetailListStoreContext.Provider in the tree');
    return ctx;
}
