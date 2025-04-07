import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DialogComponentProps } from "@/universal_utils/createDialogFromComponentFunction.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { channelSelector, ChannelType } from "@/selectors/BaseSelectors.js";
import {
  Badge,
  Button,
  Checkbox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/index.js";
import { useTranslation } from "@/hooks/useTranslation.js";

export function MoveEntityToChannels<T extends { id: string }>({
  close,
  reject,
  resolve,
  data: { items },
}: DialogComponentProps<{ channelId: string; ids: string[] }, { items: T[] }>) {
  const { t } = useTranslation("collections");
  const [rowSelection, setRowSelection] = useState({});
  const [channels, setChannels] = useState<{
    activeChannel?: ChannelType;
    channels: ChannelType[];
  }>({
    channels: [],
  });
  const moveCollectionToChannel = async () => {
    const channelId = channelsTable.getSelectedRowModel().rows[0].original.id;
    const ids =
      items
        ?.map((collection) => collection.id)
        .filter((id): id is string => !!id) ?? [];
    resolve({ channelId, ids });
  };

  useEffect(() => {
    (async () => {
      const channelsResponse = await apiClient("query")({
        channels: [
          { options: { take: 10 } },
          { items: channelSelector, totalItems: true },
        ],
        activeChannel: channelSelector,
      });
      setChannels({
        channels: channelsResponse.channels.items,
        activeChannel: channelsResponse.activeChannel,
      });
    })();
  }, []);

  const selectedTable = useReactTable({
    data: items || [],
    manualPagination: true,
    enableExpanding: true,
    columns: [
      {
        accessorKey: "id",
        enableHiding: false,
        enableColumnFilter: false,
        header: () => t("table.id"),
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
        header: () => t("table.name"),
      },
      {
        accessorKey: "slug",
        header: () => t("table.slug"),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  const channelsTable = useReactTable({
    data: channels.channels || [],
    manualPagination: true,
    enableExpanding: true,
    columns: [
      {
        id: "select",
        cell: ({ row, table }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              disabled={row.original.id === channels.activeChannel?.id}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                table.toggleAllRowsSelected(false);
                row.toggleSelected(!!value);
              }}
            />{" "}
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
        header: () => t("moveCollectionsToChannels.table.code"),
      },
      {
        accessorKey: "token",
        header: () => t("moveCollectionsToChannels.table.token"),
      },
      {
        accessorKey: "active",
        header: () => null,
        cell: ({ row }) =>
          row.original.id === channels.activeChannel?.id ? (
            <Badge variant="outline" className="border-green-500">
              {t("moveCollectionsToChannels.table.active")}
            </Badge>
          ) : null,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return (
    <DialogContent className="flex h-[90dvh] w-[90vw] max-w-full flex-col">
      <DialogHeader>
        <DialogTitle>
          <span>{t("moveCollectionsToChannels.moveCollections")}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="grid h-full min-h-0  grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col ">
          <h1 className="p-4">{t("moveCollectionsToChannels.selected")}</h1>

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
              {t("moveCollectionsToChannels.availableChannels")}
            </h1>
            <Button className="ml-auto" onClick={moveCollectionToChannel}>
              {t("moveCollectionsToChannels.move")}
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
