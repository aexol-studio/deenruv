import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { CustomerListSelector, deepMerge, GenericList, PaginationInput, Routes } from '@deenruv/react-ui-devkit';
import { CircleCheck, CircleX } from 'lucide-react';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(CustomerListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});

  const response = await apiCall()('query')({
    customers: [
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
  return response['customers'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProducts } = await apiCall()('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const CustomersListPage = () => (
  <GenericList
    searchFields={['firstName', 'lastName', 'emailAddress']}
    hideColumns={['customFields', 'user', 'title']}
    additionalColumns={[
      {
        id: 'verified',
        accessorKey: 'createdAt',
        header: () => 'verified',
        cell: ({ row }) => (row.original.user?.verified ? <CircleCheck color="green" /> : <CircleX color="red" />),
      },
    ]}
    entityName={'Customer'}
    type={'customers'}
    route={Routes['customers']}
    tableId="customers-list-view"
    fetch={fetch}
    onRemove={onRemove}
  />
);
