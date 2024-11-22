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
  Routes,
  apiClient,
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
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CollectionListType } from '@/graphql/collections';

import { toast } from 'sonner';

type SimpleTableData = { name: string; slug: string; id: string; breadcrumbs: { name: string; slug: string }[] };
interface MoveCollectionsTablesProps {
  selectedCollections: Row<CollectionListType>[];
  allCollections: Row<CollectionListType>[];
  refetchCollections: () => void;
  onClose: () => void;
}
const rootColectionRow = { name: 'Kolejkcja źródłowa', slug: '/', id: '1', breadcrumbs: [{ name: '/', slug: '' }] };

export const MoveCollectionsToCollections: React.FC<MoveCollectionsTablesProps> = ({
  allCollections,
  refetchCollections,
  selectedCollections,
  onClose,
}) => {
  const { t } = useTranslation('collections');
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'name',
      value: '',
    },
  ]);
  const moveCollection = async () => {
    try {
      const response = await Promise.all(
        selectedTableData
          .map((t) => t.id)
          .map(async (collectionId) => {
            const response = await apiClient('mutation')({
              moveCollection: [
                {
                  input: {
                    collectionId,
                    parentId: allCollectionsTable.getSelectedRowModel().rows[0].original.id,
                    index: 0,
                  },
                },
                { __typename: true },
              ],
            });
            return response.moveCollection.__typename === 'Collection';
          }),
      );
      if (response.filter((r) => Boolean(r)).length === selectedTableData.length) {
        toast.success(t('moveCollectionsToCollections.movedAllCollections'));
        refetchCollections();
        return;
      }
      toast.success(t('moveCollectionsToCollections.movedPartOfCollections'));
      refetchCollections();
    } catch (e) {
      console.log(e);
      toast.success(t('moveCollectionsToCollections.moveError'));
    } finally {
      onClose();
    }
  };

  const columns: ColumnDef<SimpleTableData>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableColumnFilter: false,
      header: () => t('table.id'),
      meta: { isPlaceholder: true },
      cell: ({ row }) => (
        <Link to={Routes.collections.to(row.original?.id ?? row.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center">
            {row.original?.id ?? row.id}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'name',
      header: () => t('table.name'),
      filterFn: 'includesString',
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
          />{' '}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    ...columns,
  ];
  const selectedTableData = useMemo(() => selectedCollections.map(({ original }) => original), [selectedCollections]);

  const alltableData = useMemo(
    () =>
      [rootColectionRow, ...allCollections.map(({ original }) => original)].filter((row) =>
        selectedTableData.every((selectedRow) => {
          return selectedRow.id !== row.id;
        }),
      ),
    [allCollections, selectedTableData],
  );

  const selectedTable = useReactTable({
    data: selectedTableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const allCollectionsTable = useReactTable({
    data: alltableData || [],
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
      <div className="grid h-full min-h-0  grid-cols-[1fr_auto_1fr]">
        <div className="flex h-full min-h-0 flex-col ">
          <h1 className="p-4">{t('moveCollectionsToCollections.selected')}</h1>

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
            <TableHeader className="bg-primary-foreground sticky top-0">
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
