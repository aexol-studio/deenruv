import { useDetailListHook } from "./useDetailListHook";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Group,
  ImageOff,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import {
  SelectIDColumn,
  ActionsDropdown,
  BooleanCell,
} from "./DetailListColumns";
import { DeleteDialog } from "./_components/DeleteDialog";
import { useServer, useSettings } from "@/state";
import { ModelTypes, Permission, ValueTypes } from "@deenruv/admin-types";
import React from "react";
import { deepMerge } from "@/utils";
import { usePluginStore } from "@/plugins";
import {
  ExternalListLocationSelector,
  LocationKeys,
  PromisePaginated,
} from "@/types";
import { useErrorHandler, useLocalStorage, useTranslation } from "@/hooks";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ImageWithPreview,
  LoadingMask,
  TableLabel,
} from "@/components";
import { ListTable } from "@/components/molecules/ListTable";
import {
  DEFAULT_COLUMN_PRIORITIES,
  DEFAULT_COLUMNS,
} from "./useDetailListHook/constants";
import { cn } from "@/lib";
import { FiltersDialog } from "@/components/templates/DetailList/useDetailListHook/FiltersDialog.js";
import { ColumnView } from "@/components/templates/DetailList/useDetailListHook/ColumnView.js";
import { DetailListStoreProvider } from "./useDetailList.js";
import { ExpandedState } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  GenericListContextType,
  RouteBase,
  RouteWithCreate,
  RouteWithoutCreate,
} from "./useDetailListHook/types.js";
import { PageBlock } from "@/universal_components/PageBlock.js";
import { Row } from "@tanstack/react-table";

export const isAssetObject = (value: object): boolean => {
  return Boolean(
    "preview" in value ||
      "source" in value ||
      ("__typename" in value && value.__typename === "Asset"),
  );
};

type DISABLED_SEARCH_FIELDS = "enabled" | "id" | "createdAt" | "updatedAt";
type AwaitedReturnType<T extends PromisePaginated> = Awaited<ReturnType<T>>;
type AdditionalColumn<T> = string & { __type?: T };
type FIELDS<T extends PromisePaginated> = Array<
  keyof AwaitedReturnType<T>["items"][number] | AdditionalColumn<"CustomColumn">
>;

type CheckIfInModelTypes<T extends string> = T extends keyof ModelTypes
  ? T
  : never;

type FilterField<ENTITY extends keyof ModelTypes> =
  | {
      key:
        | Exclude<
            keyof ModelTypes[CheckIfInModelTypes<`${ENTITY}FilterParameter`>],
            "_or" | "_and"
          >
        | string;
      translation?: string;
      // TODO: infer operator based on the type of the field
      operator:
        | "StringOperators"
        | "IDOperators"
        | "BooleanOperators"
        | "NumberOperators"
        | "DateOperators"
        | "StringListOperators"
        | "NumberListOperators"
        | "BooleanListOperators"
        | "IDListOperators"
        | "DateListOperators";
    }
  | {
      key:
        | Exclude<
            keyof ModelTypes[CheckIfInModelTypes<`${ENTITY}FilterParameter`>],
            "_or" | "_and"
          >
        | string;
      // TODO: infer operator based on the type of the field
      translation?: string;
      component?: React.ComponentType<any>;
    };

export function DetailList<
  KEY extends LocationKeys | ({} & string),
  T extends PromisePaginated,
  ENTITY extends keyof ValueTypes,
