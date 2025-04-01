import { useDetailListHook } from './useDetailListHook';
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
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ImageOff, PlusCircleIcon } from 'lucide-react';
import { SelectIDColumn, ActionsDropdown, BooleanCell } from './DetailListColumns';
import { DeleteDialog } from './_components/DeleteDialog';
import { useServer, useSettings } from '@/state';
import { ModelTypes, Permission, ValueTypes } from '@deenruv/admin-types';
import React from 'react';
import { deepMerge, mergeSelectorWithCustomFields } from '@/utils';
import { usePluginStore } from '@/plugins';
import { ListLocationID, PromisePaginated } from '@/types';
import { useErrorHandler, useLocalStorage } from '@/hooks';
import { Button, TableLabel, useDetailView } from '@/components';
import { ListTable } from '@/components/molecules/ListTable';
import { ActionResult, ListType } from './useDetailListHook/types';
import { DEFAULT_COLUMN_PRIORITIES, DEFAULT_COLUMNS } from './useDetailListHook/constants';
import { cn } from '@/lib';
import { FiltersDialog } from '@/components/templates/DetailList/useDetailListHook/FiltersDialog.js';
import { ColumnView } from '@/components/templates/DetailList/useDetailListHook/ColumnView.js';
import { DetailListStoreProvider } from './useDetailList.js';

type DISABLED_SEARCH_FIELDS = 'enabled' | 'id' | 'createdAt' | 'updatedAt';
type AwaitedReturnType<T extends PromisePaginated> = Awaited<ReturnType<T>>;
type AdditionalColumn<T> = string & { __type?: T };
type FIELDS<T extends PromisePaginated> = Array<
    keyof AwaitedReturnType<T>['items'][number] | AdditionalColumn<'CustomColumn'>
>;

type CheckIfInModelTypes<T extends string> = T extends keyof ModelTypes ? T : never;

type FilterField<ENTITY extends keyof ModelTypes> = {
    key: Exclude<keyof ModelTypes[CheckIfInModelTypes<`${ENTITY}FilterParameter`>], '_or' | '_and'> | string;
    // TODO: infer operator based on the type of the field
    operator:
        | 'StringOperators'
        | 'IDOperators'
        | 'BooleanOperators'
        | 'NumberOperators'
        | 'DateOperators'
        | 'StringListOperators'
        | 'NumberListOperators'
        | 'BooleanListOperators'
        | 'IDListOperators'
        | 'DateListOperators';
};

type RouteBase = { list: string; new: string; route: string; to: (id: string) => string };
type RouteWithoutCreate = { edit: (id: string, parentId?: string) => void };
type RouteWithCreate = RouteWithoutCreate & { create: () => void };

