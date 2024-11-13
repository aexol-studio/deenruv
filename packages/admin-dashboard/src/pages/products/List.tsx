import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { GenericList } from '@/list-views/GenericList';
import { PaginationInput } from '@/lists/models';
import { deepMerge, ProductListSelector, Routes } from '@deenruv/react-ui-devkit';

const fetch = async <T,>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
) => {
  const selector = deepMerge(ProductListSelector, customFieldsSelector ?? {});
  const response = await apiCall()('query')({
    ['products']: [
      {
        options: {
          take: perPage,
          skip: (page - 1) * perPage,
          filterOperator: filterOperator,
          sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
          ...(filter && { filter }),
        },
      },
      { items: selector, totalItems: true },
    ],
  });
  return response['products'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProducts } = await apiCall()('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const ProductsListPage = () => (
  <GenericList
    searchFields={['name']}
    hideColumns={['customFields', 'translations', 'collections', 'variantList']}
    entityName={'Product'}
    type={'products'}
    route={Routes['products']}
    tableId="products-list-view"
    fetch={fetch}
    onRemove={onRemove}
  />
);
