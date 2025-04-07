import { GenericListContextType } from "@/components/templates/DetailList/useDetailListHook/types";
import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData>
    extends GenericListContextType<TData> {}
}
