import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components';
import { MoreHorizontal, PanelsTopLeft } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'react-router-dom';
import React from 'react';

const EXCLUDED_COLUMNS = ['actions', 'select-id'];
export const ActionsDropdown = <T extends { id: string }>(): ColumnDef<T> => {
    return {
        id: 'actions',
        enableHiding: false,
        header: ({ table }) => {
            const { t } = useTranslation('table');
            const columnsTranslations = t('columns', { returnObjects: true });
            const hideColumns = table.options.meta?.hideColumns ?? [];
            return (
                <div className="text-right">
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
                                .filter(column => {
                                    const isHideable = column.getCanHide();
                                    const isNotExcluded = !EXCLUDED_COLUMNS.includes(column.id);
                                    const isNotHidden = !hideColumns.includes(column.id);
                                    return isHideable && isNotExcluded && isNotHidden;
                                })
                                .map(column => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={value => column.toggleVisibility(!!value)}
                                        >
                                            {columnsTranslations[
                                                column.id as keyof typeof columnsTranslations
                                            ] ?? column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        cell: ({ table, row }) => {
            if (!table.options.meta) return null;
            const { route, refetch, onRemove, rowActions } = table.options.meta;
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
                            <DropdownMenuItem
                                onClick={() => {
                                    if ('edit' in route) {
                                        route.edit(row.original.id);
                                    } else {
                                        redirect(route.to(row.original.id));
                                    }
                                }}
                            >
                                {t('actionsMenu.view')}
                            </DropdownMenuItem>
                            {rowActions && rowActions?.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    {rowActions?.map(action => (
                                        <DropdownMenuItem
                                            key={action.label}
                                            onClick={async () => {
                                                const result = await action.onClick({
                                                    data: row.original,
                                                    table,
                                                    refetch,
                                                });
                                                if ('success' in result) {
                                                    //show success message
                                                    toast.success(result.success);
                                                } else {
                                                    // show error message
                                                    toast.error(result.error);
                                                }
                                            }}
                                        >
                                            {action.label}
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onRemove([row.original])}>
                                <div className="text-red-400 hover:text-red-400 dark:hover:text-red-400">
                                    {t('actionsMenu.delete')}
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    };
};
