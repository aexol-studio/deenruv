import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { SellerListSelector } from '@/graphql/sellers';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(SellerListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
    sellers: [
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
  return response['sellers'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteSellers } = await apiClient('mutation')({
      deleteSellers: [{ ids }, { message: true, result: true }],
    });
    return !!deleteSellers.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const SellersListPage = () => {
  return (
    <DetailList
      filterFields={[{ key: 'name', operator: 'StringOperators' }]}
      detailLinkColumn="id"
      searchFields={['name']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'Seller'}
      type={'sellers'}
      route={Routes['sellers']}
      tableId="sellers-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateSeller}
      deletePermission={Permission.DeleteSeller}
    />
  );
};
