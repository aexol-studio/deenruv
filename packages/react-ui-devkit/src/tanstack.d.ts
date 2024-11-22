import { GenericListContextType } from '@/components/templates/DetailList/useDetailList/types';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TableMeta<TData extends RowData> extends GenericListContextType<TData> {}
}
