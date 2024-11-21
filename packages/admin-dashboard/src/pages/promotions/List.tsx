import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { deepMerge, GenericList, PaginationInput, PromotionListSelector, Routes } from '@deenruv/react-ui-devkit';

const fetch = async <T,>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
) => {
  const selector = deepMerge(PromotionListSelector, customFieldsSelector ?? {});
  const response = await apiCall()('query')({
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

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deletePromotions } = await apiCall()('mutation')({
      deletePromotions: [{ ids }, { message: true, result: true }],
    });
    return !!deletePromotions.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const PromotionsListPage = () => (
  <GenericList
    searchFields={['name']}
    entityName={'Promotion'}
    type={'promotions'}
    route={Routes['promotions']}
    tableId="promotions-list-view"
    fetch={fetch}
    onRemove={onRemove}
  />
);
