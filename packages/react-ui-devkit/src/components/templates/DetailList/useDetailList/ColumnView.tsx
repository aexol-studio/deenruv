import { Button } from '@/components/atoms/button.js';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu.js';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Grip, PanelsTopLeft } from 'lucide-react';
import React, { useMemo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';
import { ColumnDef, Table } from '@tanstack/react-table';
import { EXCLUDED_COLUMNS } from '@/components/templates/DetailList/useDetailList/constants.js';

export const ColumnView = <T extends { id: string }>(table: Table<T>) => {
    const { t } = useTranslation('table');
    const columnsTranslations = t('columns', { returnObjects: true });
    const hideColumns = table.options.meta?.hideColumns ?? [];

    const allColumns = useMemo(() => {
        return table.getAllColumns().filter(column => {
            const isHideable = column.getCanHide();
            const isNotExcluded = !EXCLUDED_COLUMNS.includes(column.id);
            const isNotHidden = !hideColumns.includes(column.id as keyof T);
            return isHideable && isNotExcluded && isNotHidden;
        });
    }, [table, hideColumns]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function arrayMove<T>(array: T[], from: number, to: number): T[] {
        const newArray = array.slice();
        newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
        return newArray;
    }

    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="default">
                        <PanelsTopLeft className="mr-2 h-4 w-4" />
                        {t('actionsMenu.view')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-[350px] overflow-y-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={e => {
                            const { active, over } = e;
                            if (active.id !== over?.id) {
                                const oldIndex = allColumns.findIndex(column => column.id === active.id);
                                const newIndex = allColumns.findIndex(column => column.id === over?.id);
                                const newOrder = arrayMove(
                                    allColumns.map(column => column.id),
                                    oldIndex,
                                    newIndex,
                                );
                                table.setColumnOrder(newOrder);
                            }
                        }}
                    >
                        <SortableContext
                            items={allColumns.map(column => column.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {allColumns
                                .sort((a, b) => {
                                    const order = table.getState().columnOrder;
                                    return order.indexOf(a.id) - order.indexOf(b.id);
                                })
                                .map(column => {
                                    return (
                                        <DraggableMenuItem key={column.id} id={column.id}>
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
                                        </DraggableMenuItem>
                                    );
                                })}
                        </SortableContext>
                    </DndContext>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
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
