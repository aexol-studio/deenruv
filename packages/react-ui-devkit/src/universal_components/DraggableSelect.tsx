import {
  Button,
  Checkbox,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/index.js";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Grip } from "lucide-react";
import React, { useState } from "react";

export const DraggableSelect = ({
  align = "start",
  button,
  localStorageKey,
  title,
  value,
  onChange,
  options,
}: {
  title?: string;
  align?: "start" | "end" | "center";
  localStorageKey?: string;
  button: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
}) => {
  const _default = options.map((option) => option.value);
  const [order, setOrder] = localStorageKey
    ? useLocalStorage(localStorageKey, _default)
    : useState(_default);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="max-h-[350px] space-y-2.5 overflow-y-auto p-2"
      >
        {title ? (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e: DragEndEvent) => {
            const { active, over } = e;
            if (active.id !== over?.id) {
              const oldIndex = order.indexOf(active.id as string);
              const newIndex = order.indexOf(over?.id as string);
              setOrder((items) => arrayMove(items, oldIndex, newIndex));
            }
          }}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {order.map((id) => {
              const column = options.find((opt) => opt.value === id);
              if (!column) return null;
              return (
                <DraggableMenuItem key={column.value} id={column.value}>
                  <div className="flex items-center gap-3 pr-4">
                    <Checkbox
                      id={`checkbox-${column.value}`}
                      checked={value.includes(column.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange([...value, column.value]);
                        } else {
                          onChange(value.filter((v) => v !== column.value));
                        }
                      }}
                    />
                    <label
                      htmlFor={`checkbox-${column.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                </DraggableMenuItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface DraggableMenuItemProps {
  id: string;
  children: React.ReactNode;
}
const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center"
    >
      <Button
        variant="outline"
        {...listeners}
        className="mr-2 h-auto cursor-move p-1"
      >
        <Grip className="size-3.5" />
      </Button>
      {children}
    </div>
  );
};
