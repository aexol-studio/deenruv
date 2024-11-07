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
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@deenruv/react-ui-devkit';
import { DeleteDialog, ListButtons, ListColumnDropdown, ListTable, Search, SortButton } from '@/components';
import { Routes, Badge } from '@deenruv/react-ui-devkit';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ParamFilterFieldTuple, RolesSortOptions, rolesSortOptionsArray } from '@/lists/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { RoleListSelector, RoleListType } from '@/graphql/roles';
import { DEFAULT_CHANNEL_CODE } from '@/consts';
import { ActionsColumn } from '@/components/Columns';

const getRoles = async (options: ResolverInputTypes['RoleListOptions']) => {
  const response = await apiCall()('query')({
    roles: [{ options }, { items: RoleListSelector, totalItems: true }],
  });

  return response.roles;
};

export const RolesListPage = () => {
  const { t } = useTranslation('roles');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'roles-table-visibility',
    {
      id: false,
      code: false,
      description: true,
      permissions: true,
      createdAt: false,
      updatedAt: false,
      channels: true,
    },
  );

  const {
    objects: roles,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchRoles,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getRoles({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'roles',
  });

  const [rolesToDelete, setRolesToDelete] = useState<RoleListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchRoles();
  }, []);

  const deleteRolesToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteRoles: [{ ids: rolesToDelete.map((a) => a.id) }, { message: true, result: true }],
    });

    if (resp.deleteRoles) {
      toast.message(t('toasts.roleDeleteSuccess'));
      refetchRoles();
      setDeleteDialogOpened(false);
      setRolesToDelete([]);
    } else toast.error(t('toasts.roleDeleteError'));
  };

  const renderElements = useCallback((elements: string[]) => {
    const LIMIT_TO = 3;
    const elementsRemain = elements.length - LIMIT_TO;
    const renderedElements = elements
      .filter((_e, i) => i + 1 <= LIMIT_TO)
      .map((e) => (
        <Badge key={e} variant="outline" className="py-1">
          {e}
        </Badge>
      ));
    return (
      <>
        {renderedElements}
        {elementsRemain > 0 && (
          <Badge key={'plus'} variant="secondary" className="py-1">
            +{elementsRemain}
          </Badge>
        )}
      </>
    );
  }, []);

  const columns: ColumnDef<RoleListType>[] = [
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
      accessorKey: 'description',
      enableHiding: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="description" onClick={() => setSort('description')}>
          {t('table.description')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.roles.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.description}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'code',
      enableHiding: true,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('code')}>
          {t('table.code')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.code,
    },
    {
      accessorKey: 'permissions',
      enableSorting: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="permissions" onClick={() => setSort('permissions')}>
          {t('table.permissions')}
        </SortButton>
      ),
      cell: ({ row }) => <Stack className="gap-1">{renderElements(row.original.permissions)}</Stack>,
    },
    {
      accessorKey: 'channels',
      enableSorting: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="channels" onClick={() => setSort('channels')}>
          {t('table.channels')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Stack className="gap-1">
          {row.original.channels.map((ch) => (
            <Badge key={ch.code} variant="outline" className="py-1">
              {ch.code === DEFAULT_CHANNEL_CODE ? t('defaultChannel') : ch.code}
            </Badge>
          ))}
        </Stack>
      ),
    },
    ActionsColumn({
      viewRoute: Routes.roles.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setRolesToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: roles || [],
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
    const filters: Array<ParamFilterFieldTuple<RolesSortOptions>> = [];
    rolesSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<RolesSortOptions> = [p, paramFilterField];
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
    setRolesToDelete([]);
  }, [roles]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="RoleFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            createLabel={t('create')}
            createRoute={Routes.roles.new}
            handleClick={() => {
              setRolesToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteRole.title')}
          description={t('deleteRole.description')}
          deletedNames={rolesToDelete.map((r) => r.description)}
          onConfirm={deleteRolesToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
