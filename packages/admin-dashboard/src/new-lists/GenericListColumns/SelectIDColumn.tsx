import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@deenruv/react-ui-devkit';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';

export const SelectIDColumn = <T extends { id: string; name: string }>({
  bulkActions,
  refetch,
  onRemove,
}: {
  bulkActions?: Array<{
    label: string;
    onClick: ({ data, refetch, table }: { data: T[]; refetch: () => void; table: any }) => boolean;
  }>;
  refetch: () => void;
  onRemove: (items: T[]) => void;
}): ColumnDef<T> => {
  return {
    id: 'select-id',
    header: ({ table }) => {
      const checked = table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate');
      const amount = table.getSelectedRowModel().flatRows.length;
      return (
        <div className="relative flex gap-2">
          <Checkbox checked={checked} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
          {checked ? (
            <div className="absolute left-full">
              <DropdownMenu>
                <div className="bg-secondary border-card flex flex-col gap-2 rounded-md border p-2">
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-primary flex w-full flex-1">
                      With {amount} selected
                    </Button>
                  </DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="bg-primary flex w-full flex-1"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    Clear selection
                  </Button>
                </div>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {bulkActions?.map((action) => (
                      <DropdownMenuItem
                        onClick={() => {
                          const data = table.getSelectedRowModel().flatRows.map((row) => row.original);
                          const result = action.onClick({ data, refetch, table });
                          if (result) table.toggleAllRowsSelected(false);
                        }}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={async () => {
                        const data = table.getSelectedRowModel().flatRows.map((row) => row.original);
                        onRemove(data);
                      }}
                    >
                      <div className="flex items-center gap-2 text-red-400 hover:text-red-400 dark:hover:text-red-400">
                        <Trash size={16} />
                        Delete selected
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      );
    },
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  };
};
