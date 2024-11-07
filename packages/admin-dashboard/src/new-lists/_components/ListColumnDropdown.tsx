import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@deenruv/react-ui-devkit';
import { PanelsTopLeft } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface ListColumnProps<TData> {
  table: Table<TData>;
  columnsTranslations: Record<string, string>;
  bulkActions?: Array<{ label: string; onClick: ({ data }: { data: TData[] }) => void }>;
}

export function ListColumnDropdown<TData>({ table, columnsTranslations }: ListColumnProps<TData>) {
  const { t } = useTranslation('table');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default">
          <PanelsTopLeft className="mr-2 h-4 w-4" />
          {t('actionsMenu.view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnsTranslations[column.id] || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
