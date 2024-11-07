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
import { Routes, Badge, Checkbox } from '@deenruv/react-ui-devkit';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { ListTable, DeleteDialog, ListButtons, ListColumnDropdown, Search, SortButton } from '@/components';
import { TaxCategoryListSelector, TaxCategoryListType } from '@/graphql/taxCategories';
import { ParamFilterFieldTuple, TaxCategoriesSortOptions, taxCategoriesSortOptionsArray } from '@/lists/types';
import { ActionsColumn } from '@/components/Columns';

const getTaxCategories = async (options: ResolverInputTypes['TaxCategoryListOptions']) => {
  const response = await apiCall()('query')({
    taxCategories: [{ options }, { items: TaxCategoryListSelector, totalItems: true }],
  });

  return response.taxCategories;
};

export const TaxCategoriesListPage = () => {
  const { t } = useTranslation('taxCategories');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'tax-categories-table-visibility',
    {
      id: false,
      code: true,
      createdAt: false,
      updatedAt: false,
      token: true,
    },
  );

  const {
    objects: taxCategories,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchTaxCategories,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getTaxCategories({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'taxCategories',
  });

  const [taxCategoriesToDelete, setTaxCategoriesToDelete] = useState<TaxCategoryListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchTaxCategories();
  }, []);

  const deleteTaxCategoriesToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteTaxCategories: [{ ids: taxCategoriesToDelete.map((ch) => ch.id) }, { message: true, result: true }],
    });

    if (resp.deleteTaxCategories) {
      toast.message(t('toasts.taxCategoryDeleteSuccess'));
      refetchTaxCategories();
      setDeleteDialogOpened(false);
      setTaxCategoriesToDelete([]);
    } else toast.error(t('toasts.taxCategoryDeleteError'));
  };

  const columns: ColumnDef<TaxCategoryListType>[] = [
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
        <Link to={Routes.taxCategories.to(row.original.id)} className="text-primary-600">
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
      accessorKey: 'isDefault',
      enableColumnFilter: false,
      header: () => t('table.isDefault'),
      cell: ({ row }) => (row.original.isDefault ? <Check /> : <X />),
    },
    ActionsColumn({
      viewRoute: Routes.taxCategories.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setTaxCategoriesToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: taxCategories || [],
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
    const filters: Array<ParamFilterFieldTuple<TaxCategoriesSortOptions>> = [];
    taxCategoriesSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<TaxCategoriesSortOptions> = [p, paramFilterField];
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
    setTaxCategoriesToDelete([]);
  }, [taxCategories]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="TaxCategoryFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            createLabel={t('create')}
            createRoute={Routes.taxCategories.new}
            handleClick={() => {
              setTaxCategoriesToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteTaxCategory.title')}
          description={t('deleteTaxCategory.description')}
          deletedNames={taxCategoriesToDelete.map((c) => c.name)}
          onConfirm={deleteTaxCategoriesToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
