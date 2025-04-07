import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PaymentMethodImage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Separator,
  OrderStateBadge,
  useQuery,
} from "@deenruv/react-ui-devkit";
import { LatestOrderListType, LatestOrdersQuery } from "../../graphql";
import {
  Routes,
  priceFormatter,
  useWidgetsStore,
} from "@deenruv/react-ui-devkit";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import { ArrowRight, Hash, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

type LatestOrdersProps = object;

export const LatestOrdersWidget: React.FC<LatestOrdersProps> = () => {
  const { t } = useTranslation("dashboard-widgets-plugin", {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const language = useWidgetsStore((p) => p.context?.language);
  const { data: latestOrdersData, runQuery: getOrders } =
    useQuery(LatestOrdersQuery);
  const orders = latestOrdersData?.orders?.items || [];

  const columns: ColumnDef<LatestOrderListType>[] = [
    {
      accessorKey: "id",
      header: () => t("orders:table.id"),
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: "payments",
      header: () => t("dashboard:payment"),
      cell: ({ row }) => {
        const type = row.original.payments?.[0]?.method;
        if (!type) return <></>;
        return <PaymentMethodImage paymentType={type} />;
      },
    },
    {
      accessorKey: "code",
      header: () => t("orders:table.code"),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant={"outline"}
              className="flex w-full items-center justify-center"
              onClick={() => navigate(Routes.orders.to(row.original.id))}
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
      accessorKey: "state",
      header: () => t("orders:table.state"),
      cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
    },
    {
      accessorKey: "totalWithTax",
      header: () => t("orders:table.totalWithTax"),
      cell: ({ row }) => (
        <span>
          {priceFormatter(row.original.totalWithTax, row.original.currencyCode)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => t("orders:table.createdAt"),
      cell: ({ row }) => (
        <span>
          {formatDistanceToNow(new Date(row.original.createdAt), {
            locale: language === "pl" ? pl : undefined,
            addSuffix: true,
          })}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <CardTitle className="text-lg">
              {t("dashboard:latestOrders")}
            </CardTitle>
            <Button
              size="icon"
              variant="outline"
              className="mb-px size-7"
              onClick={() => {
                setIsLoading(true);
                getOrders();
              }}
            >
              <RefreshCw
                size={16}
                className={`transition-transform duration-500 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <NavLink to={Routes.orders.list}>
            <Button className="relative top-2 -mt-3" variant={"ghost"}>
              {t("dashboard:showAll")}
            </Button>
          </NavLink>
        </div>
      </CardHeader>
      <Separator className="mb-3" />
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell className="py-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState
                columnsLength={columns.length}
                title={t("emptyDataTitle")}
                description={t("emptyData")}
              />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
