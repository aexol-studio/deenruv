import {
    Button,
    Checkbox,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const SelectIDColumn = <T extends { id: string; name: string }>(): ColumnDef<T> => {
    return {
        id: 'select-id',
        header: ({ table }) => {
            if (!table.options.meta) return null;
            const { refetch, onRemove, bulkActions } = table.options.meta;
            const { t } = useTranslation('table');
            const checked =
                table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate');
            const amount = table.getSelectedRowModel().flatRows.length;

            return (
                <div className="relative flex gap-2">
                    <Checkbox
                        checked={checked}
                        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    />
                    {checked ? (
                        <div className="absolute left-full">
                            <DropdownMenu>
                                <div className="bg-card border-secondary flex flex-col gap-2 rounded-md border p-2">
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex w-full flex-1">
                                            {t('withSelected', { amount })}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <Button
                                        variant="outline"
                                        className="flex w-full flex-1"
                                        onClick={() => table.toggleAllRowsSelected(false)}
                                    >
                                        {t('clearSelected')}
                                    </Button>
                                </div>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuGroup>
                                        {bulkActions?.map(action => (
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    const data = table
                                                        .getSelectedRowModel()
                                                        .flatRows.map(row => row.original);
                                                    const result = await action.onClick({
                                                        data,
                                                        refetch,
                                                        table,
                                                    });
                                                    if ('success' in result) {
                                                        //show success message
                                                        toast.success(result.success);
                                                        table.toggleAllRowsSelected(false);
                                                    } else {
                                                        // show error message
                                                        toast.error(result.error);
                                                        table.toggleAllRowsSelected(false);
                                                    }
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
                                                const data = table
                                                    .getSelectedRowModel()
                                                    .flatRows.map(row => row.original);
                                                onRemove(data);
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-red-400 hover:text-red-400 dark:hover:text-red-400">
                                                <Trash size={16} />
                                                {t('removeSelected')}
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
            <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} />
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
    };
};
