import type {
  LogicalOperator,
  ModelTypes,
  SortOrder,
} from "@deenruv/admin-types";

export type PaginationInputSort = { key: string; sortDir: SortOrder };

export type PaginationInput = {
  page: number;
  perPage: number;
  sort?: PaginationInputSort;
  filter?:
    | ModelTypes["OrderFilterParameter"]
    | ModelTypes["CollectionFilterParameter"]
    | ModelTypes["FacetFilterParameter"]
    | ModelTypes["AssetFilterParameter"]
    | ModelTypes["ProductFilterParameter"]
    | ModelTypes["CountryFilterParameter"];
  filterOperator?: LogicalOperator;
};
export interface PromisePaginatedItem {
  id: string | number;
}

export type PromisePaginated = (
  props: PaginationInput,
  customFieldsConfig?: any,
  additionalSelector?: object,
) => Promise<{
  totalItems: number;
  items: any;
}>;

export type SearchResult = {
  children: React.ReactNode;
};

export type PromiseSearch = (props: PaginationInput) => Promise<SearchResult[]>;

export type GenericReturn<T extends PromisePaginated> =
  ReturnType<T> extends Promise<infer R>
    ? R extends {
        items: infer I;
      }
      ? I
      : never
    : never;

export type PromiseDetail = ({ slug }: { slug: string }) => Promise<any>;

export type GenericReturnDetail<T extends PromiseDetail> =
  ReturnType<T> extends Promise<infer R> ? R : never;

export interface TimeColumnProps {
  currSort: PaginationInputSort | undefined;
  setSort: (key: string) => void;
}
