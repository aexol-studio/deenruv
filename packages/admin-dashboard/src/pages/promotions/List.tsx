import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  apiClient,
  deepMerge,
  DetailList,
  PaginationInput,
  PromotionListSelector,
  Routes,
} from '@deenruv/react-ui-devkit';

const fetch = async <T,>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
) => {
  const selector = deepMerge(PromotionListSelector, customFieldsSelector ?? {});
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
      { items: selector, totalItems: true },
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
    tableId="promotions-list-view"
    fetch={fetch}
    onRemove={onRemove}
    detailLinkColumn="id"
    createPermissions={[Permission.CreatePromotion]}
    deletePermissions={[Permission.DeletePromotion]}
  />
);
