import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { StockLocationListSelector } from '@/graphql/stockLocations';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(
    deepMerge(StockLocationListSelector, customFieldsSelector ?? {}),
    additionalSelector ?? {},
  );
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
      { items: selector, totalItems: true },
    ],
  });
  return response['stockLocations'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteStockLocations } = await apiClient('mutation')({
      deleteStockLocations: [
        { input: ids.map((id) => ({ id })) },
        {
          message: true,
          result: true,
        },
      ],
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
    type={'stockLocations'}
    route={Routes['stockLocations']}
    tableId="stockLocations-list-view"
    fetch={fetch}
    onRemove={onRemove}
    createPermission={Permission.CreateStockLocation}
    deletePermission={Permission.DeleteStockLocation}
  />
);
