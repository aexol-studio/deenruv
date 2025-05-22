import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import React from "react";
import { DialogComponentProps } from "@/universal_utils/createDialogFromComponentFunction.js";
import {
  Badge,
  Button,
  Checkbox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLabel,
  TableRow,
} from "@/components/index.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import { useSettings } from "@/state/settings.js";

export function DeleteEntityFromChannelsDialog<T extends { id: string }>({
  close,
  reject,
  resolve,
  data: { items },
}: DialogComponentProps<{ channelId: string; ids: string[] }, { items: T[] }>) {
  const { t } = useTranslation("common");
  const selectedChannel = useSettings((state) => state.selectedChannel);
  const deleteEntitiesFromChannel = () => {
    if (!selectedChannel) {
      reject("Nie wybrano kanału");
      return;
    }
    resolve({
      ids: items.map((item) => item.id),
      channelId: selectedChannel?.id,
    });
  };

  const selectedTable = useReactTable({
    data: items || [],
    manualPagination: true,
    enableExpanding: true,
    columns: [
      {
        accessorKey: "id",
        enableHiding: false,
        enableColumnFilter: false,
        header: () => <TableLabel>{t("table.id")}</TableLabel>,
        meta: { isPlaceholder: true },
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="flex w-full items-center justify-center"
          >
            {row.original?.id ?? row.id}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        ),
      },
      {
        accessorKey: "name",
        header: () => <TableLabel>{t("table.name")}</TableLabel>,
      },
      {
        accessorKey: "slug",
        header: () => <TableLabel>{t("table.slug")}</TableLabel>,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  const channelsTable = useReactTable({
    data: [selectedChannel],
    manualPagination: true,
    enableExpanding: true,
    columns: [
      {
        id: "select",
        cell: ({ row, table }) => (
          <div className="flex items-center gap-2">
            <Checkbox checked />
          </div>
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
      },
      {
        accessorKey: "code",
        header: () => (
          <TableLabel>{t("removeEntitiesToChannels.table.code")}</TableLabel>
        ),
      },
      {
        accessorKey: "token",
        header: () => (
          <TableLabel>{t("removeEntitiesToChannels.table.token")}</TableLabel>
        ),
      },
      {
        accessorKey: "active",
        header: () => null,
        cell: ({ row }) => (
          <Badge variant="outline" className="border-green-500">
            {t("removeEntitiesToChannels.table.active")}
          </Badge>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DialogContent className="flex h-[90dvh] w-[90vw] max-w-full flex-col">
      <DialogHeader>
        <DialogTitle>
          <span>{t("removeEntitiesToChannels.removeEntities")}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="grid h-full min-h-0  grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col ">
          <h1 className="p-4">{t("removeEntitiesToChannels.selected")}</h1>

          <Table>
            <TableHeader className="bg-primary-foreground sticky top-0">
              {selectedTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {selectedTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mx-4 h-full w-px bg-stone-700"></div>
        <div className="flex h-full min-h-0 flex-col ">
          <div className="flex items-center  gap-2">
            <h1 className="p-4">
              {t("removeEntitiesToChannels.availableChannels")}
            </h1>
            <Button className="ml-auto" onClick={deleteEntitiesFromChannel}>
              {t("removeEntitiesToChannels.remove")}
            </Button>
          </div>

          <Table>
            <TableHeader className="bg-primary-foreground sticky top-0">
              {channelsTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {channelsTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}{" "}
            </TableBody>
          </Table>
        </div>
      </div>
    </DialogContent>
  );
}
