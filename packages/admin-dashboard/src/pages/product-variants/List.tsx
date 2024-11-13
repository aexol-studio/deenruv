import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { GenericList } from '@/list-views/GenericList';
import { PaginationInput } from '@/lists/models';
import { deepMerge, ProductVariantsListSelector, Routes } from '@deenruv/react-ui-devkit';

const fetch = async <T,>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
) => {
  const selector = deepMerge(ProductVariantsListSelector, customFieldsSelector ?? {});
  const response = await apiCall()('query')({
    ['productVariants']: [
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
  return response['productVariants'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProductVariants } = await apiCall()('mutation')({
      deleteProductVariants: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProductVariants.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const ProductVariantsListPage = () => (
  <GenericList
    searchFields={['name']}
    hideColumns={['customFields', 'translations', 'collections', 'variantList']}
    entityName={'ProductVariant'}
    type={'productVariants'}
    route={Routes['productVariants']}
    tableId="productVariants-list-view"
    fetch={fetch}
    onRemove={onRemove}
  />
);
