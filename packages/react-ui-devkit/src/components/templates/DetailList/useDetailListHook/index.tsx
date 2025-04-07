import { LogicalOperator, ModelTypes, SortOrder } from "@deenruv/admin-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Paginate } from "./Paginate";
import { Search } from "./Search";
import React from "react";
import {
  GenericReturn,
  PaginationInput,
  PromisePaginated,
} from "@/types/models";
import {
  ITEMS_PER_PAGE,
  ItemsPerPageType,
  ListType,
  SearchParamKey,
} from "./types";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { SortSelect } from "@/components/templates/DetailList/useDetailListHook/SortSelect.js";
import { useSettings } from "@/state/settings.js";
import { useDetailView } from "../../DetailView/useDetailView.js";

type FIELD = keyof ModelTypes[ListType[keyof ListType]];
type VALUE = ModelTypes[ListType[keyof ListType]][FIELD];

export const useDetailListHook = <
  T extends PromisePaginated,
  K extends keyof ListType,
  S,
>({
  fetch,
  customItemsPerPage,
  searchFields,
  fakeURLParams,
}: {
  fetch: T;
  customItemsPerPage?: ItemsPerPageType;
  searchFields?: (keyof Awaited<
    ReturnType<PromisePaginated>
  >["items"][number])[];
  fakeURLParams?: boolean;
}): {
  Paginate: JSX.Element;
  Search: JSX.Element;
  SortButton: (
    key: keyof Awaited<ReturnType<PromisePaginated>>["items"][number],
    translated?: string,
  ) => JSX.Element;
  objects: GenericReturn<T> | undefined;
  searchParamValues: PaginationInput;
  refetch: (initialFilterState?: ModelTypes[ListType[K]] | undefined) => void;
  filter: ModelTypes[ListType[K]] | undefined;
  setFilterField: (field: FIELD, value: VALUE) => void;
  removeFilterField: (field: FIELD) => void;
  resetFilterFields: () => void;
  changeFilterField: (index: number, field: FIELD) => void;
} => {
  const { additionalData, setAdditionalData } = useDetailView();
  const { translationsLanguage } = useSettings(({ translationsLanguage }) => ({
    translationsLanguage,
  }));
  const [searchParams, setSearchParams] = useCustomSearchParams({
    fakeURLParams,
  });
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
        const filterFromParamsJSON = JSON.parse(filterURL);
        searchParams.set(
          SearchParamKey.FILTER,
          JSON.stringify({ ...filterFromParamsJSON, [field]: value }),
        );
        setSearchParams(searchParams);
      } else {
        searchParams.set(
          SearchParamKey.FILTER,
          JSON.stringify({ [field]: value }),
        );
        setSearchParams(searchParams);
      }
    } catch (err) {
      console.error(`Parsing filter searchParams Key to JSON failed: ${err}`);
    }
  };

  const changeFilterField = (index: number, field: FIELD) => {
    const filterURL = searchParams.get(SearchParamKey.FILTER);
    if (!filterURL) return;

    const filterFromParamsJSON = JSON.parse(filterURL);
    const filterArray = Object.entries(filterFromParamsJSON);
    filterArray[index][0] = field;
    filterArray[index][1] = {};
    const updatedFilter = Object.fromEntries(filterArray);
    const updatedSearchParams = JSON.stringify(updatedFilter);
    searchParams.set(SearchParamKey.FILTER, updatedSearchParams);
    setSearchParams(searchParams);
  };

  const removeFilterField = (field: FIELD) => {
    try {
      const filterURL = searchParams.get(SearchParamKey.FILTER);
      const filterFromParamsJSON = JSON.parse(filterURL || "");
      delete filterFromParamsJSON[field];
      if (Object.keys(filterFromParamsJSON).length === 0) {
        searchParams.delete(SearchParamKey.FILTER);
      } else {
        searchParams.set(
          SearchParamKey.FILTER,
          JSON.stringify(filterFromParamsJSON),
        );
      }
      setSearchParams(searchParams);
    } catch (err) {
      console.error(`Parsing filter searchParams Key to JSON failed: ${err}`);
    }
  };

  const resetFilterFields = () => {
    try {
      searchParams.delete(SearchParamKey.FILTER);
      setSearchParams(searchParams);
    } catch (err) {
      console.error(`Clearing filter searchParams failed: ${err}`);
    }
  };

  const setSort = (key: string, direction: SortOrder | undefined) => {
    const currSort = searchParams.get(SearchParamKey.SORT);

    if (!direction) {
      searchParams.delete(SearchParamKey.SORT);
      searchParams.delete(SearchParamKey.SORT_DIR);
    } else if (key !== currSort) {
      searchParams.set(SearchParamKey.SORT, key);
      searchParams.set(SearchParamKey.SORT_DIR, SortOrder.ASC);
    } else {
      if (direction === SortOrder.DESC) {
        searchParams.set(SearchParamKey.SORT_DIR, SortOrder.DESC);
      } else if (direction === SortOrder.ASC) {
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

    const searchFilter = ((searchFields as string[]) || []).reduce(
      (acc, field) => {
        if (search) acc[field] = { contains: search };
        return acc;
      },
      {} as Record<string, { contains: string }>,
    );
    const filters = filter ? JSON.parse(filter) : undefined;
    const mergedFilters = { ...filters, ...searchFilter };
    try {
      return {
        page: page ? parseInt(page) : 1,
        perPage: perPage ? parseInt(perPage) : 10,
        sort:
          sort && sortDir
            ? { key: sort, sortDir: sortDir as SortOrder }
            : undefined,
        filter: mergedFilters,
        filterOperator: Object.keys(searchFilter).length
          ? LogicalOperator.OR
          : LogicalOperator.AND,
      };
    } catch (err) {
      throw new Error(`Parsing filter searchParams Key to JSON failed: ${err}`);
    }
  }, [searchParams, searchFields]);

  const refetch = useCallback(
    (initialFilterState?: ModelTypes[ListType[K]] | undefined) => {
      const page = searchParams.get(SearchParamKey.PAGE);
      if (page) searchParamValues.page = +page;
      searchParamValues.filter = initialFilterState;
      fetch(searchParamValues).then(({ items, totalItems }) => {
        setObjects(items);
        setTotal(totalItems);
      });
    },
    [searchParams, searchParamValues],
  );

  useEffect(() => {
    fetch(searchParamValues).then(({ items, totalItems }) => {
      setObjects(items);
      setTotal(totalItems);
    });
  }, [translationsLanguage, searchParams]);

  useEffect(() => {
    if (
      additionalData &&
      "refetchList" in additionalData &&
      additionalData.refetchList
    ) {
      fetch(searchParamValues).then(({ items, totalItems }) => {
        setObjects(items);
        setTotal(totalItems);
      });
      setAdditionalData({ ...additionalData, refetchList: false });
    }
  }, [additionalData, translationsLanguage, searchParams]);

  const itemsPerPage = useMemo(
    () => customItemsPerPage || ITEMS_PER_PAGE,
    [customItemsPerPage],
  );
  const totalPages = useMemo(
    () => Math.ceil(total / searchParamValues.perPage),
    [total, searchParamValues],
  );

  return {
    filter: searchParamValues.filter,
    setFilterField,
    removeFilterField,
    resetFilterFields,
    changeFilterField,
    Search: (
      <Search
        {...{
          initialSearchQuery: searchParams.get(SearchParamKey.SEARCH),
          setSearchQuery,
          searchFields,
        }}
      />
    ),
    Paginate: (
      <Paginate
        {...{
          itemsPerPage,
          searchParamValues,
          total,
          totalPages,
          searchParams,
          setSearchParams,
        }}
      />
    ),
    SortButton: (key, translated) => (
      <SortSelect
        currSort={searchParamValues.sort}
        sortKey={key as string}
        onClick={(direction) => {
          setSort(key as string, direction);
        }}
      >
        {translated || (key as string)}
      </SortSelect>
    ),
    objects,
    searchParamValues,
    refetch,
  };
};
