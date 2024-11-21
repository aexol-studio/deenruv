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
import { Routes, Badge, Checkbox, SortButton, useLocalStorage, ListTable } from '@deenruv/react-ui-devkit';
import { DeleteDialog, ListButtons, ListColumnDropdown, Search } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AdminsSortOptions, ParamFilterFieldTuple, adminsSortOptionsArray } from '@/lists/types';
import { AdminListSelector, AdminListType } from '@/graphql/admins';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { ActionsColumn } from '@/components/Columns';

const getAdmins = async (options: ResolverInputTypes['AdministratorListOptions']) => {
  const response = await apiCall()('query')({
    administrators: [{ options }, { items: AdminListSelector, totalItems: true }],
  });

  return response.administrators;
};

export const AdminsListPage = () => {
  const { t } = useTranslation('admins');
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'admins-table-visibility',
    {
      id: false,
      firstName: true,
      emailAddress: true,
      createdAt: false,
      updatedAt: false,
      role: true,
    },
  );

  const {
    objects: admins,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchAdmins,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getAdmins({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'administrators',
  });

  const [adminsToDelete, setAdminsToDelete] = useState<AdminListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  useEffect(() => {
    refetchAdmins();
  }, []);

  const deleteAdminsToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteAdministrators: [{ ids: adminsToDelete.map((a) => a.id) }, { message: true, result: true }],
    });

    if (resp.deleteAdministrators) {
      toast.message(t('toasts.adminDeleteSuccess'));
      refetchAdmins();
      setDeleteDialogOpened(false);
      setAdminsToDelete([]);
    } else toast.error(t('toasts.adminDeleteError'));
  };

  const columns: ColumnDef<AdminListType>[] = [
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
      accessorKey: 'firstName',
      enableHiding: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="firstName" onClick={() => setSort('firstName')}>
          {t('table.name')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.admins.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.firstName + ' ' + row.original.lastName}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'emailAddress',
      enableHiding: true,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="emailAddress" onClick={() => setSort('emailAddress')}>
          {t('table.emailAddress')}
        </SortButton>
      ),
      cell: ({ row }) => row.original.emailAddress,
    },
    {
      accessorKey: 'role',
      enableSorting: false,
      enableColumnFilter: false,
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="role" onClick={() => setSort('role')}>
          {t('table.role')}
        </SortButton>
      ),
      cell: ({ row }) =>
        row.original.user.roles.map((r) => (
          <Badge key={r.description} variant="outline" className="flex w-full items-center justify-center py-2">
            {r.description}
          </Badge>
        )),
    },
    ActionsColumn({
      viewRoute: Routes.admins.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setAdminsToDelete([row.original]);
      },
    }),
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: admins || [],
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
    const filters: Array<ParamFilterFieldTuple<AdminsSortOptions>> = [];
    adminsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<AdminsSortOptions> = [p, paramFilterField];
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
    setAdminsToDelete([]);
  }, [admins]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <ListColumnDropdown table={table} t={t} />
          <Search
            filter={optionInfo.filter}
            type="AdministratorFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <ListButtons
            createLabel={t('create')}
            createRoute={Routes.admins.new}
            handleClick={() => {
              setAdminsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
              setDeleteDialogOpened(true);
            }}
            selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
          />
        </div>

        <ListTable {...{ columns, isFiltered: isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('deleteAdmin.title')}
          description={t('deleteAdmin.description')}
          deletedNames={adminsToDelete.map((a) => a.emailAddress)}
          onConfirm={deleteAdminsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
        />
      </div>
    </Stack>
  );
};
