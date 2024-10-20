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
import { ArrowRight, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, DeleteDialog, ListButtons, ListColumnDropdown, Search, SortButton } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Routes } from '@/utils';
import { ResolverInputTypes, SortOrder } from '@/zeus';
import { ListTable } from '@/components';
import { ParamFilterFieldTuple, TaxRatesSortOptions, taxCategoriesSortOptionsArray } from '@/lists/types';
import { TaxRateListSelector, TaxRateListType } from '@/graphql/taxRates';
import { ActionsColumn } from '@/components/Columns';

const getTaxRates = async (options: ResolverInputTypes['TaxRateListOptions']) => {
  const response = await apiCall()('query')({
    taxRates: [{ options }, { items: TaxRateListSelector, totalItems: true }],
  });

  return response.taxRates;
};

export const TaxRatesListPage = () => {
  const { t } = useTranslation('taxRates');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'tax-rates-table-visibility',
    {
      id: false,
      createdAt: false,
      updatedAt: false,
      value: true,
      taxCategory: true,
      zone: true,
      customerGroup: false,
      enabled: true,
    },
  );

  const {
    objects: taxRates,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchTaxRates,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getTaxRates({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'taxRates',
  });

  const [taxRatesToDelete, setTaxRatesToDelete] = useState<TaxRateListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchTaxRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTaxRatesToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteTaxRates: [{ ids: taxRatesToDelete.map((ch) => ch.id) }, { message: true, result: true }],
    });

    if (resp.deleteTaxRates) {
      toast.message(t('toasts.taxRateDeleteSuccess'));
      refetchTaxRates();
      setDeleteDialogOpened(false);
      setTaxRatesToDelete([]);
    } else toast.error(t('toasts.taxRateDeleteError'));
  };

  const columns: ColumnDef<TaxRateListType>[] = [
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
        <Link to={Routes.taxRates.to(row.original.id)} className="text-primary-600">
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
    {
      accessorKey: 'taxCategory',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="taxCategory" onClick={() => setSort('taxCategory')}>
          {t('table.taxCategory')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: 'zone',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="zone" onClick={() => setSort('zone')}>
          {t('table.zone')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.zone.name,
    },
    {
      accessorKey: 'customerGroup',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="customerGroup" onClick={() => setSort('customerGroup')}>
          {t('table.customerGroup')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.customerGroup?.name,
    },
    {
      accessorKey: 'value',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="value" onClick={() => setSort('value')}>
          {t('table.value')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.value,
    },
    {
      accessorKey: 'enabled',
      enableColumnFilter: false,
      header: () => t('table.enabled'),
      cell: ({ row }) => (row.original.enabled ? <Check /> : <X />),
    },
    ActionsColumn({
      viewRoute: Routes.taxRates.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setTaxRatesToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: taxRates || [],
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
    const filters: Array<ParamFilterFieldTuple<TaxRatesSortOptions>> = [];
    taxCategoriesSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<TaxRatesSortOptions> = [p, paramFilterField];
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
    setTaxRatesToDelete([]);
  }, [taxRates]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="TaxRateFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            createLabel={t('create')}
            createRoute={Routes.taxRates.new}
            handleClick={() => {
              setTaxRatesToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
          />
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteTaxRate.title')}
          description={t('deleteTaxRate.description')}
          deletedNames={taxRatesToDelete.map((c) => c.name)}
          onConfirm={deleteTaxRatesToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
