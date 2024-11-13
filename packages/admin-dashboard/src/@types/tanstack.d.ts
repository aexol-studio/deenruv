import { GenericListContextType } from '@/list-views/useGenericList/types';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TableMeta<TData extends RowData> extends GenericListContextType<TData> {}
}
