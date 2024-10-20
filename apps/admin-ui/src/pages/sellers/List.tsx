import { apiCall } from '@/graphql/client';
import { Stack } from '@/components/Stack';
import { useList } from '@/lists/useList';
import { format } from 'date-fns';
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, DeleteDialog, ListButtons, ListColumnDropdown, Search, SortButton } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ParamFilterFieldTuple, SellersSortOptions, sellersSortOptionsArray } from '@/lists/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Routes } from '@/utils';
import { ResolverInputTypes, SortOrder } from '@/zeus';
import { ListTable } from '@/components';
import { SellerListSelector, SellerListType } from '@/graphql/sellers';
import { ActionsColumn } from '@/components/Columns';

const getSellers = async (options: ResolverInputTypes['ZoneListOptions']) => {
  const response = await apiCall()('query')({
    sellers: [{ options }, { items: SellerListSelector, totalItems: true }],
  });

  return response.sellers;
};

export const SellersListPage = () => {
  const { t } = useTranslation('sellers');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'sellers-table-visibility',
    {
      id: false,
      code: true,
      createdAt: false,
      updatedAt: false,
      token: true,
    },
  );

  const {
    objects: sellers,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchSellers,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getSellers({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'sellers',
  });

  const [sellersToDelete, setSellersToDelete] = useState<SellerListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteSellersToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteSellers: [{ ids: sellersToDelete.map((ch) => ch.id) }, { message: true, result: true }],
    });

    if (resp.deleteSellers) {
      toast.message(t('toasts.sellerDeleteSuccess'));
      refetchSellers();
      setDeleteDialogOpened(false);
      setSellersToDelete([]);
    } else toast.error(t('toasts.sellerDeleteError'));
  };

  const columns: ColumnDef<SellerListType>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'id',
      header: () => <div> {t('table.id')}</div>,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: 'name',
      enableHiding: true,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="name" onClick={() => setSort('name')}>
          {t('table.name')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.sellers.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.name}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="createdAt" onClick={() => setSort('createdAt')}>
          {t('table.createdAt')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">{format(new Date(row.original.createdAt), 'dd.MM.yyyy hh:mm')}</div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="updatedAt" onClick={() => setSort('updatedAt')}>
          {t('table.updatedAt')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">
          {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm') : ''}
        </div>
      ),
    },
    ActionsColumn({
      viewRoute: Routes.sellers.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setSellersToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: sellers || [],
    manualPagination: true,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnsVisibilityState,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility: columnsVisibilityState,
      rowSelection,
      pagination: { pageIndex: optionInfo.page, pageSize: optionInfo.perPage },
    },
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    let filterObj = {};
    const filters: Array<ParamFilterFieldTuple<SellersSortOptions>> = [];
    sellersSortOptionsArray.forEach((o) => {
      if (searchParams.has(o)) {
        const param = searchParams.get(o);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<SellersSortOptions> = [o, paramFilterField];
          filters.push(paramFilterTuple);
        }

        filterObj = {
          ...filterObj,
          [o]: searchParams.get(o),
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters.forEach((f) => setFilterField(f[0] as any, f[1]));
  }, [searchParams, setFilterField]);

  useEffect(() => {
    setRowSelection({});
    setSellersToDelete([]);
  }, [sellers]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="ZoneFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            createLabel={t('create')}
            createRoute={Routes.sellers.new}
            handleClick={() => {
              setSellersToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
          />
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteSeller.title')}
          description={t('deleteSeller.description')}
          deletedNames={sellersToDelete.map((z) => z.name)}
          onConfirm={deleteSellersToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
