import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListLocations } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'sellers-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
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
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response['sellers'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteSellers } = await apiClient('mutation')({
      deleteSellers: [{ ids }, { message: true, result: true }],
    });
    return !!deleteSellers.length;
  } catch (error) {
    return error;
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
      route={Routes['sellers']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateSeller]}
      deletePermissions={[Permission.DeleteSeller]}
    />
  );
};
