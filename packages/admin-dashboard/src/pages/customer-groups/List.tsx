import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { CustomerGroupListSelector } from '@/graphql/customerGroups';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(CustomerGroupListSelector, additionalSelector ?? {});
  const response = await apiClient('query')({
    customerGroups: [
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
  return response.customerGroups;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteCustomerGroups } = await apiClient('mutation')({
      deleteCustomerGroups: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteCustomerGroups.length;
  } catch (error) {
    return error;
  }
};

export const CustomerGroupsListPage = () => (
  <DetailList
    filterFields={[{ key: 'name', operator: 'StringOperators' }]}
    detailLinkColumn="id"
    searchFields={['name']}
    hideColumns={['customFields', 'translations', 'collections', 'variantList']}
    entityName={'CustomerGroupList'}
    route={Routes['customerGroups']}
    tableId="customerGroups-list-view"
    fetch={fetch}
    onRemove={onRemove}
    createPermissions={[Permission.CreateCustomerGroup]}
    deletePermissions={[Permission.DeleteCustomerGroup]}
  />
);
