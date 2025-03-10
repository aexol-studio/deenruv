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
} from '@deenruv/react-ui-devkit';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(CustomerListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});

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
          id: 'full-name',
          accessorKey: 'fullName',
          header: () => <TableLabel>{t('columns.fullName')}</TableLabel>,
          cell: ({ row }) => {
            const navigate = useNavigate();
            return (
              <Button
                variant="outline"
                // size="default"
                className="h-6 border border-gray-500 p-0 px-3 text-gray-800 hover:border-gray-600 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                onClick={() => navigate(Routes['customers'].to(row.original.id), { viewTransition: true })}
              >
                {`${row.original.firstName} ${row.original.lastName}`}
                <ArrowRight className="pl-1" size={16} />
              </Button>
            );
          },
        },
      ]}
      entityName={'Customer'}
      type={'customers'}
      route={Routes['customers']}
      tableId="customers-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateCustomer}
      deletePermission={Permission.DeleteCustomer}
    />
  );
};
