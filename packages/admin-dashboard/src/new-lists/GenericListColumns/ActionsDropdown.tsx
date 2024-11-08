import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@deenruv/react-ui-devkit';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ListColumnDropdown } from '../_components';

export const ActionsDropdown = <T extends { id: string }>({
  redirect,
  onRemove,
  bulkActions,
}: {
  redirect: (to: string) => string;
  onRemove: (items: T[]) => void;
  bulkActions?: Array<{ label: string; onClick: ({ data }: { data: T[] }) => void }>;
}): ColumnDef<T> => {
  return {
    id: 'actions',
    enableHiding: false,
    header: ({ table }) => {
      const { t } = useTranslation('table');
      const columnsTranslations = t('columns', { returnObjects: true });
      return (
        <div className="text-right">
          <ListColumnDropdown
            table={table}
            columnsTranslations={columnsTranslations as Record<string, string>}
            bulkActions={bulkActions}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation('table');
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('actionsMenu.open')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                {t('actionsMenu.copyId')}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={redirect(row.original.id)} className="text-primary-600">
                  {t('actionsMenu.view')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onRemove([row.original])}>
                <div className="text-red-400 hover:text-red-400 dark:hover:text-red-400">{t('actionsMenu.delete')}</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };
};
