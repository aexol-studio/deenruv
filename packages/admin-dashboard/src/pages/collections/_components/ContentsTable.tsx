import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Routes,
  EmptyState,
  apiClient,
  useDetailListHook,
  PaginationInput,
  deepMerge,
  ImageWithPreview,
  useTranslation,
  TableLabel,
} from '@deenruv/react-ui-devkit';

import { CollectionProductVariantsSelector, CollectionProductVariantsType } from '@/graphql/collections';
import { SortOrder, ValueTypes } from '@deenruv/admin-types';
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

interface ContentsProps {
  collectionId?: string;
  filter: ValueTypes['ProductVariantFilterParameter'];
}

export const ContentsTable: React.FC<ContentsProps> = ({ collectionId, filter }) => {
  const { objects, Paginate, Search, SortButton } = useDetailListHook({
    fakeURLParams: true,
    fetch: async <T, K>(
      { page, perPage, filter: filterValue, filterOperator, sort }: PaginationInput,
      customFieldsSelector?: T,
      additionalSelector?: K,
    ) => {
      const selector = deepMerge(CollectionProductVariantsSelector, additionalSelector ?? {});
      const response = await apiClient('query')({
        collection: [
          { id: collectionId },
          {
            productVariants: [
              {
                options: {
                  take: perPage,
                  skip: (page - 1) * perPage,
                  filterOperator: filterOperator,
                  sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
                  ...(filterValue && { filter: filterValue }),
                },
              },
              { totalItems: true, items: selector },
            ],
          },
        ],
      });
      return (
        response['collection']?.productVariants ?? {
          items: [],
          totalItems: 0,
        }
      );
    },
  });

  const [tableLoading, setTableLoading] = useState(false);
  const [debouncedFilter] = useDebounce(filter, 500);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnsVisibilityState, setColumnsVisibilityState] = useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { t } = useTranslation(['collections', 'common']);

  const columns = useMemo<ColumnDef<CollectionProductVariantsType>[]>(
    () => [
      {
        accessorKey: 'id',
        enableHiding: false,
        enableColumnFilter: false,
        header: () => <TableLabel>{t('table.id')}</TableLabel>,
        cell: ({ row }) => (
          <Link to={Routes.products.to(`${row.original.product.id}?tab=variants`)} className="text-primary-600">
            <Badge variant="outline" className="flex w-full items-center justify-center">
              {row.original.id}
              <ArrowRight className="pl-1" size={16} />
            </Badge>
          </Link>
        ),
      },

      {
        accessorKey: 'featuredAsset',
        header: () => <TableLabel>{t('table.featuredAsset')}</TableLabel>,
        cell: ({ row }) => <ImageWithPreview src={row.original.featuredAsset?.preview} alt={row.original.name} />,
      },
      {
        accessorKey: 'product.name',
        header: () => <TableLabel>{t('drawer.product')}</TableLabel>,
      },
      {
        accessorKey: 'name',
        header: () => <TableLabel>{t('drawer.variant')}</TableLabel>,
      },

      {
        accessorKey: 'sku',
        header: () => <TableLabel>{t('drawer.sku')}</TableLabel>,
      },
    ],
    [t],
  );
  const tableColumns = useMemo(
    () =>
      tableLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-12 w-full rounded-sm" />,
          }))
        : columns,

    [tableLoading],
  );

  const tableData = useMemo(() => (tableLoading ? Array(10).fill({}) : objects || []), [tableLoading, objects]);

  const table = useReactTable({
    data: tableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns: tableColumns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnsVisibilityState,
    state: {
      columnFilters,
      columnVisibility: columnsVisibilityState,
      pagination,
    },
  });

  return (
    <>
      {Search}
      <Table className="w-full" {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}>
        <TableHeader className="bg-primary-foreground sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <>
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              </>
            ))
          ) : (
            <EmptyState
              columnsLength={columns.length}
              filtered={false}
              title={t(`common:emptyState.default.empty.title`)}
              description={t(`common:emptyState.default.empty.text`)}
            />
          )}
        </TableBody>
      </Table>
      {Paginate}
    </>
  );
};
