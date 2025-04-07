import { Permission, SortOrder } from '@deenruv/admin-types';
import { apiClient, deepMerge, DetailList, ListLocations, PaginationInput, Routes } from '@deenruv/react-ui-devkit';

const tableId = 'promotions-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['promotions']: [
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
  return response['promotions'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deletePromotions } = await apiClient('mutation')({
      deletePromotions: [{ ids }, { message: true, result: true }],
    });
    return !!deletePromotions.length;
  } catch (error) {
    return error;
  }
};

export const PromotionsListPage = () => (
  <DetailList
    filterFields={[
      { key: 'name', operator: 'StringOperators' },
      { key: 'enabled', operator: 'BooleanOperators' },
    ]}
    searchFields={['name']}
    entityName={'Promotion'}
    route={Routes['promotions']}
    tableId={tableId}
    fetch={fetch}
    onRemove={onRemove}
    detailLinkColumn="id"
    createPermissions={[Permission.CreatePromotion]}
    deletePermissions={[Permission.DeletePromotion]}
  />
);
