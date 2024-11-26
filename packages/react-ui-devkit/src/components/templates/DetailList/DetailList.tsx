import { useDetailList } from './useDetailList';
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
import { ArrowRight, Circle, CircleCheck, PlusCircleIcon } from 'lucide-react';
import { SelectIDColumn, ActionsDropdown } from './DetailListColumns';
import { DeleteDialog } from './_components/DeleteDialog';
import { useServer } from '@/state';
import { ModelTypes, ValueTypes } from '@deenruv/admin-types';
import React from 'react';
import { deepMerge, mergeSelectorWithCustomFields } from '@/utils';
import { usePluginStore } from '@/plugins';
import { ListLocationID, PromisePaginated } from '@/types';
import { useLocalStorage } from '@/hooks';
import { Button } from '@/components';
import { ListTable } from '@/components/molecules/ListTable';
import { ListType } from './useDetailList/types';
import { FiltersButton } from './useDetailList/FiltersButton';
import { FiltersResult } from './useDetailList/FiltersResult';
import { DEFAULT_COLUMN_PRIORITIES, DEFAULT_COLUMNS, EXCLUDED_COLUMNS } from './useDetailList/constants';
import { cn } from '@/lib';

type DISABLED_SEARCH_FIELDS = 'enabled' | 'id' | 'createdAt' | 'updatedAt';
type AwaitedReturnType<T extends PromisePaginated> = Awaited<ReturnType<T>>;
type AdditionalColumn<T> = string & { __type?: T };
type FIELDS<T extends PromisePaginated> = Array<
    keyof AwaitedReturnType<T>['items'][number] | AdditionalColumn<'CustomColumn'>
>;

type CheckIfInModelTypes<T extends string> = T extends keyof ModelTypes ? T : never;

