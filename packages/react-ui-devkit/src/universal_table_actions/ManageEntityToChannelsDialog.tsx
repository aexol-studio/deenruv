import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, Info } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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
  TableLabel,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/index.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import { priceFormatter } from "@/utils/price-formatter.js";

export function ManageEntityToChannelsDialog<T extends { id: string }>({
  close,
  reject,
  resolve,
  data: { items, withPriceFactor },
}: DialogComponentProps<
  { channelId: string; ids: string[]; priceFactor?: number },
  { items: T[]; withPriceFactor?: boolean }
>) {
  const { t } = useTranslation("collections");
  const [priceFactor, setPriceFactor] = useState(1);
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
    resolve({ channelId, ids, ...(withPriceFactor ? { priceFactor } : {}) });
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
      ...(withPriceFactor
        ? [
            {
              id: "priceBefore",
              accessorKey: "priceBefore",
              header: () => (
                <div className="flex gap-2 items-center">
                  <TableLabel>
                    {t("moveCollectionsToChannels.table.priceBefore")}
                  </TableLabel>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Info className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Cena dotyczy najdroższego wariantu produktu
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ),
              cell: ({ row }: any) => {
                if ("variantList" in row.original) {
                  const price = row.original.variantList?.items[0]?.price;
                  const priceWithTax =
                    row.original.variantList?.items[0]?.priceWithTax;
                  const originalCurrencyCode =
                    row.original.variantList?.items[0]?.currencyCode;

                  return (
                    <span>
                      {priceWithTax
                        ? priceFormatter(priceWithTax, originalCurrencyCode)
                        : "N/A"}
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        (
                        {price
                          ? priceFormatter(price, originalCurrencyCode)
                          : "N/A"}
                        )
                      </span>
                    </span>
                  );
                }
                return <span>N/A</span>;
              },
            },
            {
              id: "priceAfter",
              accessorKey: "priceAfter",
              header: () => (
                <div className="flex gap-2 items-center">
                  <TableLabel>
                    {t("moveCollectionsToChannels.table.priceAfter")}
                  </TableLabel>{" "}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Info className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Cena dotyczy najdroższego wariantu produktu
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ),
              cell: ({ row }: any) => {
                if ("variantList" in row.original) {
                  const price = row.original.variantList?.items[0]?.price;
                  const priceWithTax =
                    row.original.variantList?.items[0]?.priceWithTax;
                  const selectedCurrencyCode = channelsTable
                    .getSelectedRowModel()
                    ?.rows?.at(0)?.original?.currencyCode;

                  return (
                    <span>
                      {priceWithTax
                        ? priceFormatter(
                            priceWithTax * priceFactor,
                            selectedCurrencyCode,
                          )
                        : "N/A"}
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        (
                        {price
                          ? priceFormatter(
                              price * priceFactor,
                              selectedCurrencyCode,
                            )
                          : "N/A"}
                        )
                      </span>
                    </span>
                  );
                }
                return <span>N/A</span>;
              },
            },
          ]
        : []),
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
        header: () => (
          <TableLabel>{t("moveCollectionsToChannels.table.code")}</TableLabel>
        ),
      },
      {
        accessorKey: "token",
        header: () => (
          <TableLabel>{t("moveCollectionsToChannels.table.token")}</TableLabel>
        ),
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

  const isValid = useMemo(() => {
    return channelsTable.getSelectedRowModel().rows.length > 0;
  }, [channelsTable.getSelectedRowModel().rows.length]);

  return (
    <DialogContent className="flex h-[90dvh] w-[90vw] max-w-full flex-col">
      <DialogHeader>
        <DialogTitle>
          <span>{t("moveCollectionsToChannels.moveCollections")}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="grid h-full min-h-0  grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col ">
          <div className="flex items-center justify-between  gap-2">
            <h1 className="p-4">{t("moveCollectionsToChannels.selected")}</h1>
            {withPriceFactor && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t("moveCollectionsToChannels.priceFactor")}
                </span>
                <Input
                  min={1}
                  className="w-24"
                  type="number"
                  value={priceFactor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) setPriceFactor(parseFloat(value));
                    else setPriceFactor(1);
                  }}
                />
              </div>
            )}
          </div>
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
          <div className="flex items-center justify-between  gap-2">
            <h1 className="p-4">
              {t("moveCollectionsToChannels.availableChannels")}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                className="ml-auto"
                onClick={moveCollectionToChannel}
                disabled={!isValid}
              >
                {t("moveCollectionsToChannels.move")}
              </Button>
            </div>
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
