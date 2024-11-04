import { Checkbox } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

export const SelectIDColumn = <T extends { id: string; name: string }>(): ColumnDef<T> => {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  };
};
