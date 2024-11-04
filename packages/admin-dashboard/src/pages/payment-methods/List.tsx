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
import { ArrowRight, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, DeleteDialog, ListButtons, ListColumnDropdown, Search, SortButton } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ParamFilterFieldTuple, PaymentMethodsSortOptions, paymentMethodsSortOptionsArray } from '@/lists/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Routes } from '@/utils';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { ListTable } from '@/components';
import { PaymentMethodListSelector, PaymentMethodListType } from '@/graphql/paymentMethods';
import { ActionsColumn } from '@/components/Columns';

const getPaymentMethods = async (options: ResolverInputTypes['PaymentMethodListOptions']) => {
  const response = await apiCall()('query')({
    paymentMethods: [{ options }, { items: PaymentMethodListSelector, totalItems: true }],
  });

  return response.paymentMethods;
};

export const PaymentMethodsListPage = () => {
  const { t } = useTranslation('paymentMethods');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'payment-methods-table-visibility',
    {
      id: false,
      name: true,
      code: true,
      enabled: true,
      createdAt: false,
      updatedAt: false,
      modalTitle: false,
    },
  );

  const {
    objects: paymentMethods,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchPaymentMethods,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getPaymentMethods({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'paymentMethods',
  });

  const [methodsToDelete, setMethodsToDelete] = useState<PaymentMethodListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteMethodsToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deletePaymentMethods: [{ ids: methodsToDelete.map((m) => m.id) }, { message: true, result: true }],
    });

    if (resp.deletePaymentMethods) {
      toast.message(t('toasts.paymentMethodDeleteSuccess'));
      refetchPaymentMethods();
      setDeleteDialogOpened(false);
      setMethodsToDelete([]);
    } else toast.error(t('toasts.paymentMethodDeleteError'));
  };

  const columns: ColumnDef<PaymentMethodListType>[] = [
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
        <Link to={Routes.paymentMethods.to(row.original.id)} className="text-primary-600">
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
    {
      accessorKey: 'enabled',
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="enabled" onClick={() => setSort('enabled')}>
          {t('table.enabled')}
        </SortButton>
      ),
      cell: ({ row }) => (row.original.enabled ? <Check /> : <X />),
    },
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
      viewRoute: Routes.paymentMethods.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setMethodsToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: paymentMethods || [],
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
    const filters: Array<ParamFilterFieldTuple<PaymentMethodsSortOptions>> = [];
    paymentMethodsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<PaymentMethodsSortOptions> = [p, paramFilterField];
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
  }, [paymentMethods]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="PaymentMethodFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            createLabel={t('create')}
            createRoute={Routes.paymentMethods.new}
            handleClick={() => {
              setMethodsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
          />
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deletePaymentMethod.title')}
          description={t('deletePaymentMethod.description')}
          deletedNames={methodsToDelete.map((z) => z.name)}
          onConfirm={deleteMethodsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
