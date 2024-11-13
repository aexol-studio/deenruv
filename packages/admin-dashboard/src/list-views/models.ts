import { CustomFieldConfigType, LogicalOperator, ModelTypes, SortOrder } from '@deenruv/admin-types';
import React from 'react';

export type PaginationInputSort = { key: string; sortDir: SortOrder };

export type PaginationInput = {
  page: number;
  perPage: number;
  sort?: PaginationInputSort;
  filter?:
    | ModelTypes['OrderFilterParameter']
    | ModelTypes['CollectionFilterParameter']
    | ModelTypes['FacetFilterParameter']
    | ModelTypes['AssetFilterParameter']
    | ModelTypes['ProductFilterParameter']
    | ModelTypes['CountryFilterParameter'];
  filterOperator?: LogicalOperator;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PromisePaginated = (
  props: PaginationInput,
  customFieldsConfig?: CustomFieldConfigType[],
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

export type GenericReturnDetail<T extends PromiseDetail> = ReturnType<T> extends Promise<infer R> ? R : never;

export interface TimeColumnProps {
  currSort: PaginationInputSort | undefined;
  setSort: (key: string) => void;
}
