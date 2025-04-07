import { Button } from "@/components/atoms/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu.js";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Grip, PanelsTopLeft } from "lucide-react";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "@tanstack/react-table";
import { EXCLUDED_COLUMNS } from "@/components/templates/DetailList/useDetailListHook/constants.js";
import { Checkbox } from "@/components/atoms/checkbox.js";
import { camelCaseToSpaces } from "@/utils/camel-case-to-spaces.js";
import { useServer } from "@/state/server.js";
import { useSettings } from "@/state/settings.js";
import { useTranslation } from "@/hooks/useTranslation.js";

const CUSTOM_FIELDS_PREFIX = "customFields.";

export const ColumnView = <T extends { id: string }>({
  table,
  entityName,
}: {
  table: Table<T>;
  entityName: string;
}) => {
  const { t } = useTranslation("table");
  const { language } = useSettings();
  const columnsTranslations = t("columns", { returnObjects: true });
  const hideColumns = table.options.meta?.hideColumns ?? [];
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName === entityName,
    ),
  )?.customFields;

  const allColumns = table.getAllColumns().filter((column) => {
    const isHideable = column.getCanHide();
    const isNotExcluded = !EXCLUDED_COLUMNS.includes(column.id);
    const isNotHidden = !hideColumns.includes(column.id as keyof T);
    return isHideable && isNotExcluded && isNotHidden;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function arrayMove<T>(array: T[], from: number, to: number): T[] {
    const newArray = array.slice();
    newArray.splice(
      to < 0 ? newArray.length + to : to,
      0,
      newArray.splice(from, 1)[0],
    );
    return newArray;
  }

  const getCustomFieldLabel = (key: string) => {
    const fromTable = table.getColumn(key);
    console.log("key", key, "fromTable", fromTable);
    if (fromTable && "label" in fromTable) {
      return fromTable.label;
    }

    const field = entityCustomFields?.find(
      (el) => el.name === key.split(".")[1],
    );
    const fieldTranslation =
      field?.label?.find((el) => el.languageCode === language)?.value ||
      field?.label?.[0]?.value;
    return (
      fieldTranslation ||
      camelCaseToSpaces(key.replace(CUSTOM_FIELDS_PREFIX, ""))
    );
  };

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 py-0"
            aria-label="Open filters"
          >
            <PanelsTopLeft className="size-4" aria-hidden="true" />
            {t("actionsMenu.view")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-[350px] space-y-2.5 overflow-y-auto p-2"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e: DragEndEvent) => {
              const { active, over } = e;
              if (active.id !== over?.id) {
                const oldIndex = allColumns.findIndex(
                  (column) => column.id === active.id,
                );
                const newIndex = allColumns.findIndex(
                  (column) => column.id === over?.id,
                );
                const newOrder = arrayMove(
                  allColumns.map((column) => column.id),
                  oldIndex,
                  newIndex,
                );
                table.setColumnOrder(newOrder);
              }
            }}
          >
            <SortableContext
              items={allColumns.map((column) => column.id)}
              strategy={verticalListSortingStrategy}
            >
              {allColumns
                .sort((a, b) => {
                  const order = table.getState().columnOrder;
                  return order.indexOf(a.id) - order.indexOf(b.id);
                })
                .map((column) => {
                  return (
                    <DraggableMenuItem key={column.id} id={column.id}>
                      <div className="flex items-center gap-3 pr-4">
                        <Checkbox
                          id={`checkbox-${column.id}`}
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        />
                        <label
                          htmlFor={`checkbox-${column.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {columnsTranslations[
                            column.id as keyof typeof columnsTranslations
                          ] ??
                            (column.id.startsWith(CUSTOM_FIELDS_PREFIX)
                              ? getCustomFieldLabel(column.id)
                              : camelCaseToSpaces(column.id))}
                        </label>
                      </div>
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
