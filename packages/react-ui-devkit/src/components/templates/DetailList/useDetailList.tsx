import { PromisePaginated } from "@/types/models.js";
import { Table } from "@tanstack/react-table";
import React from "react";
import { createContext, useContext } from "react";

interface DetailListStore {
  table: Table<any> | null;
  sortButton: (
    key: keyof Awaited<ReturnType<PromisePaginated>>["items"][number],
    translated?: string,
  ) => JSX.Element;
  refetch: () => void;
}

export const DetailListStoreContext = createContext<DetailListStore>({
  table: null,
  sortButton: () => <></>,
  refetch: () => {},
});

export const DetailListStoreProvider = ({
  children,
  ...value
}: React.PropsWithChildren<DetailListStore>) => {
  return (
    <DetailListStoreContext.Provider value={value}>
      {children}
    </DetailListStoreContext.Provider>
  );
};

export function useDetailList() {
  const ctx = useContext(DetailListStoreContext);
  if (!ctx)
    throw new Error("Missing DetailListStoreContext.Provider in the tree");
  return ctx;
}
