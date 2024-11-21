import React, { createContext, CSSProperties, PropsWithChildren } from 'react';
import {
    Button,
    Card,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/atoms';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Grip, Menu, Trash } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Widget } from '@/types';
import { useWidgetsStore } from './widgets-context';
import { LanguageCode } from '@deenruv/admin-types';

const WidgetItemContext = createContext<{
    size: { width: number; height: number };
    sizes: { width: number; height: number }[];
    removeWidget: () => void;
    resizeWidget: (size: { width: number; height: number }) => void;
    language: LanguageCode;
}>({
    size: { width: 0, height: 0 },
    sizes: [],
    removeWidget: () => undefined,
    resizeWidget: () => undefined,
    language: LanguageCode.en,
});

const WidgetItemProvider: React.FC<
    PropsWithChildren<{
        widget: Omit<Widget, 'component'>;
        removeWidget: (id: string | number) => void;
        resizeWidget: (id: string | number, size: { width: number; height: number }) => void;
    }>
> = ({ widget, children, removeWidget: remove, resizeWidget: resize }) => {
    return (
        <WidgetItemContext.Provider
            value={{
                size: widget.size,
                sizes: widget.sizes,
                removeWidget: () => remove(widget.id),
                resizeWidget: (size: { width: number; height: number }) => resize(widget.id, size),
                language: LanguageCode.en,
            }}
        >
            {children}
        </WidgetItemContext.Provider>
    );
};

export const useWidgetItem = () => {
    const context = React.useContext(WidgetItemContext);
    if (!context) {
        throw new Error('useWidgetItem must be used within a WidgetItemProvider');
    }
    return context;
};

const WidgetItem: React.FC<PropsWithChildren<{ widget: Omit<Widget, 'component'> }>> = ({
    widget,
    children,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: widget.id,
        attributes: {
            role: `widget-${widget.name}`,
            roleDescription: 'Draggable widget',
            tabIndex: 0,
        },
        transition: { duration: 150, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
    });
    const { removeWidget, resizeWidget } = useWidgetItem();

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        gridColumn: `span ${widget.size.width}`,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="flex flex-col h-full">
                <div className="flex justify-end relative">
                    <div className="flex items-center justify-center gap-2 absolute -right-2 -top-2 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="w-6 h-6">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <div className="flex items-center justify-between">
                                    <DropdownMenuLabel className="text-xs">{widget.name}</DropdownMenuLabel>
                                    <DropdownMenuLabel>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {widget.size.width} x {widget.size.height}
                                        </span>
                                    </DropdownMenuLabel>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={`${widget.size.width}x${widget.size.height}`}
                                    onValueChange={value => {
                                        const [width, height] = value.split('x').map(Number);
                                        resizeWidget({ width, height });
                                    }}
                                >
                                    {widget.sizes.map(size => (
                                        <DropdownMenuRadioItem
                                            key={`${size.width}x${size.height}`}
                                            value={`${size.width}x${size.height}`}
                                        >
                                            Size: {size.width} x {size.height}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuGroup></DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={removeWidget}>
                                    Delete
                                    <DropdownMenuShortcut>
                                        <Trash className="h-4 w-4" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            {...listeners}
                            {...attributes}
                        >
                            <Grip className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {children}
            </Card>
        </div>
    );
};

export const DashboardWidgets = () => {
    const [, setActiveID] = React.useState<string | number | null>(null);
    const { widgets, reorderWidgets, actions } = useWidgetsStore(state => ({
        widgets: state.widgets,
        reorderWidgets: state.reorderWidgets,
        actions: { removeWidget: state.removeWidget, resizeWidget: state.resizeWidget },
    }));
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const ids = widgets?.map(widget => widget.id);
            const oldIndex = ids?.indexOf(active.id);
            const newIndex = ids?.indexOf(over?.id as string);
            if (oldIndex !== undefined && newIndex !== undefined) reorderWidgets(oldIndex, newIndex);
        }
    }

    if (widgets?.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <p className="text-lg text-gray-500">No widgets added yet</p>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={event => setActiveID(event.active.id)}
        >
            <SortableContext items={widgets || []} strategy={rectSortingStrategy}>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                    {widgets?.map(({ component, ...widget }) =>
                        widget.visible ? (
                            <WidgetItemProvider key={widget.id} widget={widget} {...actions}>
                                <WidgetItem widget={widget}>{component}</WidgetItem>
                            </WidgetItemProvider>
                        ) : null,
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
};
