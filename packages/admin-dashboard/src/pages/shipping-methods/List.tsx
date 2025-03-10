import { Routes, apiClient, DetailList, PaginationInput, deepMerge } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { ShippingMethodListSelector } from '@/graphql/shippingMethods';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(
    deepMerge(ShippingMethodListSelector, customFieldsSelector ?? {}),
    additionalSelector ?? {},
  );
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
      { items: selector, totalItems: true },
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
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'ShippingMethod'}
      type={'shippingMethods'}
      route={Routes['shippingMethods']}
      tableId="shippingMethods-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateShippingMethod}
      deletePermission={Permission.DeleteShippingMethod}
    />
  );
};