export function DetailList<T extends PromisePaginated, ENTITY extends keyof ValueTypes>({
    fetch,
    route,
    onRemove,
    tableId,
    entityName,
    searchFields,
    hideColumns,
    additionalColumns = [],
    detailLinkColumn,
    filterFields,
    noPaddings,
    noCreateButton,
    createPermissions,
    deletePermissions,
    additionalButtons,
    additionalRowActions,
}: {
    fetch: T;
    onRemove?: (items: AwaitedReturnType<T>['items']) => Promise<boolean>;
    tableId: ListLocationID | string;
    entityName: ENTITY | string;
    searchFields: Array<Exclude<FIELDS<T>[number], DISABLED_SEARCH_FIELDS>>;
    hideColumns?: FIELDS<T>;
    additionalColumns?: ColumnDef<AwaitedReturnType<T>['items'][number]>[];
    detailLinkColumn?: keyof AwaitedReturnType<T>['items'][number];
    filterFields?: FilterField<ENTITY>[];
    noPaddings?: boolean;
    noCreateButton?: boolean;
    createPermissions: Array<Permission>;
    deletePermissions: Array<Permission>;
    additionalButtons?: React.ReactNode;
    additionalRowActions?: Array<{
        label: string;
        onClick: (data: AwaitedReturnType<T>['items'][number]) => ActionResult | Promise<ActionResult>;
    }>;
} & (
    | { noCreateButton: true; route?: RouteBase | RouteWithoutCreate }
    | { noCreateButton?: false; route?: RouteBase | RouteWithCreate }
)) {
    const { t } = useTranslation('table');

    const { userPermissions } = useServer();
    const isPermittedToCreate = useMemo(() => {
        if (!createPermissions) return true;
        return createPermissions.some(permission => userPermissions.includes(permission));
    }, [userPermissions]);
    const getPriority = (key: string): number => {
        // TODO: Here we probably need to add a check for custom columns
        // (or add a custom priority for them)
        return DEFAULT_COLUMN_PRIORITIES[key] ?? 500;
    };

    const navigate = useNavigate();
    const { getTableExtensions } = usePluginStore();
    const tableExtensions = getTableExtensions(tableId as any);
    const mergedSelectors = tableExtensions?.reduce(
        (acc, table) => deepMerge(acc, table.externalSelector || {}),
        {},
    );
    const rowActions = [
        ...(tableExtensions?.flatMap(table => table.rowActions || []) || []),
        ...(additionalRowActions || []),
    ];
    const bulkActions = tableExtensions?.flatMap(table => table.bulkActions || []);
    const customColumns = (tableExtensions?.flatMap(table => table.columns) || []) as ColumnDef<
        AwaitedReturnType<T>['items']
    >[];
    const customHideColumns = tableExtensions?.flatMap(table => table.hideColumns || []);
    const entityCustomFields = useServer(p =>
        p.serverConfig?.entityCustomFields?.find(el => el.entityName === entityName),
    )?.customFields;

    const [itemsToDelete, setItemsToDelete] = useState<AwaitedReturnType<T>['items']>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
    const [columnsVisibilityState, setColumnsVisibilityState] = useLocalStorage<VisibilityState>(
        `${tableId}-table-visibility`,
        { id: true, createdAt: true, updatedAt: true },
    );

    const getTableDefaultOrder = (): string[] => {
        return table
            .getAllColumns()
            .slice()
            .map(column => column.id)
            .sort((a, b) => {
                const isCustomA = a.startsWith('customFields.');
                const isCustomB = b.startsWith('customFields.');

                if (isCustomA && !isCustomB) return 1;
                if (!isCustomA && isCustomB) return -1;

                return a.localeCompare(b);
            });
    };

    const getTableDefaultVisibility = () => {
        return table.getAllColumns().reduce<Record<string, boolean>>((acc, column) => {
            acc[column.id] = column.id.startsWith('customFields.') ? false : true;
            return acc;
        }, {});
    };

    const [columnsOrderState, setColumnsOrderState] = useLocalStorage<string[]>(`${tableId}-table-order`, []);
    const columnsTranslations = t('columns', { returnObjects: true });
    const { handleError } = useErrorHandler();
    const hiddenColumns = useMemo(
        () => [...(hideColumns ?? []), 'customFields'].concat(customHideColumns ?? []),
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
    } = useDetailListHook({
        fetch: (params, customFieldsSelector) => fetch(params, customFieldsSelector, mergedSelectors),
        searchFields,
    });

    const columns = useMemo(() => {
        const entry = objects?.[0];
        const keys = entry
            ? Array.from(new Set([...DEFAULT_COLUMNS, ...Object.keys(entry)]))
            : DEFAULT_COLUMNS;

        if (keys.includes('customFields')) {
            const customFields = 'customFields' in entry ? entry.customFields : {};
            const customFieldsKeys = Object.keys(customFields).map(key => `customFields.${key}`);
            keys.push(...customFieldsKeys);
        }

        const columns: ColumnDef<AwaitedReturnType<T>['items']>[] = [];
        for (const key of keys) {
            if (key.startsWith('customFields.')) {
                columns.push({
                    enableHiding: true,
                    accessorKey: key,
                    header: () => {
                        const field = entityCustomFields?.find(el => el.name === key.split('.')[1]);
                        const fieldTranslation =
                            field?.label?.find(el => el.languageCode === language)?.value ||
                            field?.label?.[0]?.value;

                        let label = key;
                        if (fieldTranslation) {
                            label = fieldTranslation;
                        }
                        if (
                            columnsTranslations[key as keyof typeof columnsTranslations] !== undefined &&
                            columnsTranslations[key as keyof typeof columnsTranslations] !== ''
                        ) {
                            label = columnsTranslations[key as keyof typeof columnsTranslations];
                        }

                        return <TableLabel>{label}</TableLabel>;
                    },
                    cell: ({ row }) => {
                        const value = row.original.customFields[key.split('.')[1]];

                        if (!value) {
                            return '—';
                        }

                        if (typeof value === 'object') {
                            return JSON.stringify(value);
                        }
                        return value;
                    },
                });
                continue;
            }

            if (key === 'id') {
                columns.push(SelectIDColumn());
                columns.push(ActionsDropdown(navigate));
            }
            columns.push({
                accessorKey: key,
                header: () => {
                    if (DEFAULT_COLUMNS.includes(key) || key === 'name') {
                        return SortButton(
                            key,
                            columnsTranslations[key as keyof typeof columnsTranslations] || key,
                        );
                    } else {
                        return (
                            <TableLabel>
                                {columnsTranslations[key as keyof typeof columnsTranslations] || key}
                            </TableLabel>
                        );
                    }
                },
                cell: ({ row }) => {
                    const value = row.original[key];

                    if (!value && (key.includes('asset') || key.includes('Asset'))) {
                        return (
                            <div className="flex h-16 w-16 flex-col items-center justify-center gap-2 bg-gray-200 p-3">
                                <ImageOff size={24} className="text-gray-500" />
                            </div>
                        );
                    }

                    if (typeof value === 'boolean') {
                        return <BooleanCell value={value} />;
                    }

                    if (!value || value === '' || value === undefined) {
                        return '—';
                    }

                    if (!value) return JSON.stringify(value);

                    if (typeof value === 'object') {
                        if ('__typename' in value) {
                            // that means we know this type
                            // * GOOD TO REMEMBER: Get __typename from nested objects in selector.
                            if (value.__typename === 'Asset') {
                                // this is an asset
                                return (
                                    <img
                                        src={value.preview}
                                        alt={row.original.name}
                                        className="h-16 w-16 object-cover"
                                    />
                                );
                            }
                        }
                        return JSON.stringify(value);
                    }

                    if (key === 'createdAt' || key === 'updatedAt' || key === 'orderPlacedAt') {
                        return (
                            <div className="text-nowrap">
                                {format(new Date(row.original[key]), 'dd.MM.yyyy hh:mm')}
                            </div>
                        );
                    }
                    if (key === detailLinkColumn && route) {
                        return (
                            <Button
                                variant="outline"
                                className="p-0 h-6 px-3 border border-gray-500 hover:border-gray-600 text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                                onClick={() => {
                                    if ('edit' in route) {
                                        route.edit(
                                            row.original.id,
                                            'productId' in row.original ? row.original.productId : undefined,
                                        );
                                    } else {
                                        navigate(route.to(row.original.id), { viewTransition: true });
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

        const getAccessorKey = (column: ColumnDef<AwaitedReturnType<T>['items']>) =>
            'accessorKey' in column ? column.accessorKey : column.id;

        const mergedAndReplacedColumns = [...columns, ...customColumns, ...additionalColumns].reduce(
            (acc, column) => {
                const columnKey = getAccessorKey(column);
                const existingIndex = acc.findIndex(c => getAccessorKey(c) === columnKey);
                if (existingIndex > -1) acc[existingIndex] = column;
                else acc.push(column);
                return acc;
            },
            [] as ColumnDef<AwaitedReturnType<T>['items']>[],
        );
        const resultColumns = mergedAndReplacedColumns
            .filter(column => !hiddenColumns?.includes(getAccessorKey(column) as string))
            .sort((a, b) => {
                const keyA = getAccessorKey(a) as string;
                const keyB = getAccessorKey(b) as string;
                return getPriority(keyA) - getPriority(keyB);
            }) as ColumnDef<AwaitedReturnType<T>['items']>[];

        return resultColumns;
    }, [objects, navigate]);

    useEffect(() => {
        setColumnsVisibilityState(prev => {
            const keys = objects?.[0] ? Object.keys(objects[0]) : [];
            const newVisibility = { ...prev };
            for (const key of keys) {
                if (key === 'customFields') {
                    const customFields = 'customFields' in objects[0] ? objects[0].customFields : {};
                    const customFieldsKeys = Object.keys(customFields).map(key => `customFields.${key}`);
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

    const table = useReactTable({
        data: objects || [],
        manualPagination: true,
        columns,
        getRowId: row => row.id,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnsVisibilityState,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        onColumnOrderChange: setColumnsOrderState,
        meta: {
            hideColumns: hiddenColumns,
            bulkActions,
            rowActions,
            route,
            refetch,
            onRemove: onRemove
                ? items => {
                      setItemsToDelete(items);
                      setDeleteDialogOpened(true);
                  }
                : undefined,
            deletePermissions,
        },
        state: {
            ...((columnsOrderState || []).filter(Boolean).length > 0 && {
                columnOrder: ['select-id', ...columnsOrderState, 'actions'],
            }),
            columnPinning: { right: ['actions'], left: ['select-id'] },
            columnVisibility: columnsVisibilityState,
            pagination: { pageIndex: page, pageSize: perPage },
            rowSelection,
            columnFilters,
        },
    });

    useEffect(() => {
        if (!columnsOrderState.length) setColumnsOrderState(getTableDefaultOrder());
        if (!columnsVisibilityState || !Object.keys(columnsVisibilityState).length) {
            setColumnsVisibilityState(getTableDefaultVisibility());
        }
    }, [table]);

    const isFiltered = useMemo(() => {
        let isFiltered = false;
        if (filter) {
            Object.keys(filter).forEach(fieldKey => {
                const property = filter[fieldKey as keyof typeof filter];
                if (property) {
                    Object.keys(property).forEach(filterTypeKey => {
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
            const result = await onRemove?.(itemsToDelete);

            if ((result as any)?.response?.errors) {
                handleError((result as any).response.errors);
                return;
            }

            refetch();
            table.toggleAllRowsSelected(false);
            setItemsToDelete([]);
            setDeleteDialogOpened(false);
        } catch {
            console.error('Error deleting items');
        }
    };

    const defaultFilterFields = DEFAULT_COLUMNS.map(key => {
        if (key === 'id') {
            return { key: 'id', operator: 'IDOperators' };
        } else if (key === 'createdAt' || key === 'updatedAt') {
            return { key, operator: 'DateOperators' };
        }
        return { key, operator: 'StringOperators' };
    });

    const filterProperties = {
        filterLabels:
            [...defaultFilterFields, ...(filterFields || [])].map(({ key, operator }) => ({
                name: key,
                type: operator,
            })) || [],
        filter: searchParamFilter,
        setFilterField,
        removeFilterField,
        resetFilterFields,
        changeFilterField,
    };

    return (
        <DetailListStoreProvider refetch={refetch} table={table}>
            <div className={cn('w-full', !noPaddings && 'px-4 py-2 md:px-8 md:py-4')}>
                {onRemove && (
                    <DeleteDialog
                        {...{ itemsToDelete, deleteDialogOpened, setDeleteDialogOpened, onConfirmDelete }}
                    />
                )}
                <div className="page-content-h flex w-full flex-col gap-2">
                    <div className="flex w-full flex-col items-start gap-4 mb-1">
                        <div className="flex w-full items-end justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <ColumnView table={table} entityName={entityName} />
                                {Search}
                                <FiltersDialog {...filterProperties} />
                            </div>
                            <div className="flex gap-2">
                                {route && !noCreateButton && isPermittedToCreate && (
                                    <Button
                                        className="flex items-center gap-2"
                                        onClick={() => {
                                            if ('create' in route) route.create();
                                            else navigate((route as RouteBase).new, { viewTransition: true });
                                        }}
                                    >
                                        <PlusCircleIcon size={16} />
                                        {t('create')}
                                    </Button>
                                )}
                                {additionalButtons}
                            </div>
                        </div>
                    </div>
                    <ListTable {...{ columns, isFiltered, table, Paginate, tableId }} />
                </div>
            </div>
        </DetailListStoreProvider>
    );
}
