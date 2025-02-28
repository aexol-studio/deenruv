import { ColumnDef, Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useServer,
} from '@deenruv/react-ui-devkit';
import { Stack } from '../Stack';
import { useMemo } from 'react';
import { Permission } from '@deenruv/admin-types';

interface ActionsColumnProps<T> {
  viewRoute: (id: string) => string;
  onDelete: (row: Row<T>) => void;
  deletePermission: Permission;
}

export const ActionsColumn = <T extends { id: string }>({
  viewRoute,
  onDelete,
  deletePermission,
}: ActionsColumnProps<T>): ColumnDef<T> => {
  const { t } = useTranslation('common');
  const { userPermissions } = useServer();
  const isPermittedToDelete = useMemo(() => userPermissions.includes(deletePermission), [userPermissions]);

  return {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Stack className="flex w-12 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('actionsMenu.openMenu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              {t('actionsMenu.copyId')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={viewRoute(row.original.id)} className="text-primary-600">
                {t('actionsMenu.view')}
              </Link>
            </DropdownMenuItem>
            {isPermittedToDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(row);
                  }}
                >
                  <div className=" text-red-400 hover:text-red-400 dark:hover:text-red-400">
                    {t('actionsMenu.delete')}
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Stack>
    ),
  };
};
