import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { deepMerge, GenericList, PaginationInput, ProductListSelector, Routes } from '@deenruv/react-ui-devkit';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(ProductListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiCall()('query')({
    customers: [
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
  return response['customers'];
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

export const CustomersListPage = () => (
  <GenericList
    searchFields={['name']}
    hideColumns={['customFields', 'translations', 'collections', 'variantList']}
    entityName={'Product'}
    type={'products'}
    route={Routes['products']}
    tableId="customers-list-view"
    fetch={fetch}
    onRemove={onRemove}
  />
);
