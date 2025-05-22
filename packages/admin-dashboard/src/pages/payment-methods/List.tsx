import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  ListLocations,
  EntityChannelManagementBulkAction,
} from '@deenruv/react-ui-devkit';

const tableId = 'paymentMethods-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    paymentMethods: [
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
  return response['paymentMethods'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deletePaymentMethods } = await apiClient('mutation')({
      deletePaymentMethods: [{ ids }, { message: true, result: true }],
    });
    return !!deletePaymentMethods.length;
  } catch (error) {
    return error;
  }
};

export const PaymentMethodsListPage = () => {
  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'code', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
      ]}
      additionalBulkActions={[...EntityChannelManagementBulkAction(tableId)]}
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'PaymentMethod'}
      route={Routes['paymentMethods']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreatePaymentMethod]}
      deletePermissions={[Permission.DeletePaymentMethod]}
    />
  );
};
