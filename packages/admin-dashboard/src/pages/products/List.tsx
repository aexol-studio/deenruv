import { SortOrder } from '@deenruv/admin-types';
import {
  apiClient,
  deepMerge,
  DetailList,
  PaginationInput,
  ProductListSelector,
  Routes,
} from '@deenruv/react-ui-devkit';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(ProductListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
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
    const { deleteProducts } = await apiClient('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const ProductsListPage = () => (
  <DetailList
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
