import {
  Badge,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  cn,
} from '@deenruv/react-ui-devkit';

import { CollectionProductVariantsSelector, CollectionProductVariantsType } from '@/graphql/collections';
import { ITEMS_PER_PAGE } from '@/lists/useList';
import { ValueTypes } from '@deenruv/admin-types';
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
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { ImageWithPreview } from '@/components';

interface ContentsProps {
  collectionId?: string;
  filter: ValueTypes['ProductVariantFilterParameter'];
}

export const ContentsTable: React.FC<ContentsProps> = ({ collectionId, filter }) => {
  const [variants, setVariants] = useState<{ totalItems: number; items: CollectionProductVariantsType[] }>({
    totalItems: 0,
    items: [],
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
  const getCollectionProductVariants = async (collectionId: string) => {
    setTableLoading(true);
    try {
      const response = await apiClient('query')({
        collection: [
          { id: collectionId },
          {
            productVariants: [
              {
                options: {
                  take: pagination.pageSize,
                  skip: pagination.pageIndex * pagination.pageSize,
                  filter: debouncedFilter,
                },
              },
              { totalItems: true, items: CollectionProductVariantsSelector },
            ],
          },
        ],
      });
      if (response.collection) setVariants(response.collection.productVariants);
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    if (collectionId) getCollectionProductVariants(collectionId);
  }, [collectionId, pagination, debouncedFilter]);

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index);

  const columns = useMemo<ColumnDef<CollectionProductVariantsType>[]>(
    () => [
      {
        accessorKey: 'id',
        enableHiding: false,
        enableColumnFilter: false,
        header: t('table.id'),
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
        header: t('table.featuredAsset'),
        cell: ({ row }) => <ImageWithPreview src={row.original.featuredAsset?.preview} alt={row.original.name} />,
      },
      {
        accessorKey: 'product.name',
        header: () => <span>{t('drawer.product')}</span>,
      },
      {
        accessorKey: 'name',
        header: () => <span>{t('drawer.variant')}</span>,
      },

      {
        accessorKey: 'sku',
        header: () => <span>{t('drawer.sku')}</span>,
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

  const tableData = useMemo(() => (tableLoading ? Array(10).fill({}) : variants.items), [tableLoading, variants]);

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
  const totalPages = useMemo(
    () => Math.ceil(variants.totalItems / pagination.pageSize),
    [variants.totalItems, pagination.pageSize],
  );
  const pagesToShow: (number | string)[] = useMemo(
    () =>
      totalPages <= 7
        ? arrayRange(1, totalPages)
        : pagination.pageIndex < 4
          ? [...arrayRange(1, 5), 'ellipsis', totalPages]
          : pagination.pageIndex >= totalPages - 2
            ? [1, 'ellipsis', ...arrayRange(totalPages - 4, totalPages)]
            : [
                1,
                'ellipsis',
                ...arrayRange(pagination.pageIndex - 1, pagination.pageIndex + 1),
                'ellipsis',
                totalPages,
              ],
    [totalPages, pagination.pageIndex],
  );

  return (
    <>
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
      </Table>{' '}
      <Pagination className="justify-end px-2 pb-2">
        <PaginationContent>
          <PaginationPrevious
            isActive={pagination.pageIndex !== 1}
            onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
          />
          {pagesToShow.map((i, index) => (
            <PaginationItem key={index} className={cn('hidden', i !== pagination.pageIndex.toString() && 'md:block')}>
              {i === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={i === pagination.pageIndex}
                  onClick={() => setPagination((p) => ({ ...p, pageIndex: Number(i) }))}
                >
                  {i}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationNext
            isActive={pagination.pageIndex !== totalPages}
            onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
          />
        </PaginationContent>
        <Select
          value={ITEMS_PER_PAGE.find((i) => i.value === pagination.pageSize)?.value.toString()}
          onValueChange={(e) => {
            setPagination({ pageIndex: 1, pageSize: Number(e) });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('common:perPagePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE.map((i) => (
              <SelectItem key={i.name} value={i.value.toString()}>
                {t(`common:perPage.${i.name}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Pagination>
    </>
  );
};
