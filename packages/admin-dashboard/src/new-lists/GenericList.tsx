import { Badge, Checkbox, ListButtons, ListTable, Search, SortButton } from '@/components';
import { PromisePaginated } from './models';
import { ListType, useGenericList } from './useGenericList';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GenericListProvider } from './GenericListContext';
import { SelectIDColumn, ActionsDropdown } from './GenericListColumns';
import { DeleteDialog, ListColumnDropdown } from './_components';

const DEFAULT_COLUMNS = ['id', 'createdAt', 'updatedAt'];
type AwaitedReturnType<T extends PromisePaginated> = Awaited<ReturnType<T>>;

export function GenericList<T extends PromisePaginated>({
  fetch,
  route,
  onRemove,
  listType,
  searchFields,
  hideColumns,
  customColumns,
}: {
  fetch: T;
  route: { list: string; new: string; route: string; to: (id: string) => string };
  onRemove: (items: AwaitedReturnType<T>['items']) => Promise<boolean>;
  listType: keyof ListType;
  searchFields?: Array<keyof AwaitedReturnType<T>['items'][number]>;
  hideColumns?: Array<keyof AwaitedReturnType<T>['items'][number]>;
  customColumns?: ColumnDef<AwaitedReturnType<T>['items']>[];
}) {
  const { t } = useTranslation('table');
  const [itemsToDelete, setItemsToDelete] = useState<AwaitedReturnType<T>['items']>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    `${listType}-table-visibility`,
    { id: true, createdAt: true, updatedAt: true },
  );
  const columnsTranslations = t('columns', { returnObjects: true });

  const {
    objects,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    setFilterLogicalOperator,
    isFilterOn,
    refetch,
    Paginate,
  } = useGenericList({ listType, route: fetch });

  const columns = useMemo(() => {
    const entry = objects?.[0];
    const keys = entry ? Object.keys(entry) : Object.keys(columnsTranslations);
    const columns: ColumnDef<AwaitedReturnType<T>['items']>[] = [];
    for (const key of keys) {
      if (key === 'id') {
        columns.push(SelectIDColumn());
        columns.push(
          ActionsDropdown({
            redirect: (to) => route.to(to),
            setDeleteDialogOpened,
            setItemsToDelete,
          }),
        );
      }
      columns.push({
        accessorKey: key,
        header: () => {
          if (DEFAULT_COLUMNS.includes(key) || key === 'name') {
            return (
              <SortButton currSort={optionInfo.sort} sortKey={key} onClick={() => setSort(key)}>
                {columnsTranslations[key as keyof typeof columnsTranslations] || key}
              </SortButton>
            );
          } else {
            return <div>{columnsTranslations[key as keyof typeof columnsTranslations] || key}</div>;
          }
        },
        cell: ({ row }) => {
          const value = row.original[key];
          if (typeof value === 'boolean') return <Checkbox checked={value} className="cursor-default" />;
          if (typeof value === 'object') return JSON.stringify(value);
          if (key === 'createdAt' || key === 'updatedAt') {
            return <div className="text-nowrap">{format(new Date(row.original[key]), 'dd.MM.yyyy hh:mm')}</div>;
          }
          if (key === 'name') {
            return (
              <Link to={route.to(row.original.id)} className="text-primary-600">
                <Badge variant="outline" className="flex w-full items-center justify-center py-2">
                  {row.original.name}
                  <ArrowRight className="pl-1" size={16} />
                </Badge>
              </Link>
            );
          }
          return row.original[key];
        },
      });
    }
    return columns
      .map((column) => {
        if (customColumns) {
          const key = 'accessorKey' in column ? column.accessorKey : column.id;
          const custom = customColumns.find((c) => c.id === key);
          if (custom) return custom;
        }
        return column;
      })
      .filter(
        (column) =>
          !hideColumns?.includes('accessorKey' in column ? (column.accessorKey as string) : (column.id as string)),
      )
      .sort((a, b) => {
        if (a.id === 'actions') return 1;
        if (b.id === 'actions') return -1;
        return 0;
      });
  }, [objects]);

  useEffect(() => {
    setColumnsVisibilityState((prev) => {
      const keys = objects?.[0] ? Object.keys(objects[0]) : [];
      const newVisibility = { ...prev };
      for (const key of keys) {
        if (prev[key] === undefined) {
          newVisibility[key] = true;
        }
      }
      return newVisibility;
    });
  }, [objects, columnsVisibilityState]);

  const table = useReactTable({
    data: objects || [],
    manualPagination: true,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnsVisibilityState,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnVisibility: columnsVisibilityState,
      pagination: { pageIndex: optionInfo.page, pageSize: optionInfo.perPage },
      rowSelection,
      columnFilters,
    },
  });

  return (
    <div className="page-content-h flex w-full flex-col gap-6">
      <GenericListProvider
        context={{
          deleteDialog: {
            opened: deleteDialogOpened,
            setOpened: setDeleteDialogOpened,
            itemsToDelete,
            setItemsToDelete,
          },
        }}
      >
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <ListColumnDropdown
                table={table}
                placeholder={t('placeholders.columnsDropdown')}
                columnsTranslations={columnsTranslations as Record<string, string>}
              />
            </div>
            <ListButtons
              createLabel={t('buttons.create')}
              createRoute={route.new}
              handleClick={() => {
                const items = table.getFilteredSelectedRowModel().rows.map((i) => i.original);
                setItemsToDelete(items);
                setDeleteDialogOpened(true);
              }}
              selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
            />
          </div>
          {/* <Search
              filter={optionInfo.filter}
              type={listType}
              setFilter={setFilter}
              setFilterField={setFilterField}
              removeFilterField={removeFilterField}
              searchFields={searchFields}
            /> */}
        </div>
        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <DeleteDialog
          title={t('bulk.delete.title')}
          description={t('bulk.delete.description')}
          deletingItems={itemsToDelete}
          open={deleteDialogOpened}
          onOpenChange={setDeleteDialogOpened}
          onConfirm={async () => {
            try {
              const result = await onRemove(itemsToDelete);
              if (!result) return;
              refetch();
              setItemsToDelete([]);
              setDeleteDialogOpened(false);
            } catch {
              console.error('Error deleting items');
            }
          }}
        />
      </GenericListProvider>
    </div>
  );
}
