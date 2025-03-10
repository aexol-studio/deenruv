import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Row } from '@tanstack/react-table';
import { SortSelect, TimeColumnProps } from '@deenruv/react-ui-devkit';

const UpdatedAtColumn = <T extends { updatedAt?: string }>({ currSort, setSort }: TimeColumnProps): ColumnDef<T> => {
  const { t } = useTranslation();

  return {
    accessorKey: 'updatedAt',
    header: () => (
      <SortSelect currSort={currSort} sortKey="updatedAt" onClick={() => setSort('updatedAt')}>
        {t('search.filterLabels.updatedAt')}
      </SortSelect>
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <div className="text-nowrap">
        {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm') : ''}
      </div>
    ),
  };
};

export default UpdatedAtColumn;
