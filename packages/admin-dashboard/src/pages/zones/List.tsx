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
import { Checkbox, ListTable, SortButton, useLocalStorage } from '@deenruv/react-ui-devkit';
import { Routes, Badge } from '@deenruv/react-ui-devkit';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ParamFilterFieldTuple, ZonesSortOptions, zonesSortOptionsArray } from '@/lists/types';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { DeleteDialog, ListButtons, ListColumnDropdown, Search } from '@/components';
import { ZoneListSelector, ZoneListType } from '@/graphql/zones';
import { ActionsColumn } from '@/components/Columns';

const getZones = async (options: ResolverInputTypes['ZoneListOptions']) => {
  const response = await apiCall()('query')({
    zones: [{ options }, { items: ZoneListSelector, totalItems: true }],
  });

  return response.zones;
};

export const ZonesListPage = () => {
  const { t } = useTranslation('zones');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'zones-table-visibility',
    {
      id: false,
      code: true,
      createdAt: false,
      updatedAt: false,
      token: true,
    },
  );

  const {
    objects: zones,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchZones,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getZones({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'zones',
  });

  const [zonesToDelete, setZonesToDelete] = useState<ZoneListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchZones();
  }, []);

  const deleteZonesToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteZones: [{ ids: zonesToDelete.map((ch) => ch.id) }, { message: true, result: true }],
    });

    if (resp.deleteZones) {
      toast.message(t('toasts.zoneDeleteSuccess'));
      refetchZones();
      setDeleteDialogOpened(false);
      setZonesToDelete([]);
    } else toast.error(t('toasts.zoneDeleteError'));
  };

  const columns: ColumnDef<ZoneListType>[] = [
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
        <Link to={Routes.zones.to(row.original.id)} className="text-primary-600">
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
      accessorKey: 'members',
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="members" onClick={() => setSort('members')}>
          {t('table.members')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.members.length,
    },
    ActionsColumn({
      viewRoute: Routes.zones.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setZonesToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: zones || [],
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
    const filters: Array<ParamFilterFieldTuple<ZonesSortOptions>> = [];
    zonesSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<ZonesSortOptions> = [p, paramFilterField];
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
    setZonesToDelete([]);
  }, [zones]);

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
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            createLabel={t('create')}
            createRoute={Routes.zones.new}
            handleClick={() => {
              setZonesToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteZone.title')}
          description={t('deleteZone.description')}
          deletedNames={zonesToDelete.map((z) => z.name)}
          onConfirm={deleteZonesToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
