import { Stack } from '@/components/Stack';
import { OrderListSelector, OrderListType } from '@/graphql/orders';
import { ListType, useList } from '@/lists/useList';
import { DeletionResult, ModelTypes, ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { format } from 'date-fns';
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal, ArrowRight, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Badge,
  Checkbox,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Routes,
  EmptyState,
  OrderStateBadge,
  SortButton,
  useLocalStorage,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { PaymentMethodImage, Search } from '@/components';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { OrdersSortOptions, ParamFilterFieldTuple, ordersSortOptionsArray } from '@/lists/types';
import { priceFormatter } from '@/utils';
import { ORDER_STATE } from '@/graphql/base';

const createDraftOrder = async () => {
  const response = await apiClient('mutation')({
    createDraftOrder: { id: true },
  });
  return response.createDraftOrder.id;
};

const getOrders = async (options: ResolverInputTypes['OrderListOptions']) => {
  const response = await apiClient('query')({
    orders: [
      { options },
      {
        totalItems: true,
        items: OrderListSelector,
      },
    ],
  });

  return response.orders;
};

export const OrdersListPage = () => {
  const { t } = useTranslation('orders');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState<ModelTypes[ListType['orders']] | undefined>();

  const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
    'orders-table-visibility',
    {
      emailAddress: false,
      firstName: false,
      orderPlacedAt: false,
      phoneNumber: false,
      shipping: false,
      type: false,
      updatedAt: false,
    },
  );

  const {
    objects: orders,
    Paginate,
    setSort,
    optionInfo,
    setFilterField,
    setFilter,
    removeFilterField,
    isFilterOn,
    setFilterLogicalOperator,
    refetch: refetchOrders,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) => {
      return getOrders({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      });
    },
    listType: 'orders',
  });

  const [ordersToDelete, setOrdersToDelete] = useState<OrderListType[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetchOrders(filterState);

    const POLLING_FREQUENCY = 10000;
    let timer: NodeJS.Timeout | undefined = setInterval(() => refetchOrders(filterState), POLLING_FREQUENCY);

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };
  }, [filterState]);

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

  const deleteOrdersToDelete = async () => {
    const resp = await Promise.all(
      ordersToDelete
        .filter((i) => i.state === ORDER_STATE.DRAFT)
        .map((i) => apiClient('mutation')({ deleteDraftOrder: [{ orderId: i.id }, { message: true, result: true }] })),
    );
    resp.forEach((i) =>
      i.deleteDraftOrder.result === DeletionResult.NOT_DELETED
        ? toast.error(i.deleteDraftOrder.message)
        : toast(i.deleteDraftOrder.message || 'Order deleted'),
    );
    const respCancel = await Promise.all(
      ordersToDelete
        .filter(
          (i) =>
            i.state !== ORDER_STATE.DRAFT && i.state !== ORDER_STATE.CANCELLED && i.state !== ORDER_STATE.MODIFYING,
        )
        .map((i) =>
          apiClient('mutation')({
            cancelOrder: [
              { input: { orderId: i.id } },
              {
                __typename: true,
                '...on Order': { id: true },
                '...on EmptyOrderLineSelectionError': {
                  errorCode: true,
                  message: true,
                },
                '...on QuantityTooGreatError': {
                  errorCode: true,
                  message: true,
                },
                '...on MultipleOrderError': {
                  errorCode: true,
                  message: true,
                },
                '...on CancelActiveOrderError': {
                  errorCode: true,
                  message: true,
                },
                '...on OrderStateTransitionError': {
                  errorCode: true,
                  message: true,
                },
              },
            ],
          }),
        ),
    );
    respCancel.forEach(
      (i) =>
        i.cancelOrder.__typename !== 'Order' &&
        toast.error(t('topActions.orderCancelError', { value: i.cancelOrder.message }), { position: 'top-center' }),
    );
    refetchOrders(filterState);
    setDeleteDialogOpened(false);
    setOrdersToDelete([]);
  };

  const columns: ColumnDef<OrderListType>[] = [
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
        <Link to={Routes.orders.to(row.original.id)} className="text-primary-600">
          <Badge variant="outline" className="flex w-full items-center justify-center">
            {row.original.id}
            <ArrowRight className="pl-1" size={16} />
          </Badge>
        </Link>
      ),
    },
    {
      accessorKey: 'state',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="state" onClick={() => setSort('state')}>
          {t('table.state')}
        </SortButton>
      ),
      cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
    },
    {
      accessorKey: 'firstName',
      header: () => <div> {t('table.firstName')}</div>,
      cell: ({ row }) => <div className="capitalize">{row.original.customer?.firstName}</div>,
    },
    {
      accessorKey: 'lastName',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('customerLastName')}>
          {t('table.lastName')}
        </SortButton>
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.customer?.lastName}</div>,
    },
    {
      accessorKey: 'emailAddress',
      header: t('table.emailAddress'),
      cell: ({ row }) => (
        <HoverCard openDelay={100}>
          <HoverCardTrigger asChild>
            <div className="max-w-[200px] truncate">{row.original.customer?.emailAddress}</div>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-auto flex-shrink items-center justify-between gap-4">
            {row.original.customer?.emailAddress}{' '}
            <Copy
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(row.original.customer?.emailAddress || '');
                toast.info(t('copied'), { position: 'top-center' });
              }}
            />
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      accessorKey: 'type',
      header: t('table.type'),
    },
    {
      accessorKey: 'phoneNumber',
      header: t('table.phoneNumber'),
      cell: ({ row }) => <div className="text-nowrap">{row.original.customer?.phoneNumber}</div>,
    },
    {
      accessorKey: 'code',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="code" onClick={() => setSort('code')}>
          {t('table.code')}
        </SortButton>
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
      accessorKey: 'orderPlacedAt',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="orderPlacedAt" onClick={() => setSort('orderPlacedAt')}>
          {t('table.placedAt')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">
          {row.original.orderPlacedAt ? format(new Date(row.original.orderPlacedAt), 'dd.MM.yyyy hh:mm') : ''}
        </div>
      ),
    },
    {
      accessorKey: 'shipping',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="shipping" onClick={() => setSort('shipping')}>
          {t('table.shipping')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">{priceFormatter(row.original.shipping, row.original.currencyCode)}</div>
      ),
    },
    {
      accessorKey: 'payments',
      header: () => t('table.paymentMethod'),
      cell: ({ row }) => (
        <div className="text-nowrap">
          <PaymentMethodImage paymentType={row.original.payments?.[0]?.method || ''} />
        </div>
      ),
    },
    {
      accessorKey: 'totalWithTax',
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="totalWithTax" onClick={() => setSort('totalWithTax')}>
          {t('table.totalWithTax')}
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-nowrap">{priceFormatter(row.original.totalWithTax, row.original.currencyCode)}</div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      cell: ({ row }) => (
        <div className="text-nowrap">{format(new Date(row.original.updatedAt), 'dd.MM.yyyy hh:mm')}</div>
      ),
      header: () => (
        <SortButton currSort={optionInfo.sort} sortKey="updatedAt" onClick={() => setSort('updatedAt')}>
          {t('table.updatedAt')}
        </SortButton>
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              {t('table.copyId')}
            </DropdownMenuItem>
            {row.original.customer?.id && (
              <DropdownMenuItem>
                <Link to={Routes.customers.to(row.original.customer.id)}>{t('table.viewCustomer')}</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Link to={Routes.orders.to(row.original.id)} className="text-primary-600">
                {t('table.viewOrder')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.state === ORDER_STATE.DRAFT && (
              <DropdownMenuItem
                onClick={() => {
                  setDeleteDialogOpened(true);
                  setOrdersToDelete([row.original]);
                }}
              >
                <div className=" text-red-400 hover:text-red-400 dark:hover:text-red-400">{t('table.deleteDraft')}</div>
              </DropdownMenuItem>
            )}
            {row.original.state !== ORDER_STATE.DRAFT &&
              row.original.state !== ORDER_STATE.CANCELLED &&
              row.original.state !== ORDER_STATE.MODIFYING && (
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteDialogOpened(true);
                    setOrdersToDelete([row.original]);
                  }}
                >
                  <div className=" text-red-400 hover:text-red-400 dark:hover:text-red-400">
                    {t('create.cancelOrder')}
                  </div>
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: orders || [],
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
    const filters: Array<ParamFilterFieldTuple<OrdersSortOptions>> = [];
    ordersSortOptionsArray.forEach((p) => {
      if (searchParams.has(p)) {
        const param = searchParams.get(p);

        if (param) {
          const [paramVal, paramKey] = param.split(',');
          const paramFilterField = { [paramKey]: paramVal };
          const paramFilterTuple: ParamFilterFieldTuple<OrdersSortOptions> = [p, paramFilterField];
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
    setOrdersToDelete([]);
  }, [orders]);

  return (
    <Stack column className="gap-6">
      <div className="page-content-h flex w-full flex-col">
        <div className="mb-4 flex flex-wrap justify-between gap-4">
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
            type="OrderFilterParameter"
            setFilter={(e) => {
              setFilter(e);
              setFilterState(e);
            }}
            setFilterField={(fieldName, fieldValue) => {
              setFilterField(fieldName, fieldValue);
              setFilterState((prevState) => {
                if (prevState) {
                  (prevState[fieldName] as ModelTypes['StringOperators']) = fieldValue as ModelTypes['StringOperators'];
                }
                return prevState;
              });
            }}
            removeFilterField={(e) => {
              removeFilterField(e);
              setFilterState((prevState) => {
                if (prevState) delete prevState[e];
                return prevState;
              });
            }}
            setFilterLogicalOperator={setFilterLogicalOperator}
          />
          <div className="flex gap-2">
            {table
              .getFilteredSelectedRowModel()
              .rows.map((i) => i.original)
              .filter((i) => i.state !== ORDER_STATE.CANCELLED && i.state !== ORDER_STATE.MODIFYING).length ? (
              <Button
                variant="outline"
                onClick={() => {
                  setOrdersToDelete(table.getFilteredSelectedRowModel().rows.map((i) => i.original));
                  setDeleteDialogOpened(true);
                }}
              >
                {t('deleteOrCancel')}
              </Button>
            ) : null}
            <Button
              onClick={async () => {
                const id = await createDraftOrder();
                if (id) {
                  navigate(Routes.orders.to(id));
                  refetchOrders(filterState);
                } else console.error('Failed to create order');
              }}
            >
              {t('createOrder')}
            </Button>
          </div>
        </div>

        <div ref={tableWrapperRef} className={`h-full overflow-auto rounded-md border`}>
          <Table className="w-full" {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}>
            <TableHeader className="bg-primary-foreground sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                  title={tCommon(`emptyState.default.${isFilterOn ? 'filtered' : 'empty'}.title`)}
                  description={tCommon(`emptyState.default.${isFilterOn ? 'filtered' : 'empty'}.text`)}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {t('selectedValue', {
              from: table.getFilteredSelectedRowModel().rows.length,
              to: table.getFilteredRowModel().rows.length,
            })}
          </div>
          <div className="space-x-2">{Paginate}</div>
        </div>
        <Dialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened}>
          <DialogContent>
            <DialogTitle> {t('deleteDraft.title')}</DialogTitle>
            <div className="flex max-h-[50vh] flex-col gap-2">
              {ordersToDelete.filter((i) => i.state === ORDER_STATE.DRAFT).length ? (
                <div>
                  <DialogDescription className="text-primary text-lg">
                    {t('deleteDraft.descriptionDraft')}
                  </DialogDescription>
                  <DialogDescription>
                    {ordersToDelete
                      .filter((i) => i.state === ORDER_STATE.DRAFT)
                      .map((i) => (
                        <div key={i.id}>
                          {i.id} {i.code} {i.customer?.firstName} {i.customer?.firstName} {i.customer?.emailAddress}
                        </div>
                      ))}
                  </DialogDescription>
                </div>
              ) : null}
              {ordersToDelete.filter((i) => i.state !== ORDER_STATE.DRAFT && i.state !== ORDER_STATE.CANCELLED)
                .length ? (
                <div>
                  <DialogDescription className="text-primary text-lg">
                    {t('deleteDraft.descriptionOrder')}
                  </DialogDescription>
                  <DialogDescription>
                    {ordersToDelete
                      .filter((i) => i.state !== ORDER_STATE.DRAFT && i.state !== ORDER_STATE.CANCELLED)
                      .map((i) => (
                        <div key={i.id}>
                          {i.id} {i.code} {i.customer?.firstName} {i.customer?.firstName} {i.customer?.emailAddress}
                        </div>
                      ))}
                  </DialogDescription>
                </div>
              ) : null}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">{t('deleteDraft.cancel')}</Button>
              </DialogClose>
              <Button variant="destructive" onClick={deleteOrdersToDelete}>
                {t('deleteDraft.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Stack>
  );
};
