import { apiCall } from '@/graphql/client';

import { useList } from '@/lists/useList';
import { ResolverInputTypes, SortOrder } from '@/zeus';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Routes } from '@/utils';
import {
  Button,
  Badge,
  Checkbox,
  Search,
  Stack,
  TranslationSelect,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  ListTable,
} from '@/components';
import { useSettings } from '@/state';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks';
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
import { PaginationInput } from '@/lists/models';

import { format } from 'date-fns';
import { CountryListType, CountrySelector } from '@/graphql/settings';
import { CountryActionModal } from './_components/CountryActionModal';

const SortButton: React.FC<
  PropsWithChildren<{ sortKey: string; currSort: PaginationInput['sort']; onClick: () => void }>
> = ({ currSort, onClick, children, sortKey }) => {
  return (
    <Button variant="ghost" className="w-full justify-start" onClick={onClick}>
      {children}
      {currSort && currSort.key === sortKey ? (
        currSort.sortDir === SortOrder.ASC ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

const getCountries = async (options: ResolverInputTypes['CountryListOptions']) => {
  const response = await apiCall()('query')({
    countries: [{ options }, { items: CountrySelector, totalItems: true }],
  });
  return response.countries;
};

export const CountriesPage = () => {
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('products');

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
  const [countryToEdit, setCountryToEdit] = useState<CountryListType | undefined>();

  const [countryAction, setCountryAction] = useState<'create' | 'edit' | 'delete' | undefined>();

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
          <Link to={Routes.product.to(row.original.id)} className="text-primary-600">
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
          Kod
        </SortButton>
      ),
      cell: ({ row }) => <div className="text-nowrap pl-4">{row.original.name}</div>,
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
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('table.openMenu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCountryAction('edit');
                setCountryToEdit(row.original);
              }}
              className="item-center group flex cursor-pointer justify-between gap-2"
            >
              Edytuj kraj
              <Pencil className="h-4 w-4 group-hover:text-blue-600" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="item-center group flex cursor-pointer justify-between  gap-2"
              onClick={() => {
                setCountryAction('delete');
                setCountriesToDelete([row.original]);
              }}
            >
              <span>Usuń kraj</span>
              <Trash className="h-4 w-4 group-hover:text-red-600" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationsLanguage]);

  const onActionSucess = () => {
    refetchCountries();
    setCountryAction(undefined);
  };
  const onActionModalClose = () => {
    setCountriesToDelete([]);
    setCountryToEdit(undefined);
    setCountryAction(undefined);
  };
  return (
    <Stack column className="gap-6">
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
          <div className="flex gap-2">
            <Button onClick={() => setCountryAction('create')}>Dodaj nowy kraj</Button>
          </div>
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <CountryActionModal
          action={countryAction}
          countriesToDelete={countriesToDelete}
          countryToEdit={countryToEdit}
          onClose={onActionModalClose}
          onActionSucess={onActionSucess}
        />
      </div>
    </Stack>
  );
};
