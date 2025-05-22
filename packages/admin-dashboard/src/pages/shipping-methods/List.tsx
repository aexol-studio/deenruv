import {
  Routes,
  apiClient,
  DetailList,
  PaginationInput,
  deepMerge,
  ListLocations,
  EntityChannelManagementBulkAction,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'shippingMethods-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    shippingMethods: [
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
  return response['shippingMethods'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteShippingMethods } = await apiClient('mutation')({
      deleteShippingMethods: [{ ids }, { message: true, result: true }],
    });
    return !!deleteShippingMethods.length;
  } catch (error) {
    return error;
  }
};

export const ShippingMethodsListPage = () => {
  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'code', operator: 'StringOperators' },
      ]}
      additionalBulkActions={[...EntityChannelManagementBulkAction(tableId)]}
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'ShippingMethod'}
      route={Routes['shippingMethods']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateShippingMethod]}
      deletePermissions={[Permission.DeleteShippingMethod]}
    />
  );
};
