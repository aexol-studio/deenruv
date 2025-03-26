import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  Button,
  apiClient,
  CustomerListSelector,
  deepMerge,
  DetailList,
  PaginationInput,
  Routes,
  BooleanCell,
  TableLabel,
  ListBadge,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(CustomerListSelector, additionalSelector ?? {});

  const response = await apiClient('query')({
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

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteCustomers } = await apiClient('mutation')({
      deleteCustomers: [{ ids }, { message: true, result: true }],
    });
    return !!deleteCustomers.length;
  } catch (error) {
    return error;
  }
};

export const CustomersListPage = () => {
  const { t } = useTranslation('table');

  return (
    <DetailList
      detailLinkColumn="id"
      filterFields={[
        { key: 'phoneNumber', operator: 'StringOperators' },
        { key: 'emailAddress', operator: 'StringOperators' },
        { key: 'firstName', operator: 'StringOperators' },
        { key: 'lastName', operator: 'StringOperators' },
        { key: 'postalCode', operator: 'StringOperators' },
        { key: 'title', operator: 'StringOperators' },
      ]}
      searchFields={['firstName', 'lastName', 'emailAddress', 'postalCode']}
      hideColumns={['customFields', 'user', 'title']}
      additionalColumns={[
        {
          id: 'verified',
          accessorKey: 'verified',
          header: () => <TableLabel>{t('columns.verified')}</TableLabel>,
          cell: ({ row }) => <BooleanCell value={!!row.original.user?.verified} />,
        },
        {
          id: 'fullName',
          accessorKey: 'fullName',
          header: () => <TableLabel>{t('columns.fullName')}</TableLabel>,
          cell: ({ row }) => {
            return <ListBadge>{`${row.original.firstName} ${row.original.lastName}`}</ListBadge>;
          },
        },
      ]}
      entityName={'Customer'}
      route={Routes['customers']}
      tableId="customers-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateCustomer]}
      deletePermissions={[Permission.DeleteCustomer]}
    />
  );
};