>({
  fetch,
  route,
  onRemove: remove,
  tableId,
  entityName,
  searchFields,
  searchTranslations,
  hideColumns,
  additionalColumns = [],
  detailLinkColumn,
  filterFields,
  noPaddings,
  noCreateButton,
  createPermissions,
  deletePermissions,
  additionalButtons,
  getSubRows,
  additionalRowActions,
  additionalBulkActions,
  stopRefetchOnChannelChange,
  suggestedOrderColumns,
  refetchTimeout,
}: {
  fetch: T;
  onRemove?: (items: { id: string }[]) => Promise<boolean>;
  tableId: KEY;
  entityName: ENTITY | string;
  searchFields?: Array<Exclude<FIELDS<T>[number], DISABLED_SEARCH_FIELDS>>;
  searchTranslations?: Array<{
    key: Exclude<FIELDS<T>[number], DISABLED_SEARCH_FIELDS>;
    value: string;
  }>;
  hideColumns?: FIELDS<T>;
  additionalColumns?: ColumnDef<AwaitedReturnType<T>["items"][number]>[];
  detailLinkColumn?: keyof AwaitedReturnType<T>["items"][number];
  filterFields?: FilterField<ENTITY>[];
  noPaddings?: boolean;
  noCreateButton?: boolean;
  createPermissions: Array<Permission>;
  deletePermissions: Array<Permission>;
  additionalButtons?: React.ReactNode;
  getSubRows?: (row: AwaitedReturnType<T>["items"][number]) => any;
  additionalRowActions?: KEY extends LocationKeys
    ? GenericListContextType<ExternalListLocationSelector[KEY]>["rowActions"]
    : GenericListContextType<any>["rowActions"];
  additionalBulkActions?: KEY extends LocationKeys
    ? GenericListContextType<ExternalListLocationSelector[KEY]>["bulkActions"]
    : GenericListContextType<any>["bulkActions"];
  stopRefetchOnChannelChange?: boolean;
  suggestedOrderColumns?: Partial<
    Record<keyof AwaitedReturnType<T>["items"][number] | (string & {}), number>
  >;
  refetchTimeout?: number;
} & (
  | { noCreateButton: true; route?: RouteBase | RouteWithoutCreate }
  | { noCreateButton?: false; route?: RouteBase | RouteWithCreate }
)) {
  const { t } = useTranslation("table");
  const selectedChannel = useSettings(({ selectedChannel }) => selectedChannel);
  const userPermissions = useServer(({ userPermissions }) => userPermissions);
  const isPermittedToCreate = useMemo(() => {
    if (!createPermissions) return true;
    return createPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }, [userPermissions]);

  const navigate = useNavigate();
  const { getTableExtensions } = usePluginStore();
  const tableExtensions = getTableExtensions(tableId as LocationKeys);
  const mergedSelectors = tableExtensions?.reduce(
    (acc, table) => deepMerge(acc, table.externalSelector || {}),
    {},
  );
  const rowActions = [
    ...(tableExtensions?.flatMap((table) => table.rowActions || []) || []),
    ...((additionalRowActions || []) as any), //TODO: fix types
  ];
  const bulkActions = [
    ...(tableExtensions?.flatMap((table) => table.bulkActions || []) || []),
    ...((additionalBulkActions || []) as any), //TODO: fix types
  ];
  const customColumns = (tableExtensions?.flatMap((table) => table.columns) ||
    []) as ColumnDef<AwaitedReturnType<T>["items"]>[];
  const customHideColumns = tableExtensions?.flatMap(
    (table) => table.hideColumns || [],
  );
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName === entityName,
    ),
  )?.customFields;

  const [itemsToDelete, setItemsToDelete] = useState<{ id: string }[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [columnsVisibilityState, setColumnsVisibilityState] =
    useLocalStorage<VisibilityState>(`${tableId}-table-visibility`, {
      id: true,
      createdAt: true,
      updatedAt: true,
    });

  const getTableDefaultOrder = (
    additional?: (string | undefined)[],
    suggestedOrder?: Partial<
      Record<keyof AwaitedReturnType<T>["items"][number], number>
    >,
  ): string[] => {
    const columns = table.getAllColumns().map((col) => col.id);
    const hasCode = columns.includes("code");
    const hasFeaturedAsset = columns.includes("featuredAsset");

    const prefix: string[] = ["id"];
    if (hasCode) prefix.push("code");
    if (hasFeaturedAsset) prefix.push("featuredAsset");

    const additionalColumns = (additional?.filter(Boolean) as string[]) || [];

    const getOrder = (id: string) =>
      suggestedOrder && id in suggestedOrder
        ? suggestedOrder[id as keyof typeof suggestedOrder]
        : undefined;

    const remaining = columns
      .filter((id) => !prefix.includes(id))
      .filter((id) => !additionalColumns.includes(id))
      .sort((a, b) => {
        const orderA = getOrder(a);
        const orderB = getOrder(b);

        if (orderA !== undefined && orderB !== undefined)
          return orderA - orderB;
        if (orderA !== undefined) return -1;
        if (orderB !== undefined) return 1;

        const isCustomFieldA = a.startsWith("customFields.");
        const isCustomFieldB = b.startsWith("customFields.");
        if (isCustomFieldA && !isCustomFieldB) return 1;
        if (!isCustomFieldA && isCustomFieldB) return -1;
        return a.localeCompare(b);
      });

    return [...prefix, ...remaining, ...additionalColumns].sort(
      (a, b) =>
        (suggestedOrder?.[a as keyof typeof suggestedOrder] ||
          DEFAULT_COLUMN_PRIORITIES[
            a as keyof typeof DEFAULT_COLUMN_PRIORITIES
          ]) -
        (suggestedOrder?.[b as keyof typeof suggestedOrder] ||
          DEFAULT_COLUMN_PRIORITIES[
            b as keyof typeof DEFAULT_COLUMN_PRIORITIES
          ]),
    );
  };

  const getTableDefaultVisibility = () => {
    return table
      .getAllColumns()
      .reduce<Record<string, boolean>>((acc, column) => {
        acc[column.id] = column.id.startsWith("customFields.") ? false : true;
        return acc;
      }, {});
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnsOrderState, setColumnsOrderState] = useLocalStorage<string[]>(
    `${tableId}-table-order`,
    [],
  );

  const columnsTranslations = t("columns", { returnObjects: true });
  const { handleError } = useErrorHandler();
  const hiddenColumns = useMemo(
    () =>
      [...(hideColumns ?? []), "customFields"].concat(customHideColumns ?? []),
    [hideColumns, customHideColumns],
  );
  const { language } = useSettings();

  const {
    objects,
    searchParamValues: { page, perPage, filter },
    refetch,
    SortButton,
    Paginate,
    Search,
    filter: searchParamFilter,
    setFilterField,
    removeFilterField,
    resetFilterFields,
    changeFilterField,
    loading,
  } = useDetailListHook({
    fetch: (params, customFieldsSelector) =>
      fetch(params, customFieldsSelector, mergedSelectors),
    searchFields,
    searchTranslations,
  });

  // useEffect(() => {
  //   if (!stopRefetchOnChannelChange) {
  //     refetch();
  //   }
  // }, [selectedChannel?.id]);

  // useEffect(() => {
  //   if (refetchTimeout && !loading) {
  //     const interval = setInterval(() => {
  //       refetch();
  //     }, refetchTimeout);
  //     return () => clearInterval(interval);
  //   }
  // }, [refetchTimeout, loading]);

  const columns = useMemo(() => {
    const entry = objects?.[0];
    const keys = entry
      ? Array.from(new Set([...DEFAULT_COLUMNS, ...Object.keys(entry)]))
      : DEFAULT_COLUMNS;

    if (keys.includes("customFields")) {
      const customFields = "customFields" in entry ? entry.customFields : {};
      const customFieldsKeys = Object.keys(customFields).map(
        (key) => `customFields.${key}`,
      );
      keys.push(...customFieldsKeys);
    }

    const columns: ColumnDef<AwaitedReturnType<T>["items"]>[] = [];
    for (const key of keys) {
      if (key.startsWith("customFields.")) {
        columns.push({
          enableHiding: true,
          accessorKey: key,
          header: () => {
            const field = entityCustomFields?.find(
              (el) => el.name === key.split(".")[1],
            );
            const fieldTranslation =
              field?.label?.find((el) => el.languageCode === language)?.value ||
              field?.label?.[0]?.value;

            let label = key;
            if (fieldTranslation) {
              label = fieldTranslation;
            }
            if (
              columnsTranslations[key as keyof typeof columnsTranslations] !==
                undefined &&
              columnsTranslations[key as keyof typeof columnsTranslations] !==
                ""
            ) {
              label =
                columnsTranslations[key as keyof typeof columnsTranslations];
            }

            return <TableLabel>{label}</TableLabel>;
          },
          cell: ({ row }) => {
            const value = row.original.customFields[key.split(".")[1]];
            if (typeof value === "number") {
              return value;
            }

            if (!value || value === "" || value === undefined) {
              return "—";
            }

            if (typeof value === "object") {
              return JSON.stringify(value);
            }
            return value;
          },
        });
        continue;
      }

      if (key === "id") {
        columns.push(SelectIDColumn());
        columns.push(ActionsDropdown(navigate));
      }
      columns.push({
        accessorKey: key,
        header: () => {
          if (DEFAULT_COLUMNS.includes(key) || key === "name") {
            return SortButton(
              key,
              columnsTranslations[key as keyof typeof columnsTranslations] ||
                key,
            );
          } else {
            return (
              <TableLabel>
                {columnsTranslations[key as keyof typeof columnsTranslations] ||
                  key}
              </TableLabel>
            );
          }
        },
        cell: ({ row }) => {
          const value = row.original[key];

          if (!value && (key.includes("asset") || key.includes("Asset"))) {
            return (
              <div className="flex size-16 flex-col items-center justify-center gap-2 bg-gray-200 p-3">
                <ImageOff size={24} className="text-gray-500" />
              </div>
            );
          }

          if (typeof value === "boolean") {
            return <BooleanCell value={value} />;
          }

          if (typeof value === "number") {
            return value;
          }

          if (!value || value === "" || value === undefined) {
            return "—";
          }

          if (!value) return JSON.stringify(value);

          if (typeof value === "object") {
            const isAsset = isAssetObject(value);
            if (isAsset) {
              return (
                <ImageWithPreview
                  src={value.preview}
                  alt={row.original.name}
                  imageClassName="size-16 object-cover"
                  previewClassName="p-2"
                />
              );
            }

            return JSON.stringify(value);
          }

          if (
            key === "createdAt" ||
            key === "updatedAt" ||
            key === "orderPlacedAt"
          ) {
            return (
              <div className="text-nowrap">
                {format(new Date(row.original[key]), "dd.MM.yyyy hh:mm")}
              </div>
            );
          }
          if (key === detailLinkColumn && route) {
            return (
              <Button
                variant="outline"
                className="h-6 border border-gray-500 p-0 px-3 text-gray-800 hover:border-gray-600 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                onClick={() => {
                  if ("edit" in route) {
                    route.edit(row.original.id, row, refetch);
                  } else {
                    navigate(route.to(row.original.id), {
                      viewTransition: true,
                    });
                  }
                }}
              >
                {row.original[detailLinkColumn]}
                <ArrowRight className="pl-1" size={16} />
              </Button>
            );
          }
          return row.original[key];
        },
      });
    }

    const getAccessorKey = (
      column: ColumnDef<AwaitedReturnType<T>["items"]>,
    ) => ("accessorKey" in column ? column.accessorKey : column.id);

    const mergedAndReplacedColumns = [
      ...columns,
      ...customColumns,
      ...additionalColumns,
    ].reduce(
      (acc, column) => {
        const columnKey = getAccessorKey(column);
        const existingIndex = acc.findIndex(
          (c) => getAccessorKey(c) === columnKey,
        );
        if (existingIndex > -1) acc[existingIndex] = column;
        else acc.push(column);
        return acc;
      },
      [] as ColumnDef<AwaitedReturnType<T>["items"]>[],
    );
    const resultColumns = mergedAndReplacedColumns.filter(
      (column) => !hiddenColumns?.includes(getAccessorKey(column) as string),
    );

    return resultColumns;
  }, [objects, navigate]);

  useEffect(() => {
    setColumnsVisibilityState((prev) => {
      const keys = objects?.[0] ? Object.keys(objects[0]) : [];
      const newVisibility = { ...prev };
      for (const key of keys) {
        if (key === "customFields") {
          const customFields =
            "customFields" in objects[0] ? objects[0].customFields : {};
          const customFieldsKeys = Object.keys(customFields).map(
            (key) => `customFields.${key}`,
          );
          for (const customKey of customFieldsKeys) {
            if (hiddenColumns?.includes(customKey)) {
              newVisibility[customKey] = false;
            } else if (prev[customKey] === undefined) {
              // customKey.replace(/customFields\.([a-zA-Z0-9_]+)/g, 'customFields.$1')
              newVisibility[customKey] = true;
            }
          }
        }

        if (hiddenColumns?.includes(key)) {
          newVisibility[key] = false;
        } else if (prev[key] === undefined) {
          newVisibility[key] = true;
        }
      }
      return newVisibility;
    });
  }, [objects]);

  const onRemove = (items: { id: string }[]) => {
    setItemsToDelete(items);
    setDeleteDialogOpened(true);
  };

  const table = useReactTable({
    data: objects || [],
    manualPagination: true,
    columns: columns as any,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnsVisibilityState,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnsOrderState,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: getSubRows,
    meta: {
      hideColumns: hiddenColumns as any,
      bulkActions,
      rowActions,
      route,
      refetch,
      onRemove: remove ? onRemove : undefined,
      deletePermissions,
    },
    state: {
      ...((columnsOrderState || []).filter(Boolean).length > 0 && {
        columnOrder: ["select-id", ...columnsOrderState, "actions"],
      }),
      expanded,
      columnPinning: { right: ["actions"], left: ["select-id"] },
      columnVisibility: columnsVisibilityState,
      pagination: { pageIndex: page, pageSize: perPage },
      rowSelection,
      columnFilters,
    },
  });

  useEffect(() => {
    if (!objects?.length) return;
    if (!columnsOrderState.length)
      setColumnsOrderState(
        getTableDefaultOrder(
          additionalColumns?.map((col) => col.id) || [],
          suggestedOrderColumns,
        ),
      );
    if (
      !columnsVisibilityState ||
      !Object.keys(columnsVisibilityState).length
    ) {
      setColumnsVisibilityState(getTableDefaultVisibility());
    }
  }, [objects, table]);

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

  const onConfirmDelete = async () => {
    try {
      const result = await remove?.(itemsToDelete);

      if ((result as any)?.response?.errors) {
        handleError((result as any).response.errors);
        return;
      }

      refetch();
      table.setRowSelection({});
      setItemsToDelete([]);
      setDeleteDialogOpened(false);
    } catch {
      console.error("Error deleting items");
    }
  };

  const defaultFilterFields = DEFAULT_COLUMNS.map((key) => {
    if (key === "id") {
      return { key: "id", operator: "IDOperators", component: undefined };
    } else if (key === "createdAt" || key === "updatedAt") {
      return { key, operator: "DateOperators", component: undefined };
    }
    return { key, operator: "StringOperators", component: undefined };
  });

  const filterProperties = {
    filterLabels:
      [...defaultFilterFields, ...(filterFields || [])].map((values) => ({
        name: values.key,
        type: "operator" in values ? values.operator : undefined,
        component: "component" in values ? values.component : undefined,
        translation: "translation" in values ? values.translation : undefined,
      })) || [],
    filter: searchParamFilter,
    setFilterField,
    removeFilterField,
    resetFilterFields,
    changeFilterField,
  };

  const selectedAmount = useMemo(
    () =>
      Object.entries(table.getState().rowSelection).filter(([, value]) => value)
        .length,
    [table.getState().rowSelection],
  );

  return (
    <PageBlock withoutPadding={noPaddings}>
      <DetailListStoreProvider
        refetch={refetch}
        sortButton={SortButton}
        table={table}
      >
        {loading ? (
          <LoadingMask />
        ) : (
          <div className={cn("w-full")}>
            <DeleteDialog
              {...{
                itemsToDelete,
                deleteDialogOpened,
                setDeleteDialogOpened,
                onConfirmDelete,
              }}
            />
            <div className="page-content-h flex w-full flex-col gap-2">
              <div className="mb-1 flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-end justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {selectedAmount > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 py-0"
                            aria-label="Open filters"
                          >
                            <Group className="size-4" aria-hidden="true" />
                            {t("Zaznaczone")} ({selectedAmount})
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="mr-6 w-56"
                          align="start"
                        >
                          <DropdownMenuLabel className="select-none">
                            {t("Operacje masowe")}
                          </DropdownMenuLabel>

                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {bulkActions.map((action) => {
                              const canShow = action?.canShow
                                ? action.canShow()
                                : true;
                              if (!canShow) return null;
                              const onClick = async () => {
                                try {
                                  const response = await action.onClick({
                                    table,
                                    data: objects,
                                    refetch,
                                  });
                                  const { error, info, success } = response;

                                  if (error) {
                                    throw new Error(error);
                                  } else if (info) {
                                    toast.info(info);
                                    table.toggleAllRowsSelected(false);
                                  } else {
                                    toast.success(success);
                                    refetch();
                                    table.toggleAllRowsSelected(false);
                                  }
                                } catch (error) {
                                  const message =
                                    error instanceof Error
                                      ? error.message
                                      : "Unknown error";
                                  toast.error(message);
                                }
                              };
                              return (
                                <DropdownMenuItem
                                  key={action.label}
                                  onClick={onClick}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  {action.icon}
                                  {action.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              disabled={!selectedAmount}
                              onClick={() => {
                                const selected = Object.entries(
                                  table.getState().rowSelection,
                                )
                                  .filter(([, value]) => value)
                                  .map(([key]) => key);
                                onRemove(selected.map((id) => ({ id })));
                              }}
                            >
                              <Trash2Icon className="mr-2 size-4" />
                              {t("Usuń zacznaczone")}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <ColumnView table={table} entityName={entityName} />
                    {Search}
                    <FiltersDialog {...filterProperties} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      {route && !noCreateButton && isPermittedToCreate && (
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => {
                            if ("create" in route) route.create(refetch);
                            else
                              navigate((route as RouteBase).new, {
                                viewTransition: true,
                              });
                          }}
                        >
                          <PlusCircleIcon size={16} />
                          {"createTranslation" in route
                            ? route.createTranslation
                            : t("create")}
                        </Button>
                      )}
                      {additionalButtons}
                    </div>
                  </div>
                </div>
              </div>
              <ListTable
                {...{
                  columns,
                  isFiltered,
                  table,
                  Paginate,
                  tableId: tableId as LocationKeys,
                }}
              />
            </div>
          </div>
        )}
      </DetailListStoreProvider>
    </PageBlock>
  );
}
