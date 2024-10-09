import {
  Badge,
  Button,
  Card,
  CardTitle,
  EmptyState,
  PaymentMethodImage,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { ORDER_STATE } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { LatestOrderListType, LatestOrderSelector } from '@/graphql/orders';
import { useList } from '@/lists/useList';
import { OrderStateBadge } from '@/pages/orders/_components';
import { Routes, priceFormatter } from '@/utils';
import { SortOrder } from '@/zeus';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { ArrowRight, Hash, RefreshCw } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/state';
import { PaymentMethod } from '@/types';

interface LatestOrdersProps {}

const LATEST_ORDERS_EXCLUDED_STATUSES = [
  ORDER_STATE.CANCELLED,
  ORDER_STATE.DRAFT,
  ORDER_STATE.MODIFYING,
  ORDER_STATE.ADDING_ITEMS,
];

export const LatestOrders: React.FC<LatestOrdersProps> = () => {
  const { t } = useTranslation(['common', 'dashboard', 'orders']);
  const navigate = useNavigate();
  const language = useSettings((p) => p.language);

  const columns: ColumnDef<LatestOrderListType>[] = [
    {
      accessorKey: 'id',
      header: () => t('orders:table.id'),
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: 'payments',
      header: () => t('dashboard:payment'),
      cell: ({ row }) => <PaymentMethodImage paymentType={row.original.payments?.[0]?.method as PaymentMethod} />,
    },
    {
      accessorKey: 'code',
      header: () => t('orders:table.code'),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant={'outline'}
              className="flex w-full items-center justify-center"
              onClick={() => navigate(Routes.order.to(row.original.id))}
            >
              <Hash size={16} />
              <ArrowRight className="pl-1" size={16} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{row.original.code}</TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: 'state',
      header: () => t('orders:table.state'),
      cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
    },
    {
      accessorKey: 'totalWithTax',
      header: () => t('orders:table.totalWithTax'),
      cell: ({ row }) => <span>{priceFormatter(row.original.totalWithTax, row.original.currencyCode)}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: () => t('orders:table.createdAt'),
      cell: ({ row }) => (
        <span>
          {formatDistanceToNow(new Date(row.original.createdAt), {
            locale: language === 'pl' ? pl : undefined,
            addSuffix: true,
          })}
        </span>
      ),
    },
  ];

  const getOrders = async () => {
    const response = await apiCall()('query')({
      orders: [
        {
          options: {
            take: 10,
            filter: { active: { eq: false }, state: { notIn: LATEST_ORDERS_EXCLUDED_STATUSES } },
            sort: { createdAt: SortOrder.DESC },
          },
        },
        {
          items: LatestOrderSelector,
          totalItems: true,
        },
      ],
    });

    return response.orders;
  };

  const { objects: orders, refetch: refetchOrders } = useList({
    route: async () => getOrders(),
    listType: 'orders',
  });

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="basis-1/2 p-6">
      <Stack className="justify-between">
        <CardTitle className="text-lg">{t('dashboard:latestOrders')}</CardTitle>
        <Button size="icon" variant="outline" onClick={() => refetchOrders()}>
          <RefreshCw size={20} />
        </Button>
      </Stack>
      <Table>
        <TableHeader>
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
                {row.getAllCells().map((cell) => (
                  <TableCell className="py-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <EmptyState columnsLength={columns.length} />
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
