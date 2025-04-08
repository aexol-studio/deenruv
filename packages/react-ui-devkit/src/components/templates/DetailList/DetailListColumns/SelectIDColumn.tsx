import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from "@/components";
import { useTranslation } from "@/hooks/useTranslation.js";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const SelectIDColumn = <T extends { id: string }>(): ColumnDef<T> => {
  return {
    id: "select-id",
    enablePinning: true,
    header: ({ table }) => {
      if (!table.options.meta) return null;
      const { refetch, onRemove, bulkActions } = table.options.meta;
      const { t } = useTranslation("table");
      const checked =
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate");
      const amount = table.getSelectedRowModel().flatRows.length;

      return (
        <div className="relative flex gap-2 items-center">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
          {checked ? (
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">{t("actions")}</span>
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    size: 28,
    minSize: 28,
    maxSize: 28,
    meta: {
      isFixedWidth: true,
    },
  };
};
