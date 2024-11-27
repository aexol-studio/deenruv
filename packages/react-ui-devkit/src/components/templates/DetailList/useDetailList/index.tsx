import { LogicalOperator, ModelTypes, SortOrder } from '@deenruv/admin-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Paginate } from './Paginate';
import { Search } from './Search';
import { FiltersResult } from './FiltersResult';
import { FiltersButton } from './FiltersButton';
import React from 'react';
import { GenericReturn, PaginationInput, PromisePaginated } from '@/types/models';
import { SortButton } from '@/components';
import { ListType, ListTypeKeys } from './types';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { FilterInputTypeUnion } from '../_components/types';

type LimitKeys =
    | '10perPage'
    | '25perPage'
    | '32perPage'
    | '48perPage'
    | '50perPage'
    | '64perPage'
    | '100perPage';

export type ItemsPerPageType = { name: LimitKeys; value: number }[];

export const ITEMS_PER_PAGE: ItemsPerPageType = [
    { name: '10perPage', value: 10 },
    { name: '25perPage', value: 25 },
    { name: '50perPage', value: 50 },
    { name: '100perPage', value: 100 },
];

const enum SearchParamKey {
    SEARCH = 'q',
    PAGE = 'page',
    PER_PAGE = 'per',
    SORT = 'sort',
    SORT_DIR = 'dir',
    FILTER = 'filter',
    FILTER_OPERATOR = 'operator',
}

type FIELD = keyof ModelTypes[ListType[keyof ListType]];
type VALUE = ModelTypes[ListType[keyof ListType]][FIELD];