type FilterField<ENTITY extends keyof ModelTypes> = {
    key: Exclude<keyof ModelTypes[CheckIfInModelTypes<`${ENTITY}FilterParameter`>], '_or' | '_and'>;
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

export function DetailList<T extends PromisePaginated, ENTITY extends keyof ValueTypes>({
    fetch,
    route,
    onRemove,
    type,
    tableId,
    entityName,
    searchFields,
    hideColumns,
    additionalColumns = [],
    detailLinkColumn,
    filterFields,
    noPaddings,
}: {
    fetch: T;
    route:
        | { list: string; new: string; route: string; to: (id: string) => string }
        | { create: () => void; edit: (id: string) => void };
    onRemove: (items: AwaitedReturnType<T>['items']) => Promise<boolean>;
    type: keyof ListType;
    tableId: ListLocationID;
    entityName: ENTITY;
    searchFields: Array<Exclude<FIELDS<T>[number], DISABLED_SEARCH_FIELDS>>;
    hideColumns?: FIELDS<T>;
    additionalColumns?: ColumnDef<AwaitedReturnType<T>['items'][number]>[];
    detailLinkColumn?: keyof AwaitedReturnType<T>['items'][number];
    filterFields?: FilterField<ENTITY>[];
    noPaddings?: boolean;
}) {
    const { t } = useTranslation('table');
    const getPriority = (key: string): number => {
        // TODO: Here we probably need to add a check for custom columns
        // (or add a custom priority for them)
        return DEFAULT_COLUMN_PRIORITIES[key] ?? 500;
    };

    const navigate = useNavigate();
    const { getTableExtensions } = usePluginStore();
    const tableExtensions = getTableExtensions(tableId);
    const mergedSelectors = tableExtensions?.reduce(
        (acc, table) => deepMerge(acc, table.externalSelector || {}),
        {},
    );
    const rowActions = tableExtensions?.flatMap(table => table.rowActions || []);
    const bulkActions = tableExtensions?.flatMap(table => table.bulkActions || []);
    const customColumns = (tableExtensions?.flatMap(table => table.columns) || []) as ColumnDef<
        AwaitedReturnType<T>['items']
    >[];

    const entityCustomFields = useServer(p =>
        p.serverConfig?.entityCustomFields?.find(el => el.entityName === entityName),
    )?.customFields;
    const customFieldsSelector = useMemo(
        () => mergeSelectorWithCustomFields({}, entityName, entityCustomFields),
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
        type: searchParamType,
        filter: searchParamFilter,
        setFilterField,
        removeFilterField,
    } = useDetailList({
        type,
        fetch: (params, customFieldsSelector) => fetch(params, customFieldsSelector, mergedSelectors),
        searchFields,
        customFieldsSelector,
        entityName,
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
                            field?.label?.find(el => el.languageCode === 'en')?.value ||
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

                        return <div className="whitespace-nowrap">{label}</div>;
                    },
                    cell: ({ row }) => {
                        const value = row.original.customFields[key.split('.')[1]];
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
                columns.push(ActionsDropdown());
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
                            <div className="whitespace-nowrap">
                                {columnsTranslations[key as keyof typeof columnsTranslations] || key}
                            </div>
                        );
                    }
                },
                cell: ({ row }) => {
                    const value = row.original[key];

                    if (!value) return JSON.stringify(value);

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
                    if (key === 'createdAt' || key === 'updatedAt') {
                        return (
                            <div className="text-nowrap">
                                {format(new Date(row.original[key]), 'dd.MM.yyyy hh:mm')}
                            </div>
                        );
                    }
                    if (key === detailLinkColumn) {
                        return (
                            <Button
                                variant="outline"
                                size="default"
                                onClick={() => {
                                    if ('edit' in route) {
                                        route.edit(row.original.id);
                                    } else {
                                        navigate(route.to(row.original.id));
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
            .filter(column => !hideColumns?.includes(getAccessorKey(column) as string))
            .sort((a, b) => {
                const keyA = getAccessorKey(a) as string;
                const keyB = getAccessorKey(b) as string;
                return getPriority(keyA) - getPriority(keyB);
            }) as ColumnDef<AwaitedReturnType<T>['items']>[];

        return resultColumns;
    }, [objects]);

    const [columnsOrderState, setColumnsOrderState] = useLocalStorage<string[]>(`${type}-table-order`, []);

    useEffect(() => {
        setColumnsVisibilityState(prev => {
            const keys = objects?.[0] ? Object.keys(objects[0]) : [];
            const newVisibility = { ...prev };
            for (const key of keys) {
                if (key === 'customFields') {
                    const customFields = 'customFields' in objects[0] ? objects[0].customFields : {};
                    const customFieldsKeys = Object.keys(customFields).map(key => `customFields.${key}`);
                    for (const customKey of customFieldsKeys) {
                        if (hideColumns?.includes(customKey)) {
                            newVisibility[customKey] = false;
                        } else if (prev[customKey] === undefined) {
                            newVisibility[customKey] = true;
                        }
                    }
                }

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
            hideColumns,
            bulkActions,
            rowActions,
            route,
            refetch,
            onRemove: items => {
                setItemsToDelete(items);
                setDeleteDialogOpened(true);
            },
        },
        state: {
            columnOrder: columnsOrderState,
            columnVisibility: columnsVisibilityState,
            pagination: { pageIndex: page, pageSize: perPage },
            rowSelection,
            columnFilters,
        },
    });

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
            const result = await onRemove(itemsToDelete);
            if (!result) return;
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
        type: searchParamType,
        filter: searchParamFilter,
        setFilterField,
        removeFilterField,
    };

    return (
        <div className={cn('w-full', !noPaddings && 'px-4 py-2 md:px-8 md:py-4')}>
            <DeleteDialog
                {...{ itemsToDelete, deleteDialogOpened, setDeleteDialogOpened, onConfirmDelete }}
            />
            <div className="page-content-h flex w-full flex-col gap-2">
                <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full items-end justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <FiltersButton {...filterProperties} />
                            {Search}
                        </div>
                        <div className="flex">
                            <Button
                                className="flex items-center gap-2"
                                onClick={() => {
                                    if ('create' in route) route.create();
                                    else navigate(route.new);
                                }}
                            >
                                <PlusCircleIcon size={16} />
                                {t('create')}
                            </Button>
                        </div>
                    </div>
                    <FiltersResult {...filterProperties} />
                </div>
                <ListTable {...{ columns, isFiltered, table, Paginate }} />
            </div>
        </div>
    );
}
