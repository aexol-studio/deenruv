import { CornerDownRight } from 'lucide-react';
import { useList } from '@/lists/useList';
import { DeletionResult, Permission, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { CollectionListSelector, CollectionListType } from '@/graphql/collections';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useLocalStorage,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DrawerTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Routes,
  EmptyState,
  useSettings,
  TranslationSelect,
  apiClient,
  ListBadge,
  SortSelect,
  ColumnView,
  TableLabel,
} from '@deenruv/react-ui-devkit';
import { ImageWithPreview, ListButtons, Search, Stack } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { CollectionsSortOptions, collectionsSortOptionsArray } from '@/lists/types';

import { CollectionProductVariantsDrawer } from './_components/CollectionProductVariantsDrawer.js';
import { SelectedCollectionsModalContent } from './_components/SelectedCollectionsModal.js';
import { CollectionAction } from './consts.js';
import { ActionsColumn } from '@/components/Columns/ActionsColumn.js';

type ParamFilterFieldTuple = [CollectionsSortOptions, Record<string, string>];

const getChildren = async (parentId: string, callback: (items: CollectionListType[], parentId: string) => void) => {
  try {
    const response = await apiClient('query')({
      collections: [
        {
          options: {
            filter: { parentId: { in: [parentId] } },
          },
        },
        { items: CollectionListSelector, totalItems: true },
      ],
    });
    callback(response.collections.items, parentId);
  } catch (_error) {
    toast.error('Failed to fetch child collections');
  }
};

