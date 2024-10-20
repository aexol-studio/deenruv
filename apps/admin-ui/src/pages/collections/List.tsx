import { apiCall } from '@/graphql/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CornerDownRight } from 'lucide-react';
import { useList } from '@/lists/useList';
import { DeletionResult, ResolverInputTypes, SortOrder } from '@/zeus';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/state';
import { useLocalStorage } from '@/hooks';
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
  Badge,
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
  EmptyState,
  ImageWithPreview,
  Search,
  SortButton,
  Stack,
  TranslationSelect,
} from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { Routes } from '@/utils';
import { ArrowRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { CollectionsSortOptions, collectionsSortOptionsArray } from '@/lists/types';

import { CollectionProductVariantsDrawer } from './_components/CollectionProductVariantsDrawer';
import { DrawerTrigger } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { SelectedCollectionsModalContent } from './_components/SelectedCollectionsModal';
import { CollectionAction } from './consts';

type ParamFilterFieldTuple = [CollectionsSortOptions, Record<string, string>];

const getChildren = async (parentId: string, callback: (items: CollectionListType[], parentId: string) => void) => {
  try {
    const response = await apiCall()('query')({
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
      const response = await apiCall()('query')({
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
    const resp = await apiCall()('mutation')({
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
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('id')}>
          {t('table.id')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.collections.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center">
            {row.original.id}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'featuredAsset',
      header: t('table.featuredAsset'),
      cell: ({ row }) => <ImageWithPreview src={row.original.featuredAsset?.preview} alt={row.original.name} />,
    },
    {
      accessorKey: 'name',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="name" onClick={() => setSort('name')}>
          {t('table.name')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.collections.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center py-2">
            {row.original.name}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'breadcrumbs',
      // in future we can add here link to desired url storefront collection e.g https://www.storefront.com/collections/breadrumb
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="breadcrumbs" onClick={() => setSort('breadcrumbs')}>
          {t('table.breadcrumb')}
        </SortButton>
      ),
      accessorFn: (row) =>
        row.breadcrumbs
          .filter((crumb) => !crumb.slug.includes('root_collection'))
          .reduce((acc, curr) => (acc += `/${curr.slug}`), ''),
    },
    {
      accessorKey: 'slug',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="slug" onClick={() => setSort('slug')}>
          {t('table.slug')}
        </SortButton>
      ),
    },
    {
      accessorKey: 'children',
      header: () => t('table.children'),
      accessorFn: (row) => row.children?.length ?? 0,
      cell: (row) => (
        <div>
          <Badge
            variant="outline"
            className="flex w-full cursor-pointer select-none items-center justify-center"
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
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'productVariants.totalItems',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="state" onClick={() => setSort('state')}>
          {t('table.products')}
        </SortButton>
      ),
      cell: ({ row, getValue }) => (
        <>
          {getValue<number>() ? (
            <DrawerTrigger className="w-full">
              <Badge
                variant="outline"
                className="flex w-full cursor-pointer select-none items-center justify-center"
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
              </Badge>
            </DrawerTrigger>
          ) : (
            <Badge variant="outline" className="flex w-full cursor-pointer select-none items-center justify-center">
              {getValue<number>()}
              <ArrowRight className="pl-1" size={16} />
            </Badge>
          )}
        </>
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
        <div className="text-nowrap">
          {row.original.createdAt ? format(new Date(row.original.createdAt), 'dd.MM.yyyy hh:mm') : '-'}
        </div>
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
          {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm') : '-'}
        </div>
      ),
    },

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationsLanguage]);

  return (
    <Stack column className="gap-6">
      <CollectionProductVariantsDrawer {...drawerData}>
        <div className="page-content-h flex w-full flex-col">
          <div className="mb-4 flex flex-wrap justify-between gap-4">
            <TranslationSelect />
            {table.getSelectedRowModel().flatRows.length ? (
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
            ) : null}

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
              type="CollectionFilterParameter"
              setFilter={setFilter}
              setFilterField={setFilterField}
              removeFilterField={removeFilterField}
              setFilterLogicalOperator={setFilterLogicalOperator}
            />
          </div>

          <div ref={tableWrapperRef} className={`h-full overflow-auto rounded-md border`}>
            <Table className="w-full" {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}>
              <TableHeader className="sticky top-0 bg-primary-foreground">
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
                  <EmptyState columnsLength={columns.length} filtered={isFilterOn} />
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
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
