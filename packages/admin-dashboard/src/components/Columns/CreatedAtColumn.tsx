import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Row } from '@tanstack/react-table';
import { SortButton, TimeColumnProps } from '@deenruv/react-ui-devkit';

const CreatedAtColumn = <T extends { createdAt: string }>({ currSort, setSort }: TimeColumnProps): ColumnDef<T> => {
  const { t } = useTranslation('common');

  return {
    accessorKey: 'createdAt',
    header: () => (
      <SortButton currSort={currSort} sortKey={'createdAt'} onClick={() => setSort('createdAt')}>
        {t('search.filterLabels.createdAt')}
      </SortButton>
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <div className="text-nowrap">{format(new Date(row.original.createdAt), 'dd.MM.yyyy hh:mm')}</div>
    ),
  };
};

export default CreatedAtColumn;