export const CollectionsListPage = () => {
  const { t } = useTranslation('collections');
  const { t: tCommon } = useTranslation('common');
  const [subRows, setSubRows] = useState<{ [key: string]: CollectionListType[] }>();
  const [tableLoading, setTableLoading] = useState(false);
  const [drawerData, setDrawerData] = useState<
    { collectionId: string; collectionName: string; count: number } | undefined
  >();
  const [collectionAction, setCollectionAction] = useState<keyof typeof CollectionAction | undefined>();
  const [collectionsToDelete, setCollectionsToDelete] = useState<CollectionListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [selectedDropDown, setSelectedDropdown] = useState(false);
  const [rowsActionsState, setRowsActionsState] = useState<{ [key: string]: boolean }>({});
  // for
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'collections-table-visibility',
    {},
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchParams] = useSearchParams();

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const handleSetSubRows = (items: CollectionListType[], parentId: string) =>
    setSubRows((p) => ({ ...p, [parentId]: items }));

  const collectionsActions = useMemo(
    () => [
      { label: t('collectionActions.move'), value: CollectionAction.MOVE },
      { label: t('collectionActions.copy'), value: CollectionAction.COPY },
      { label: t('collectionActions.assign'), value: CollectionAction.ASSING_TO_CHANNGEL },
      { label: t('collectionActions.deleteFromChannel'), value: CollectionAction.DELETE_FROM_CHANNEL },
    ],
    [t],
  );
  const getCollections = async (paginate?: ResolverInputTypes['CollectionListOptions']) => {
    setTableLoading(true);
    try {
      const response = await apiClient('query')({
        collections: [
          {
            options: {
              ...paginate,
              topLevelOnly: true,
            },
          },
          { items: CollectionListSelector, totalItems: true },
        ],
      });
      // still problem with request timeout during loading all childrens
      await Promise.all(
        response.collections.items.map(async (collection) => {
          if (collection.children?.length) await getChildren(collection.id, handleSetSubRows);
        }),
      );
      return response.collections;
    } catch {
      toast.error('Coś poszło nie tak');
      return { totalItems: 0, items: [] };
    } finally {
      setTableLoading(false);
    }
  };

  const {
    objects: collections,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchCollections,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getCollections({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'collections',
  });

  useEffect(() => {
    const PADDING_X_VALUE = 64;
    const updateSize = () => {
      setTimeout(() => {
        if (tableWrapperRef.current) {
          const wrapperWidth = document.getElementById('scrollArea')?.getBoundingClientRect().width;
          if (wrapperWidth) tableWrapperRef.current.style.maxWidth = wrapperWidth - PADDING_X_VALUE + 'px';
        }
      }, 0);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [tableWrapperRef]);

  const deleteCollections = async () => {
    const resp = await apiClient('mutation')({
      deleteCollections: [{ ids: collectionsToDelete.map((i) => i.id) }, { message: true, result: true }],
    });

    resp.deleteCollections.forEach((i) =>
      i.result === DeletionResult.NOT_DELETED
        ? toast.error(i.message || t('toasts.deletionCollectionErrorToast'))
        : toast(i.message || t('toasts.deletionCollectionSuccessToast')),
    );
    refetchCollections();
    setDeleteDialogOpened(false);
    setCollectionsToDelete([]);
  };

  const columns: ColumnDef<CollectionListType>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <div
          className="flex items-center gap-2"
          style={{
            paddingLeft: `${(row.depth - 1) * 1.8}rem`,
          }}
        >
          {!!row.depth && <CornerDownRight size={18} />}
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />{' '}
        </div>
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
        <SortSelect currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('id')}>
          {t('table.id')}
        </SortSelect>
      ),
      cell: ({ row }) => (
        <Link to={Routes.collections.to(row.original.id)} className="text-primary-600">
          <ListBadge>
            {row.original.id}
            <ArrowRight className="pl-1" size={16} />
          </ListBadge>
        </Link>
      ),
    },
    {
      accessorKey: 'featuredAsset',
      header: () => <TableLabel>{t('table.featuredAsset')}</TableLabel>,
      cell: ({ row }) => <ImageWithPreview src={row.original.featuredAsset?.preview} alt={row.original.name} />,
    },
    {
      accessorKey: 'name',
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="name" onClick={() => setSort('name')}>
          {t('table.name')}
        </SortSelect>
      ),
      cell: ({ row }) => (
        <Link to={Routes.collections.to(row.original.id)} className="text-primary-600">
          <ListBadge>
            {row.original.name}
            <ArrowRight className="pl-1" size={16} />
          </ListBadge>
        </Link>
      ),
    },
    {
      accessorKey: 'breadcrumbs',
      // in future we can add here link to desired url storefront collection e.g https://www.storefront.com/collections/breadrumb
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="breadcrumbs" onClick={() => setSort('breadcrumbs')}>
          {t('table.breadcrumb')}
        </SortSelect>
      ),
      accessorFn: (row) =>
        row.breadcrumbs
          .filter((crumb) => !crumb.slug.includes('root_collection'))
          .reduce((acc, curr) => (acc += `/${curr.slug}`), ''),
    },
    {
      accessorKey: 'slug',
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="slug" onClick={() => setSort('slug')}>
          {t('table.slug')}
        </SortSelect>
      ),
    },
    {
      accessorKey: 'children',
      header: () => t('table.children'),
      accessorFn: (row) => row.children?.length ?? 0,
      cell: (row) => (
        <div>
          <ListBadge
            className="cursor-pointer"
            onClick={async () => {
              const parentRow = row.cell.row.original;

              if (row.cell.row.getIsExpanded()) {
                row.cell.row.toggleExpanded();
                return;
              }

              if (
                parentRow.children &&
                parentRow.children.length > 0 &&
                typeof parentRow.children[0] === 'object' &&
                'id' in parentRow.children[0] &&
                !('name' in parentRow.children[0])
              ) {
                await getChildren(parentRow.id, (items) => {
                  parentRow.children = items;
                  row.cell.row.toggleExpanded();
                });
              } else if (!parentRow.children || parentRow.children.length === 0) {
                toast.warning(t('toasts.noCollectionChildrens', { collection: parentRow.name }));
              } else {
                row.cell.row.toggleExpanded();
              }
            }}
          >
            {row.getValue<number>()}
            <ArrowRight className="pl-1" size={16} />
          </ListBadge>
        </div>
      ),
    },
    {
      accessorKey: 'productVariants.totalItems',
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="state" onClick={() => setSort('state')}>
          {t('table.products')}
        </SortSelect>
      ),
      cell: ({ row, getValue }) => (
        <>
          {getValue<number>() ? (
            <DrawerTrigger className="w-full">
              <ListBadge
                onClick={() => {
                  setDrawerData({
                    collectionId: row.original.id,
                    collectionName: row.original.name,
                    count: getValue<number>(),
                  });
                }}
              >
                {getValue<number>()}
                <ArrowRight className="pl-1" size={16} />
              </ListBadge>
            </DrawerTrigger>
          ) : (
            <ListBadge>
              {getValue<number>()}
              <ArrowRight className="pl-1" size={16} />
            </ListBadge>
          )}
        </>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="createdAt" onClick={() => setSort('createdAt')}>
          {t('table.createdAt')}
        </SortSelect>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">
          {row.original.createdAt ? format(new Date(row.original.createdAt), 'dd.MM.yyyy hh:mm') : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <SortSelect currSort={optionInfo.sort} sortKey="updatedAt" onClick={() => setSort('updatedAt')}>
          {t('table.updatedAt')}
        </SortSelect>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">
          {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm') : '-'}
        </div>
      ),
    },
    ActionsColumn({
      viewRoute: Routes.collections.to,
      onDelete: (row) => {
        setDeleteDialogOpened(true);
        setCollectionsToDelete([row.original]);
      },
      deletePermission: Permission.DeleteCollection,
    }),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu
          open={rowsActionsState[row.original.id]}
          onOpenChange={(value) => setRowsActionsState({ [row.original.id]: value })}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              {t('table.copyId')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setRowsActionsState({ [row.original.id]: false });
                setDeleteDialogOpened(true);
                setCollectionsToDelete([row.original]);
              }}
            >
              {t('table.delete')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={Routes.collections.to(row.original.id)}>{t('editCollection')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 28,
      minSize: 28,
      maxSize: 28,
      meta: {
        isFixedWidth: true,
      },
    },
  ];
  const tableColumns = useMemo(
    () =>
      tableLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-10 w-full rounded-sm" />,
          }))
        : columns,

    [tableLoading],
  );

  const tableData = useMemo(() => (tableLoading ? Array(10).fill({}) : collections), [tableLoading, collections]);

  const table = useReactTable({
    data: tableData || [],
    manualPagination: true,
    enableExpanding: true,
    columns: tableColumns,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnsVisibilityState,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getSubRows: (row) => subRows?.[row.id],
    getRowId: (row) => row.id,
    state: {
      expanded,
      columnFilters,
      columnVisibility: columnsVisibilityState,
      rowSelection,
      pagination: { pageIndex: optionInfo.page, pageSize: optionInfo.perPage },
    },
  });

  useEffect(() => {
    let filterObj = {};
    const filters: Array<ParamFilterFieldTuple> = [];

    collectionsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple = [p, paramFilterField];
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
    refetchCollections();
  }, [translationsLanguage]);

  return (
    <Stack column className="gap-6 px-4 py-2 md:px-8 md:py-4">
      <CollectionProductVariantsDrawer {...drawerData}>
        <div className="page-content-h flex w-full flex-col">
          <div className="mb-4 flex flex-wrap justify-between gap-4">
            <div className="flex w-full items-end justify-between gap-4">
              <div>
                {/* {table.getSelectedRowModel().flatRows.length ? (
                  <DropdownMenu open={selectedDropDown} onOpenChange={setSelectedDropdown}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="action">
                        {t('withSelected', { collections: table.getSelectedRowModel().flatRows.length })}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {collectionsActions.map((action) => (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          key={action.value}
                          onClick={() => {
                            setSelectedDropdown(false);
                            setCollectionAction(action.value);
                          }}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null} */}

                <Search
                  filter={optionInfo.filter}
                  type="CollectionFilterParameter"
                  setFilter={setFilter}
                  setFilterField={setFilterField}
                  removeFilterField={removeFilterField}
                  setFilterLogicalOperator={setFilterLogicalOperator}
                />
              </div>
              <div className="flex gap-2">
                <ColumnView {...table} />
                <ListButtons
                  selected={!!table.getFilteredSelectedRowModel().rows.map((i) => i.original).length}
                  createLabel={t('create')}
                  createRoute={Routes.collections.new}
                  handleClick={() => {
                    setCollectionsToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
                    setDeleteDialogOpened(true);
                  }}
                  createPermission={Permission.CreateCollection}
                  deletePermission={Permission.DeleteCollection}
                />
              </div>
            </div>
          </div>

          <div ref={tableWrapperRef} className={`bg-background h-full overflow-auto rounded-md border`}>
            <Table className="w-full" {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}>
              <TableHeader className="bg-primary-foreground bg-background sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length || tableLoading ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <EmptyState
                    columnsLength={columns.length}
                    filtered={isFilterOn}
                    title={tCommon(`emptyState.default.empty.title`)}
                    description={tCommon(`emptyState.default.empty.text`)}
                  />
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {t('rowsSelected', {
                selected: table.getFilteredSelectedRowModel().rows.length,
                all: table.getFilteredRowModel().rows.length,
              })}
            </div>
            <div className="space-x-2">{Paginate}</div>
          </div>
          <Dialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle> {t('deleteCollectionDialog.title')}</DialogTitle>
                <DialogDescription>{t('deleteCollectionDialog.description')}</DialogDescription>
                <DialogDescription>
                  {collectionsToDelete.map((i) => (
                    <div key={i.id}>
                      {i.id} {i.name} {i.slug}
                    </div>
                  ))}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">{t('deleteCollectionDialog.cancel')}</Button>
                </DialogClose>
                <Button variant="destructive" onClick={deleteCollections}>
                  {t('deleteCollectionDialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={!!collectionAction} onOpenChange={() => setCollectionAction(undefined)}>
            <SelectedCollectionsModalContent
              onClose={() => setCollectionAction(undefined)}
              allCollections={table.getRowModel().flatRows}
              refetchCollections={() => refetchCollections()}
              selectedCollections={table.getSelectedRowModel().flatRows}
              collectionAction={collectionAction}
            />
          </Dialog>
        </div>
      </CollectionProductVariantsDrawer>
    </Stack>
  );
};
