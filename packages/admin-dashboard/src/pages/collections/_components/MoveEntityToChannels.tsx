import {
  Badge,
  Button,
  Checkbox,
  DialogContent,
  DialogHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Routes,
  ChannelType,
  channelSelector,
  apiClient,
  DialogComponentProps,
} from '@deenruv/react-ui-devkit';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CollectionListType } from '@/graphql/collections';
import { DialogTitle } from '@radix-ui/react-dialog';

type SimpleTableData = { name: string; slug: string; id: string; breadcrumbs: { name: string; slug: string }[] };

export const MoveEntityToChannels: React.FC<
  DialogComponentProps<{ channelId: string; ids: string[] }, Row<CollectionListType>[]>
> = ({ close, reject, resolve, data: selectedCollections }) => {
  const selectedTableData = useMemo(() => selectedCollections?.map(({ original }) => original), [selectedCollections]);
  const { t } = useTranslation('collections');
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'code', value: '' },
    { id: 'token', value: '' },
  ]);
  const [channels, setChannels] = useState<{ activeChannel?: ChannelType; channels: ChannelType[] }>({ channels: [] });
  const moveCollectionToChannel = async () => {
    const channelId = channelsTable.getSelectedRowModel().rows[0].original.id;
    const ids = selectedTableData?.map((collection) => collection.id).filter((id): id is string => !!id) ?? [];
    resolve({ channelId, ids });
  };
  useEffect(() => {
    (async () => {
      const channelsResponse = await apiClient('query')({
        channels: [{ options: { take: 10 } }, { items: channelSelector, totalItems: true }],
        activeChannel: channelSelector,
      });
      setChannels({ channels: channelsResponse.channels.items, activeChannel: channelsResponse.activeChannel });
    })();
  }, []);

  const columns: ColumnDef<SimpleTableData>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableColumnFilter: false,
      header: () => t('table.id'),
      meta: { isPlaceholder: true },
      cell: ({ row }) => (
        <Badge variant="outline" className="flex w-full items-center justify-center">
          {row.original?.id ?? row.id}
          <ArrowRight className="pl-1" size={16} />
        </Badge>
      ),
    },
    {
      accessorKey: 'name',
      header: () => t('table.name'),
    },
    {
      accessorKey: 'breadcrumbs',
      header: () => t('table.breadcrumb'),
      accessorFn: (row) =>
        row.breadcrumbs
          ?.filter((crumb) => !crumb.slug.includes('root_collection'))
          .reduce((acc, curr) => (acc += `/${curr.slug}`), ''),
    },
    {
      accessorKey: 'slug',
      header: () => t('table.slug'),
    },
  ];
  const channelsColumns: ColumnDef<ChannelType>[] = [
    {
      id: 'select',
      cell: ({ row, table }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={row.original.id === channels.activeChannel?.id}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllRowsSelected(false);
              row.toggleSelected(!!value);
            }}
          />{' '}
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
      accessorKey: 'code',
      header: () => t('moveCollectionsToChannels.table.code'),
    },
    {
      accessorKey: 'token',
      header: () => t('moveCollectionsToChannels.table.token'),
    },
    {
      accessorKey: 'active',
      header: () => null,
      cell: ({ row }) =>
        row.original.id === channels.activeChannel?.id ? (
          <Badge variant="outline" className="border-green-500">
            {t('moveCollectionsToChannels.table.active')}
          </Badge>
        ) : null,
    },
  ];

  const selectedTable = useReactTable({
    data: selectedTableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const channelsTable = useReactTable({
    data: channels.channels || [],
    manualPagination: true,
    enableExpanding: true,
    columns: channelsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnFilters,
    },
  });

  const handleInputChange = (id: string, value: string) =>
    setColumnFilters((p) => {
      const filtered = p.filter((filter) => filter.id !== id);
      return [...filtered, { id, value }];
    });

  return (
    <DialogContent className="flex h-[90dvh] w-[90vw] max-w-full flex-col">
      <DialogHeader>
        <DialogTitle>
          <span>{t('moveCollectionsToChannels.moveCollections')}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="grid h-full min-h-0  grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col ">
          <h1 className="p-4">{t('moveCollectionsToChannels.selected')}</h1>

          <Table>
            <TableHeader className="bg-primary-foreground sticky top-0">
              {selectedTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {selectedTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mx-4 h-full w-[1px] bg-stone-700"></div>
        <div className="flex h-full min-h-0 flex-col ">
          <div className="flex items-center  gap-2">
            <h1 className="p-4">{t('moveCollectionsToChannels.availableChannels')}</h1>
            <Input
              placeholder={t('moveCollectionsToChannels.searchByCode')}
              className="max-w-48"
              value={(columnFilters.find((filter) => filter.id === 'code')?.value as string | undefined) ?? ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
            />
            <Input
              placeholder={t('moveCollectionsToChannels.searchByToken')}
              className="max-w-48"
              value={(columnFilters.find((filter) => filter.id === 'token')?.value as string | undefined) ?? ''}
              onChange={(e) => handleInputChange('token', e.target.value)}
            />
            <Button className="ml-auto" onClick={moveCollectionToChannel}>
              {t('moveCollectionsToChannels.move')}
            </Button>
          </div>

          <Table>
            <TableHeader className="bg-primary-foreground sticky top-0">
              {channelsTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {channelsTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}{' '}
            </TableBody>
          </Table>
        </div>
      </div>
    </DialogContent>
  );
};
