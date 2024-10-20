import { apiCall } from '@/graphql/client';
import { Stack } from '@/components/Stack';
import { Button } from '@/components/ui/button';
import { useList } from '@/lists/useList';
import { DeletionResult, ResolverInputTypes, SortOrder } from '@/zeus';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, DeleteDialog, ListTable, Search, SortButton } from '@/components';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { FacetsSortOptions, ParamFilterFieldTuple, facetsSortOptionsArray } from '@/lists/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Routes } from '@/utils';
import { FacetListSelector, FacetListType } from '@/graphql/facets';
import facetsJson from '@/locales/en/facets.json';

const getFacets = async (options: ResolverInputTypes['FacetListOptions']) => {
  const response = await apiCall()('query')({
    facets: [
      { options },
      {
        totalItems: true,
        items: FacetListSelector,
      },
    ],
  });

  return response.facets;
};

export const FacetsListPage = () => {
  const { t } = useTranslation('facets');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'facets-table-visibility',
    {
      id: false,
      name: true,
      code: true,
      createdAt: false,
      updatedAt: false,
      isPrivate: true,
      usedForColors: false,
      colorsCollection: false,
      values: true,
    },
  );

  const {
    objects: facets,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchFacets,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getFacets({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'facets',
  });

  const [facetsToDelete, setFacetsToDelete] = useState<FacetListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const deleteFacetsToDelete = async () => {
    const resp = await Promise.all(
      facetsToDelete.map((i) =>
        apiCall()('mutation')({ deleteFacet: [{ id: i.id }, { message: true, result: true }] }),
      ),
    );
    resp.forEach((i) =>
      i.deleteFacet.result === DeletionResult.NOT_DELETED
        ? toast.error(i.deleteFacet.message)
        : toast(i.deleteFacet.message || t('deleteFacet.successMessage')),
    );

    refetchFacets();
    setDeleteDialogOpened(false);
    setFacetsToDelete([]);
  };

  const columns: ColumnDef<FacetListType>[] = [
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
      accessorKey: 'name',
      enableHiding: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="name" onClick={() => setSort('name')}>
          {t('table.name')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.facets.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.name}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'code',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('code')}>
          {t('table.code')}
        </SortButton>
      ),
      cell: ({ row }) => <div className="text-nowrap">{row.original.code}</div>,
    },
    {
      accessorKey: 'isPrivate',
      header: t('table.isPrivate'),
      cell: ({ row }) =>
        row.original.isPrivate ? (
          <Badge
            variant={'outline'}
            className="flex items-center justify-center border-orange-200 bg-orange-200 text-orange-800"
          >
            {t('visibility.private')}
          </Badge>
        ) : (
          <Badge className="flex items-center justify-center border-green-200 bg-green-200 text-green-800">
            {t('visibility.public')}
          </Badge>
        ),
    },
    {
      accessorKey: 'values',
      enableHiding: true,
      enableColumnFilter: false,
      header: t('table.values'),
      cell: ({ row }) => <Badge variant={'secondary'}>{row.original.values.length}</Badge>,
    },
    // {
    //   accessorKey: 'usedForColors',
    //   header: () => (
    //     <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('usedForColors')}>
    //       {t('table.usedForColors')}
    //     </SortButton>
    //   ),
    //   cell: ({ row }) => (row.original.customFields?.usedForColors ? <Check size={16} /> : <X size={16} />),
    // },
    // {
    //   accessorKey: 'colorsCollection',
    //   header: () => (
    //     <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('colorsCollection')}>
    //       {t('table.colorsCollection')}
    //     </SortButton>
    //   ),
    //   cell: ({ row }) => (row.original.customFields?.colorsCollection ? <Check size={16} /> : <X size={16} />),
    // },
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              {t('table.copyId')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={Routes.facets.to(row.original.id)} className="text-primary-600">
                {t('table.viewFacet')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDeleteDialogOpened(true);
                setFacetsToDelete([row.original]);
              }}
            >
              <div className=" text-red-400 hover:text-red-400 dark:hover:text-red-400">{t('deleteFacet.title')}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: facets || [],
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
    const filters: Array<ParamFilterFieldTuple<FacetsSortOptions>> = [];
    facetsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<FacetsSortOptions> = [p, paramFilterField];
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
    setFacetsToDelete([]);
  }, [facets]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t('table.columns')} <ChevronDown className="ml-2 h-4 w-4" />
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
                      {t(`table.${column.id as keyof typeof facetsJson.table}`)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Search
            filter={optionInfo.filter}
            type="FacetFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <div className="flex gap-2">
            {table.getFilteredSelectedRowModel().rows.map((i) => i.original).length ? (
              <Button
                variant="outline"
                onClick={() => {
                  setFacetsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
                  setDeleteDialogOpened(true);
                }}
              >
                {t('deleteFacet.deleteOrCancel')}
              </Button>
            ) : null}
            <Button>
              <NavLink to={Routes.facets.new}>{t('createFacet')}</NavLink>
            </Button>
          </div>
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteFacet.title')}
          description={t('deleteFacet.description')}
          deletedNames={facetsToDelete.map((ch) => ch.code)}
          onConfirm={deleteFacetsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
