import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components';
import { Copy, ExternalLink, Grip, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';
import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useServer } from '@/state';

export const ActionsDropdown = <T extends { id: string }>(navigate: NavigateFunction): ColumnDef<T> => {
    return {
        id: 'actions',
        enableHiding: false,
        enablePinning: true,
        cell: ({ table, row }) => {
            if (!table.options.meta) return null;
            const { route, refetch, onRemove, rowActions, deletePermissions } = table.options.meta;

            const { userPermissions } = useServer();
            const isPermittedToDelete = useMemo(
                () => deletePermissions.every(permission => userPermissions.includes(permission)),
                [userPermissions],
            );

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
                                <div className="flex items-center gap-2">
                                    <Copy size={14} />
                                    {t('actionsMenu.copyId')}
                                </div>
                            </DropdownMenuItem>
                            {route ? (
                                <DropdownMenuItem
                                    onClick={() => {
                                        if ('edit' in route) {
                                            route.edit(row.original.id);
                                        } else navigate(route.to(row.original.id), { viewTransition: true });
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <ExternalLink size={14} />
                                        {t('actionsMenu.view')}
                                    </div>
                                </DropdownMenuItem>
                            ) : null}
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
                            {onRemove && isPermittedToDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onRemove([row.original])}>
                                        <div className="text-destructive flex items-center gap-2">
                                            <Trash size={14} />
                                            {t('actionsMenu.delete')}
                                        </div>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        size: 28,
        minSize: 28,
        maxSize: 28,
        meta: {
            isFixedWidth: true,
        },
    };
};

interface DraggableMenuItemProps {
    id: string;
    children: React.ReactNode;
}
const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="flex items-center">
            <Button variant="outline" {...listeners} className="cursor-move mr-2 p-1 h-auto">
                <Grip className="h-3.5 w-3.5" />
            </Button>
            {children}
        </div>
    );
};
