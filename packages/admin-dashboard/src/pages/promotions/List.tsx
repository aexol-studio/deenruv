import { apiCall } from '@/graphql/client';
import { ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { PromotionsListSelector } from '@/graphql/promotions';
import { GenericList } from '@/new-lists/GenericList';
import { PaginationInput } from '@/lists/models';
import { ProductListSelector, Routes } from '@deenruv/react-ui-devkit';

const PAGE_KEY = 'promotions';

const getPromotions = async (options: ResolverInputTypes['PromotionListOptions']) => {
  const response = await apiCall()('query')({
    promotions: [{ options }, { items: PromotionsListSelector, totalItems: true }],
  });
  return response.promotions;
};

const getProducts = async (options: ResolverInputTypes['ProductListOptions']) => {
  const response = await apiCall()('query')({
    products: [{ options }, { items: ProductListSelector, totalItems: true }],
  });
  return response.products;
};

const fetch = async ({ page, perPage, filter, filterOperator, sort }: PaginationInput) => {
  return getProducts({
    take: perPage,
    skip: (page - 1) * perPage,
    filterOperator: filterOperator,
    sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
    ...(filter && { filter }),
  });
};

export const PromotionsListPage = () => (
  <GenericList
    listType={PAGE_KEY}
    route={Routes[PAGE_KEY]}
    fetch={fetch}
    onRemove={(items) => {
      console.log(items);
      return Promise.resolve(true);
    }}
    searchFields={['slug']}
    hideColumns={['variantList', 'collections']}
    customColumns={[]}
  />
);
