import { Stack } from '@/components/Stack';
import { useList } from '@/lists/useList';
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
import { Routes, Badge, Checkbox, SortButton, useLocalStorage, ListTable, apiClient } from '@deenruv/react-ui-devkit';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ParamFilterFieldTuple, ShippingMethodsSortOptions, shippingMethodsSortOptionsArray } from '@/lists/types';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { DeleteDialog, ListButtons, ListColumnDropdown, Search } from '@/components';
import { ShippingMethodListSelector, ShippingMethodListType } from '@/graphql/shippingMethods';
import { ActionsColumn } from '@/components/Columns';
import CreatedAtColumn from '@/components/Columns/CreatedAtColumn';
import UpdatedAtColumn from '@/components/Columns/UpdatedAtColumn';

const getShippingMethods = async (options: ResolverInputTypes['StockLocationListOptions']) => {
  const response = await apiClient('query')({
    shippingMethods: [{ options }, { items: ShippingMethodListSelector, totalItems: true }],
  });

  return response.shippingMethods;
};

export const ShippingMethodsListPage = () => {
  const { t } = useTranslation('shippingMethods');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'shipping-methods-table-visibility',
    {
      id: false,
      name: true,
      code: true,
      createdAt: false,
      updatedAt: false,
      modalTitle: false,
    },
  );

  const {
    objects: shippingMethods,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchShippingMethods,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getShippingMethods({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'shippingMethods',
  });

  const [methodsToDelete, setMethodsToDelete] = useState<ShippingMethodListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchShippingMethods();
  }, []);

  const deleteMethodsToDelete = async () => {
    const resp = await apiClient('mutation')({
      deleteShippingMethods: [{ ids: methodsToDelete.map((m) => m.id) }, { message: true, result: true }],
    });

    if (resp.deleteShippingMethods) {
      toast.message(t('toasts.shippingMethodDeleteSuccess'));
      refetchShippingMethods();
      setDeleteDialogOpened(false);
      setMethodsToDelete([]);
    } else toast.error(t('toasts.shippingMethodDeleteError'));
  };

  const columns: ColumnDef<ShippingMethodListType>[] = [
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
        <Link to={Routes.shippingMethods.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.name}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'code',
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('code')}>
          {t('table.code')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.code,
    },
    CreatedAtColumn({
      currSort: optionInfo.sort,
      setSort: () => setSort('createdAt'),
    }),
    UpdatedAtColumn({
      currSort: optionInfo.sort,
      setSort: () => setSort('updatedAt'),
    }),
    // {
    //   accessorKey: 'modalTitle',
    //   enableColumnFilter: true,
    //   header: () => (
    //     <SortButton currSort={optionInfo.sort} sortKey="modalTitle" onClick={() => setSort('modalTitle')}>
    //       {t('table.modalTitle')}
    //     </SortButton>
    //   ),
    //   cell: ({ row }) => row.original.customFields?.modalTitle,
    // },
    ActionsColumn({
      viewRoute: Routes.shippingMethods.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setMethodsToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: shippingMethods || [],
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
    const filters: Array<ParamFilterFieldTuple<ShippingMethodsSortOptions>> = [];
    shippingMethodsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<ShippingMethodsSortOptions> = [p, paramFilterField];
          filters.push(paramFilterTuple);
        }

        filterObj = {
          ...filterObj,
          [p]: searchParams.get(p),
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters.forEach((f) => setFilterField(f[0] as any, f[1]));
  }, [searchParams, setFilterField]);

  useEffect(() => {
    setRowSelection({});
    setMethodsToDelete([]);
  }, [shippingMethods]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="ShippingMethodFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            createLabel={t('create')}
            createRoute={Routes.shippingMethods.new}
            handleClick={() => {
              setMethodsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteShippingMethod.title')}
          description={t('deleteShippingMethod.description')}
          deletedNames={methodsToDelete.map((z) => z.name)}
          onConfirm={deleteMethodsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
