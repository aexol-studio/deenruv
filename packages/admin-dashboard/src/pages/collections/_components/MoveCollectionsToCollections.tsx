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
  apiClient,
  DialogComponentProps,
  useTranslation,
  TableLabel,
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
import { CollectionListSelector, CollectionListType } from '@/graphql/collections';
import { toast } from 'sonner';
import { ModelTypes } from '@deenruv/admin-types';

type SimpleTableData = { name: string; slug: string; id: string; breadcrumbs: { name: string; slug: string }[] };

export const MoveCollectionsToCollections: React.FC<
  DialogComponentProps<Array<ModelTypes['MoveCollectionInput']>, Row<CollectionListType>[]>
> = ({ close, reject, resolve, data: selectedCollections }) => {
  const [allCollections, setAllCollections] = useState<CollectionListType[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await apiClient('query')({
        collections: [{ options: { topLevelOnly: false } }, { items: CollectionListSelector }],
      });
      setAllCollections(response.collections.items);
    };
    fetchCollections();
  }, []);

  const selectedTableData = useMemo(() => selectedCollections?.map(({ original }) => original), [selectedCollections]);
  const { t } = useTranslation('collections');
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: 'name', value: '' }]);

  const moveCollection = async () => {
    const selectedCollection = allCollectionsTable.getSelectedRowModel().rows[0].original.id;
    const payload = selectedTableData?.map((collection) => ({
      collectionId: collection.id,
      parentId: selectedCollection,
      index: 0,
    }));

    if (!payload) {
      toast.error(t('moveCollectionsToCollections.selectCollection'));
      return;
    }
    resolve(payload);
  };

  const columns: ColumnDef<SimpleTableData>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableColumnFilter: false,
      header: () => <TableLabel>{t('table.id')}</TableLabel>,
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
      header: () => <TableLabel>{t('table.name')}</TableLabel>,
      filterFn: 'includesString',
    },
    {
      accessorKey: 'breadcrumbs',
      header: () => <TableLabel>{t('table.breadcrumb')}</TableLabel>,
      accessorFn: (row) =>
        row.breadcrumbs
          ?.filter((crumb) => !crumb.slug.includes('root_collection'))
          .reduce((acc, curr) => (acc += `/${curr.slug}`), ''),
    },
    {
      accessorKey: 'slug',
      header: () => <TableLabel>{t('table.slug')}</TableLabel>,
    },
  ];
  const allCollectionsColumns: ColumnDef<SimpleTableData>[] = [
    {
      id: 'select',
      cell: ({ row, table }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllRowsSelected(false);
              row.toggleSelected(!!value);
            }}
          />
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
    ...columns,
  ];

  const allTableData = useMemo(
    () => allCollections.filter((row) => selectedTableData?.every((selectedRow) => selectedRow.id !== row.id)),
    [allCollections, selectedTableData],
  );

  const selectedTable = useReactTable({
    data: selectedTableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const allCollectionsTable = useReactTable({
    data: allTableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns: allCollectionsColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnFilters,
    },
  });

  return (
    <DialogContent className="flex h-[90dvh] w-[90vw] max-w-full flex-col">
      <DialogHeader>
        <DialogTitle>
          <span>{t('moveCollectionsToCollections.moveCollections')}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="grid h-full min-h-0 grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col">
          <h1 className="p-4">{t('moveCollectionsToCollections.selected')}</h1>

          <Table>
            <TableHeader className="sticky top-0 bg-primary-foreground">
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
        <div className="mx-4 h-full w-px bg-stone-700"></div>
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center gap-2">
            <h1 className="shrink-0 p-4"> {t('moveCollectionsToCollections.targetCollection')}</h1>
            <Input
              placeholder={t('moveCollectionsToCollections.searchByName')}
              className="max-w-48"
              value={columnFilters[0].value as string}
              onChange={(e) => setColumnFilters([{ id: 'name', value: e.target.value }])}
            />
            <Button className="ml-auto" onClick={moveCollection}>
              {t('moveCollectionsToCollections.move')}
            </Button>
          </div>

          <Table>
            <TableHeader className="sticky top-0 bg-primary-foreground">
              {allCollectionsTable.getHeaderGroups().map((headerGroup) => (
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
              {allCollectionsTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}{' '}
            </TableBody>
          </Table>
        </div>
      </div>{' '}
    </DialogContent>
  );
};
