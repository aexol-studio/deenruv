import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListLocations } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'stockLocations-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['stockLocations']: [
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
  return response['stockLocations'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteStockLocations } = await apiClient('mutation')({
      deleteStockLocations: [{ input: ids.map((id) => ({ id })) }, { message: true, result: true }],
    });
    return !!deleteStockLocations.length;
  } catch (error) {
    return error;
  }
};

export const StockLocationsListPage = () => (
  <DetailList
    filterFields={[
      { key: 'name', operator: 'StringOperators' },
      { key: 'description', operator: 'StringOperators' },
    ]}
    detailLinkColumn="id"
    searchFields={['name']}
    hideColumns={['customFields', 'translations', 'collections', 'variantList']}
    entityName={'StockLocation'}
    route={Routes['stockLocations']}
    tableId={tableId}
    fetch={fetch}
    onRemove={onRemove}
    createPermissions={[Permission.CreateStockLocation]}
    deletePermissions={[Permission.DeleteStockLocation]}
  />
);
