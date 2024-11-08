import {
  Badge,
  Button,
  buttonVariants,
  cn,
  mergeSelectorWithCustomFields,
  PlacementMarker,
  usePluginStore,
} from '@deenruv/react-ui-devkit';
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
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Circle, CircleCheck, PlusCircleIcon } from 'lucide-react';
import { GenericListProvider } from './GenericListContext';
import { SelectIDColumn, ActionsDropdown } from './GenericListColumns';
import { DeleteDialog } from './_components';
import { ListButtons, ListTable, TranslationSelect } from '@/components';
import { useServer } from '@/state';
import { ValueTypes } from '@deenruv/admin-types';

const DEFAULT_COLUMNS = ['id', 'createdAt', 'updatedAt'];
type AwaitedReturnType<T extends PromisePaginated> = Awaited<ReturnType<T>>;
const COLUMN_PRIORITIES: Record<string, number> = {
  'select-id': 0,
  id: 1,
  featuredAsset: 2,
  createdAt: 3,
  updatedAt: 4,
  actions: 999,
} as const;

const getPriority = (key: string): number => {
  return COLUMN_PRIORITIES[key] ?? 500;
};

export function GenericList<T extends PromisePaginated>({
  fetch,
  route,
  onRemove,
  type,
  ENTITY_NAME,
  searchFields,
  hideColumns,
  customColumns,
}: {
  fetch: T;
  route: { list: string; new: string; route: string; to: (id: string) => string };
  onRemove: (items: AwaitedReturnType<T>['items']) => Promise<boolean>;
  type: keyof ListType;
  ENTITY_NAME: keyof ValueTypes;
  searchFields?: Array<keyof AwaitedReturnType<T>['items'][number] | string>;
  hideColumns?: Array<keyof AwaitedReturnType<T>['items'][number] | string>;
  customColumns?: ColumnDef<AwaitedReturnType<T>['items']>[];
}) {
  const { t } = useTranslation('table');
  const { getTableExtensions } = usePluginStore();
  const tableExtensions = getTableExtensions('products-list-view');
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find((el) => el.entityName === ENTITY_NAME),
  )?.customFields;
  const customFieldsSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, ENTITY_NAME, entityCustomFields),
    [entityCustomFields],
  );

  const [itemsToDelete, setItemsToDelete] = useState<AwaitedReturnType<T>['items']>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    `${type}-table-visibility`,
    { id: true, createdAt: true, updatedAt: true },
  );
  const columnsTranslations = t('columns', { returnObjects: true });

  const {
    objects,
    searchParamValues: { page, perPage, filter },
    refetch,
    SortButton,
    Paginate,
    Search,
    FiltersButton,
    FiltersResult,
  } = useGenericList({
    type,
    route: fetch,
    searchFields,
    customFieldsSelector,
  });

  const columns = useMemo(() => {
    const entry = objects?.[0];
    const keys = entry ? Object.keys(entry) : Object.keys(columnsTranslations);
    const columns: ColumnDef<AwaitedReturnType<T>['items']>[] = [];
    for (const key of keys) {
      if (key === 'id') {
        columns.push(SelectIDColumn({ bulkActions: tableExtensions.flatMap((table) => table.bulkActions || []) }));
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
            return SortButton(key, columnsTranslations[key as keyof typeof columnsTranslations] || key);
          } else {
            return <div>{columnsTranslations[key as keyof typeof columnsTranslations] || key}</div>;
          }
        },
        cell: ({ row }) => {
          const value = row.original[key];
          if (typeof value === 'boolean') {
            if (value) return <CircleCheck size={20} className="text-primary-600" />;
            else return <Circle size={20} className="text-gray-400" />;
          }
          if (typeof value === 'object') {
            if ('__typename' in value) {
              // that means we know this type
              // * GOOD TO REMEMBER: Get __typename from nested objects in selector.
              if (value.__typename === 'Asset') {
                // this is an asset
                return <img src={value.preview} alt={row.original.name} className="h-16 w-16 object-cover" />;
              }
            }
            return JSON.stringify(value);
          }
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
        const keyA = ('accessorKey' in a ? a.accessorKey : a.id) as string;
        const keyB = ('accessorKey' in b ? b.accessorKey : b.id) as string;
        return getPriority(keyA) - getPriority(keyB);
      });
  }, [objects]);

  useEffect(() => {
    setColumnsVisibilityState((prev) => {
      const keys = objects?.[0] ? Object.keys(objects[0]) : [];
      const newVisibility = { ...prev };
      for (const key of keys) {
        if (hideColumns?.includes(key)) {
          newVisibility[key] = false;
        } else if (prev[key] === undefined) {
          newVisibility[key] = true;
        }
      }
      return newVisibility;
    });
  }, [objects]);

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
      pagination: { pageIndex: page, pageSize: perPage },
      rowSelection,
      columnFilters,
    },
  });

  const isFiltered = useMemo(() => {
    let isFiltered = false;
    if (filter) {
      Object.keys(filter).forEach((fieldKey) => {
        const property = filter[fieldKey as keyof typeof filter];
        if (property) {
          Object.keys(property).forEach((filterTypeKey) => {
            if (property[filterTypeKey as keyof typeof property]) {
              isFiltered = true;
            }
          });
        }
      });
    }
    return isFiltered;
  }, [filter]);

  return (
    <div className="page-content-h flex w-full flex-col gap-2">
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
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-end justify-between gap-4">
            <div className="flex flex-col items-start gap-2">
              <TranslationSelect />
              <div className="flex items-center gap-2">
                {FiltersButton}
                {Search}
              </div>
            </div>
            <div className="flex gap-2">
              <NavLink to={route.new} className={cn(buttonVariants(), 'flex items-center gap-2')}>
                <PlusCircleIcon size={16} />
                {t('create')}
              </NavLink>
            </div>
          </div>
          <div>{FiltersResult}</div>
        </div>
        <ListTable {...{ columns, isFiltered, table, Paginate }} />
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
