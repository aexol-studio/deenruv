import { useList } from '@/lists/useList';
import { Permission, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

import {
  Routes,
  Button,
  Badge,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  useSettings,
  useLocalStorage,
  SortButton,
  TranslationSelect,
  ListTable,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { DeleteDialog, ListButtons, Search, Stack } from '@/components';
import { useEffect, useState } from 'react';
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
import { CountriesSortOptions, ParamFilterFieldTuple, countriesSortOptionsArray } from '@/lists/types';

import { format } from 'date-fns';
import { CountryListType, CountrySelector } from '@/graphql/settings';
import { BooleanCell } from '@/components/Columns/BooleanCell.js';
import { toast } from 'sonner';
import { ActionsColumn } from '@/components/Columns';

const getCountries = async (options: ResolverInputTypes['CountryListOptions']) => {
  const response = await apiClient('query')({
    countries: [{ options }, { items: CountrySelector, totalItems: true }],
  });
  return response.countries;
};

export const CountriesListPage = () => {
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('countries');
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const deleteCountriesToDelete = async () => {
    const resp = await apiClient('mutation')({
      deleteCountries: [{ ids: countriesToDelete.map((c) => c.id) }, { message: true, result: true }],
    });

    if (resp.deleteCountries) {
      toast.message(t('toasts.countryDeleteSuccess'));
      refetchCountries();
      setDeleteDialogOpened(false);
      setCountriesToDelete([]);
    } else toast.error(t('toasts.countryDeleteError'));
  };

  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'countries-table-visibility',
    {},
  );

  const {
    objects: countries,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchCountries,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getCountries({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'countries-list',
  });

  const [countriesToDelete, setCountriesToDelete] = useState<CountryListType[]>([]);

  const columns: ColumnDef<CountryListType>[] = [
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
      enableHiding: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="id" onClick={() => setSort('id')}>
          {t('table.id')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="pl-4">
          <Link to={Routes.countries.to(row.original.id)} className="text-primary-600">
            <Badge variant="outline" className="flex  w-max items-center justify-center">
              {row.original.id}
              <ArrowRight className="pl-1" size={16} />
            </Badge>
          </Link>
        </div>
      ),
    },

    {
      accessorKey: 'name',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="name" onClick={() => setSort('name')}>
          {t('table.name')}
        </SortButton>
      ),
      cell: ({ row }) => <div className="text-nowrap pl-4">{row.original.name}</div>,
    },
    {
      accessorKey: 'code',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('code')}>
          {t('table.code')}
        </SortButton>
      ),
      cell: ({ row }) => <div className="text-nowrap pl-4">{row.original.code}</div>,
    },
    {
      accessorKey: 'enabled',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="enabled" onClick={() => setSort('enabled')}>
          {t('table.enabled')}
        </SortButton>
      ),
      cell: ({ row }) => <BooleanCell value={row.original.enabled} />,
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="createdAt" onClick={() => setSort('createdAt')}>
          {t('table.createdAt')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap pl-4">{format(new Date(row.original.createdAt), 'dd.MM.yyyy hh:mm')}</div>
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
        <div className="text-nowrap pl-4">{format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm')}</div>
      ),
    },
    ActionsColumn({
      viewRoute: Routes.countries.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setCountriesToDelete([row.original]);
      },
      deletePermission: Permission.DeleteCountry,
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: countries || [],
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
    const filters: Array<ParamFilterFieldTuple<CountriesSortOptions>> = [];

    countriesSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<CountriesSortOptions> = [p, paramFilterField];
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
    refetchCountries();
  }, [translationsLanguage]);

  return (
    <Stack column className="gap-6 px-4 py-2 md:px-8 md:py-4">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <TranslationSelect />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t('columns')} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Search
            filter={optionInfo.filter}
            type="CountryFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            createLabel={t('create')}
            createRoute={Routes.countries.new}
            handleClick={() => {
              setCountriesToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            createPermission={Permission.CreateCountry}
            deletePermission={Permission.DeleteCountry}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteCountry.title')}
          description={t('deleteCountry.description')}
          deletedNames={countriesToDelete.map((c) => c.name)}
          onConfirm={deleteCountriesToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