export const useDetailList = <T extends PromisePaginated, K extends keyof ListType, S>({
    fetch,
    type,
    entityName,
    customItemsPerPage,
    searchFields,
    customFieldsSelector,
}: {
    fetch: T;
    type: K;
    entityName: keyof ModelTypes;
    customItemsPerPage?: ItemsPerPageType;
    searchFields?: (keyof Awaited<ReturnType<PromisePaginated>>['items'][number])[];
    customFieldsSelector?: S;
}): {
    Paginate: JSX.Element;
    Search: JSX.Element;
    SortButton: (
        key: keyof Awaited<ReturnType<PromisePaginated>>['items'][number],
        translated?: string,
    ) => JSX.Element;
    objects: GenericReturn<T> | undefined;
    searchParamValues: PaginationInput;
    refetch: (initialFilterState?: ModelTypes[ListType[K]] | undefined) => void;
    type: K;
    filter: ModelTypes[ListType[K]] | undefined;
    setFilterField: (field: FIELD, value: VALUE) => void;
    removeFilterField: (field: FIELD) => void;
} => {
    const [searchParams, setSearchParams] = useCustomSearchParams();
    const [total, setTotal] = useState(0);
    const [objects, setObjects] = useState<GenericReturn<T>>();

    const setSearchQuery = (query: string | null) => {
        if (query) {
            searchParams.set(SearchParamKey.SEARCH, query);
            setSearchParams(searchParams);
        } else {
            searchParams.delete(SearchParamKey.SEARCH);
            setSearchParams(searchParams);
        }
    };

    const setFilterField = (field: FIELD, value: VALUE) => {
        try {
            const filterURL = searchParams.get(SearchParamKey.FILTER);
            if (filterURL) {
                const filterFromParamsJSON = JSON.parse(filterURL) as ModelTypes[ListType[typeof type]];
                searchParams.set(
                    SearchParamKey.FILTER,
                    JSON.stringify({ ...filterFromParamsJSON, [field]: value }),
                );
                setSearchParams(searchParams);
            } else {
                searchParams.set(SearchParamKey.FILTER, JSON.stringify({ [field]: value }));
                setSearchParams(searchParams);
            }
        } catch (err) {
            console.error(`Parsing filter searchParams Key to JSON failed: ${err}`);
        }
    };

    const removeFilterField = (field: FIELD) => {
        try {
            const filterURL = searchParams.get(SearchParamKey.FILTER);
            const filterFromParamsJSON = JSON.parse(filterURL || '') as ModelTypes[ListType[typeof type]];
            delete filterFromParamsJSON[field];
            if (Object.keys(filterFromParamsJSON).length === 0) {
                searchParams.delete(SearchParamKey.FILTER);
            } else {
                searchParams.set(SearchParamKey.FILTER, JSON.stringify(filterFromParamsJSON));
            }
            setSearchParams(searchParams);
        } catch (err) {
            console.error(`Parsing filter searchParams Key to JSON failed: ${err}`);
        }
    };

    const setSort = (sort: string) => {
        const currSort = searchParams.get(SearchParamKey.SORT);
        const currSortDir = searchParams.get(SearchParamKey.SORT_DIR);
        if (!currSort || !currSortDir) {
            searchParams.set(SearchParamKey.SORT, sort);
            searchParams.set(SearchParamKey.SORT_DIR, SortOrder.ASC);
        } else {
            if (sort === currSort) {
                if (currSortDir === SortOrder.ASC) {
                    searchParams.set(SearchParamKey.SORT_DIR, SortOrder.DESC);
                } else if (currSortDir === SortOrder.DESC) {
                    searchParams.delete(SearchParamKey.SORT);
                    searchParams.delete(SearchParamKey.SORT_DIR);
                } else {
                    searchParams.set(SearchParamKey.SORT, sort);
                    searchParams.set(SearchParamKey.SORT_DIR, SortOrder.ASC);
                }
            } else {
                searchParams.set(SearchParamKey.SORT, sort);
                searchParams.set(SearchParamKey.SORT_DIR, SortOrder.ASC);
            }
        }
        setSearchParams(searchParams);
    };

    const searchParamValues: PaginationInput = useMemo(() => {
        const search = searchParams.get(SearchParamKey.SEARCH);
        const page = searchParams.get(SearchParamKey.PAGE);
        const perPage = searchParams.get(SearchParamKey.PER_PAGE);
        const sort = searchParams.get(SearchParamKey.SORT);
        const sortDir = searchParams.get(SearchParamKey.SORT_DIR);
        const filter = searchParams.get(SearchParamKey.FILTER);

        const searchFilter = (searchFields as string[])?.reduce(
            (acc, field) => {
                if (search) acc[field] = { contains: search };
                return acc;
            },
            {} as Record<string, { contains: string }>,
        );
        const filters = filter ? (JSON.parse(filter) as ModelTypes[ListType[typeof type]]) : undefined;
        const mergedFilters = { ...filters, ...searchFilter };
        try {
            return {
                page: page ? parseInt(page) : 1,
                perPage: perPage ? parseInt(perPage) : 10,
                sort: sort && sortDir ? { key: sort, sortDir: sortDir as SortOrder } : undefined,
                filter: mergedFilters,
                filterOperator: Object.keys(searchFilter).length ? LogicalOperator.AND : LogicalOperator.OR,
            };
        } catch (err) {
            throw new Error(`Parsing filter searchParams Key to JSON failed: ${err}`);
        }
    }, [searchParams, type, searchFields]);

    const refetch = useCallback(
        (initialFilterState?: ModelTypes[ListType[K]] | undefined) => {
            const page = searchParams.get(SearchParamKey.PAGE);
            if (page) searchParamValues.page = +page;
            searchParamValues.filter = initialFilterState;
            fetch(searchParamValues, customFieldsSelector).then(({ items, totalItems }) => {
                setObjects(items);
                setTotal(totalItems);
            });
        },
        [searchParams, type, searchParamValues],
    );

    useEffect(() => {
        fetch(searchParamValues, customFieldsSelector).then(({ items, totalItems }) => {
            setObjects(items);
            setTotal(totalItems);
        });
    }, [searchParamValues]);

    const itemsPerPage = useMemo(() => customItemsPerPage || ITEMS_PER_PAGE, [customItemsPerPage]);
    const totalPages = useMemo(
        () => Math.ceil(total / searchParamValues.perPage),
        [total, searchParamValues],
    );

    return {
        type,
        filter: searchParamValues.filter,
        setFilterField,
        removeFilterField,
        Search: (
            <Search
                {...{
                    initialSearchQuery: searchParams.get(SearchParamKey.SEARCH),
                    setSearchQuery,
                    searchFields,
                    entityName,
                }}
            />
        ),
        Paginate: (
            <Paginate
                {...{ itemsPerPage, searchParamValues, total, totalPages, searchParams, setSearchParams }}
            />
        ),
        SortButton: (key, translated) => (
            <SortButton
                currSort={searchParamValues.sort}
                sortKey={key as string}
                onClick={() => setSort(key as string)}
            >
                {translated || (key as string)}
            </SortButton>
        ),
        objects,
        searchParamValues,
        refetch,
    };
};
