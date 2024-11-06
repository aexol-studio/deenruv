import { apiCall } from '@/graphql/client';
import { ProductListType, ProductTileSelector } from '@/graphql/products';
import { useList } from '@/lists/useList';
import { DeletionResult, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Routes } from '@/utils';
import {
  Button,
  Badge,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@deenruv/react-ui-devkit';
import { ImageWithPreview, Search, Stack, TranslationSelect, ListTable } from '@/components';
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
import { ParamFilterFieldTuple, ProductsSortOptions, productsSortOptionsArray } from '@/lists/types';
import { PaginationInput } from '@/lists/models';
import { toast } from 'sonner';
import { format } from 'date-fns';

const SortButton: React.FC<
  PropsWithChildren<{ sortKey: string; currSort: PaginationInput['sort']; onClick: () => void }>
> = ({ currSort, onClick, children, sortKey }) => {
  return (
    <Button variant="ghost" onClick={onClick}>
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

const getProducts = async (options: ResolverInputTypes['ProductListOptions']) => {
  const response = await apiCall()('query')({
    products: [{ options }, { items: ProductTileSelector, totalItems: true }],
  });
  return response.products;
};

export const ProductsListPage = () => {
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('products');

  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'products-table-visibility',
    {},
  );

  const {
    objects: products,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchProducts,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getProducts({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'products',
  });

  const [productsToDelete, setProductsToDelete] = useState<ProductListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const deleteProductsToDelete = async () => {
    const resp = await apiCall()('mutation')({
      deleteProducts: [{ ids: productsToDelete.map((i) => i.id) }, { message: true, result: true }],
    });

    resp.deleteProducts.forEach((i) =>
      i.result === DeletionResult.NOT_DELETED
        ? toast.error(i.message || t('toasts.deletionProductErrorToast'))
        : toast(i.message || 'Order deleted'),
    );
    refetchProducts();
    setDeleteDialogOpened(false);
    setProductsToDelete([]);
  };

  const columns: ColumnDef<ProductListType>[] = [
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
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('id')}>
          {t('table.id')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <Link to={Routes.products.to(row.original.id)} className="text-primary-600">
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
        <SortButton currSort={optionInfo.sort} sortKey="state" onClick={() => setSort('state')}>
          {t('table.name')}
        </SortButton>
      ),
    },
    {
      accessorKey: 'slug',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="state" onClick={() => setSort('state')}>
          {t('table.slug')}
        </SortButton>
      ),
    },
    {
      accessorKey: 'variantList',
      header: t('table.variants'),
      cell: ({ row }) => <div className="text-nowrap">{row.original.variantList.totalItems}</div>,
    },
    {
      accessorKey: 'collections',
      header: t('table.collections'),
      cell: ({ row }) => (
        <HoverCard openDelay={100}>
          <HoverCardTrigger asChild>
            <Badge className="max-w-[200px] truncate">
              {t('table.inValueCollections', { value: row.original.collections.length })}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-auto flex-shrink items-center justify-between gap-4">
            {row.original.collections.map((i) => (
              <div key={i.name}>
                {i.name} {i.slug}
              </div>
            ))}
          </HoverCardContent>
        </HoverCard>
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
        <div className="text-nowrap">{format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm')}</div>
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              {t('table.copyId')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteDialogOpened(true);
                setProductsToDelete([row.original]);
              }}
            >
              {t('table.delete')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={Routes.products.to(row.original.id)}>{t('editProduct')}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: products || [],
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
    const filters: Array<ParamFilterFieldTuple<ProductsSortOptions>> = [];

    productsSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<ProductsSortOptions> = [p, paramFilterField];
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
    refetchProducts();
  }, [translationsLanguage]);

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
            type="ProductFilterParameter"
            setFilter={setFilter}
            setFilterField={setFilterField}
            removeFilterField={removeFilterField}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <div className="flex gap-2">
            <Button>
              <NavLink to={Routes.products.new}>{t('forms.create')}</NavLink>
            </Button>
          </div>
        </div>

        <ListTable {...{ columns, isFilterOn, table, Paginate }} />
        <Dialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> {t('deleteProductDialog.title')}</DialogTitle>
              <DialogDescription>{t('deleteProductDialog.description')}</DialogDescription>
              <DialogDescription>
                {productsToDelete.map((i) => (
                  <div key={i.id}>
                    {i.id} {i.name} {i.slug}
                  </div>
                ))}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">{t('deleteProductDialog.cancel')}</Button>
              </DialogClose>
              <Button variant="destructive" onClick={deleteProductsToDelete}>
                {t('deleteProductDialog.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Stack>
  );
};
