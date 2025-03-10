import { Permission, SortOrder } from '@deenruv/admin-types';
import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { PaymentMethodListSelector } from '@/graphql/paymentMethods';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(
    deepMerge(PaymentMethodListSelector, customFieldsSelector ?? {}),
    additionalSelector ?? {},
  );
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
      { items: selector, totalItems: true },
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
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'PaymentMethod'}
      type={'paymentMethods'}
      route={Routes['paymentMethods']}
      tableId="paymentMethods-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreatePaymentMethod}
      deletePermission={Permission.DeletePaymentMethod}
    />
  );
};
