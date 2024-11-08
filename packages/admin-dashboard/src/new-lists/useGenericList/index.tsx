import { GenericReturn, PaginationInput, PromisePaginated } from '@/lists/models';
import { LogicalOperator, ModelTypes, SortOrder } from '@deenruv/admin-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Paginate } from './Paginate';
import { Search } from './Search';
import { FiltersResult } from './FiltersResult';
import { FiltersButton } from './FiltersButton';
import { SortButton } from '@/components';

type LimitKeys = '10perPage' | '25perPage' | '32perPage' | '48perPage' | '50perPage' | '64perPage' | '100perPage';

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

export type ListType = {
  administrators: 'AdministratorFilterParameter';
  assets: 'AssetFilterParameter';
  channels: 'ChannelFilterParameter';
  collections: 'CollectionFilterParameter';
  'countries-list': 'CountryFilterParameter';
  facets: 'FacetFilterParameter';
  'modal-assets-list': 'AssetFilterParameter';
  'modal-product-variants-list': 'ProductVariantFilterParameter';
  'modal-products-list': 'ProductFilterParameter';
  orders: 'OrderFilterParameter';
  paymentMethods: 'PaymentMethodFilterParameter';
  products: 'ProductFilterParameter';
  promotions: 'PromotionFilterParameter';
  roles: 'RoleFilterParameter';
  sellers: 'SellerFilterParameter';
  shippingMethods: 'ShippingMethodFilterParameter';
  stockLocations: 'StockLocationFilterParameter';
  taxCategories: 'TaxCategoryFilterParameter';
  taxRates: 'TaxRateFilterParameter';
  zones: 'ZoneFilterParameter';
};

export const ListTypeKeys = {
  administrators: 'AdministratorFilterParameter' as const,
  assets: 'AssetFilterParameter' as const,
  channels: 'ChannelFilterParameter' as const,
  collections: 'CollectionFilterParameter' as const,
  'countries-list': 'CountryFilterParameter' as const,
  facets: 'FacetFilterParameter' as const,
  'modal-assets-list': 'AssetFilterParameter' as const,
  'modal-product-variants-list': 'ProductVariantFilterParameter' as const,
  'modal-products-list': 'ProductFilterParameter' as const,
  orders: 'OrderFilterParameter' as const,
  paymentMethods: 'PaymentMethodFilterParameter' as const,
  products: 'ProductFilterParameter' as const,
  roles: 'RoleFilterParameter' as const,
  sellers: 'SellerFilterParameter' as const,
  shippingMethods: 'ShippingMethodFilterParameter' as const,
  stockLocations: 'StockLocationFilterParameter' as const,
  taxCategories: 'TaxCategoryFilterParameter' as const,
  taxRates: 'TaxRateFilterParameter' as const,
  zones: 'ZoneFilterParameter' as const,
  promotions: 'PromotionFilterParameter' as const,
};

type FIELD = keyof ModelTypes[ListType[keyof ListType]];
type VALUE = ModelTypes[ListType[keyof ListType]][FIELD];

export const useGenericList = <T extends PromisePaginated, K extends keyof ListType, Z>({
  route,
  type,
  customItemsPerPage,
  searchFields,
  customFieldsSelector,
}: {
  route: T;
  type: K;
  customItemsPerPage?: ItemsPerPageType;
  searchFields?: (keyof Awaited<ReturnType<PromisePaginated>>['items'][number])[];
  customFieldsSelector?: Z;
}): {
  Paginate: JSX.Element;
  FiltersResult: JSX.Element;
  FiltersButton: JSX.Element;
  Search: JSX.Element;
  SortButton: (key: keyof Awaited<ReturnType<PromisePaginated>>['items'][number], translated?: string) => JSX.Element;
  objects: GenericReturn<T> | undefined;
  searchParamValues: PaginationInput;
  refetch: (initialFilterState?: ModelTypes[ListType[K]] | undefined) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [objects, setObjects] = useState<GenericReturn<T>>();

  const setFilterField = (field: FIELD, value: VALUE) => {
    try {
      const filterURL = searchParams.get(SearchParamKey.FILTER);
      if (filterURL) {
        const filterFromParamsJSON = JSON.parse(filterURL) as ModelTypes[ListType[typeof type]];
        searchParams.set(SearchParamKey.FILTER, JSON.stringify({ ...filterFromParamsJSON, [field]: value }));
        setSearchParams(searchParams);
      } else {
        searchParams.set(SearchParamKey.FILTER, JSON.stringify({ [field]: value }));
        setSearchParams(searchParams);
      }
    } catch (err) {
      throw new Error(`Parsing filter searchParams Key to JSON failed: ${err}`);
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
      throw new Error(`Parsing filter searchParams Key to JSON failed: ${err}`);
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
    const page = searchParams.get(SearchParamKey.PAGE);
    const perPage = searchParams.get(SearchParamKey.PER_PAGE);
    const sort = searchParams.get(SearchParamKey.SORT);
    const sortDir = searchParams.get(SearchParamKey.SORT_DIR);
    const filter = searchParams.get(SearchParamKey.FILTER);
    const filterOperator = searchParams.get(SearchParamKey.FILTER_OPERATOR);

    try {
      return {
        page: page ? parseInt(page) : 1,
        perPage: perPage ? parseInt(perPage) : 10,
        sort: sort && sortDir ? { key: sort, sortDir: sortDir as SortOrder } : undefined,
        filter: filter ? (JSON.parse(filter) as ModelTypes[ListType[typeof type]]) : undefined,
        filterOperator: filterOperator ? (filterOperator as LogicalOperator) : LogicalOperator.OR,
      };
    } catch (err) {
      throw new Error(`Parsing filter searchParams Key to JSON failed: ${err}`);
    }
  }, [searchParams]);

  const refetch = useCallback(
    (initialFilterState?: ModelTypes[ListType[K]] | undefined) => {
      const page = searchParams.get(SearchParamKey.PAGE);
      if (page) searchParamValues.page = +page;
      searchParamValues.filter = initialFilterState;
      route(searchParamValues, customFieldsSelector).then((r) => {
        setObjects(r.items);
        setTotal(r.totalItems);
      });
    },
    [searchParams, type, route, searchParamValues],
  );

  useEffect(() => {
    route(searchParamValues, customFieldsSelector).then((r) => {
      setObjects(r.items);
      setTotal(r.totalItems);
    });
  }, [searchParamValues]);

  const itemsPerPage = useMemo(() => customItemsPerPage || ITEMS_PER_PAGE, [customItemsPerPage]);
  const totalPages = useMemo(() => Math.ceil(total / searchParamValues.perPage), [total, searchParamValues]);

  const filterProperties = {
    type,
    filter: searchParamValues.filter,
    setFilterField,
    removeFilterField,
  };

  return {
    Search: <Search />,
    FiltersResult: <FiltersResult {...filterProperties} />,
    FiltersButton: <FiltersButton {...filterProperties} />,
    Paginate: <Paginate {...{ itemsPerPage, searchParamValues, total, totalPages, searchParams, setSearchParams }} />,
    SortButton: (key, translated) => (
      <SortButton currSort={searchParamValues.sort} sortKey={key as string} onClick={() => setSort(key as string)}>
        {translated || (key as string)}
      </SortButton>
    ),
    objects,
    searchParamValues,
    refetch,
  };
};
