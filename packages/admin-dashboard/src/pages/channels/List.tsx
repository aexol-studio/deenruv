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
import { Routes, Badge, Checkbox } from '@deenruv/react-ui-devkit';
import { DeleteDialog, ListButtons, ListColumnDropdown, Search, SortButton, ListTable } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ChannelsSortOptions, ParamFilterFieldTuple, channelsSortOptionsArray } from '@/lists/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { ChannelListSelector, ChannelListType } from '@/graphql/channels';
import { ActionsColumn } from '@/components/Columns';

const getChannels = async (options: ResolverInputTypes['ChannelListOptions']) => {
  const response = await apiCall()('query')({
    channels: [{ options }, { items: ChannelListSelector, totalItems: true }],
  });

  return response.channels;
};

export const ChannelsListPage = () => {
  const { t } = useTranslation('channels');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'channels-table-visibility',
    {
      id: false,
      code: true,
      createdAt: false,
      updatedAt: false,
      token: true,
    },
  );

  const {
    objects: channels,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchChannels,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getChannels({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'channels',
  });

  const [channelsToDelete, setChannelsToDelete] = useState<ChannelListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchChannels();
  }, []);

  const deleteChannelsToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteChannels: [{ ids: channelsToDelete.map((ch) => ch.id) }, { message: true, result: true }],
    });

    if (resp.deleteChannels) {
      toast.message(t('toasts.channelDeleteSuccess'));
      refetchChannels();
      setDeleteDialogOpened(false);
      setChannelsToDelete([]);
    } else toast.error(t('toasts.channelDeleteError'));
  };

  const columns: ColumnDef<ChannelListType>[] = [
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
      accessorKey: 'token',
      enableHiding: true,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="token" onClick={() => setSort('token')}>
          {t('table.token')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.channels.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.token}
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
    ActionsColumn({
      viewRoute: Routes.channels.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setChannelsToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: channels || [],
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
    const filters: Array<ParamFilterFieldTuple<ChannelsSortOptions>> = [];
    channelsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<ChannelsSortOptions> = [p, paramFilterField];
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
    setChannelsToDelete([]);
  }, [channels]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="ChannelFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            createLabel={t('create')}
            createRoute={Routes.channels.new}
            handleClick={() => {
              setChannelsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteChannel.title')}
          description={t('deleteChannel.description')}
          deletedNames={channelsToDelete.map((ch) => ch.code)}
          onConfirm={deleteChannelsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
