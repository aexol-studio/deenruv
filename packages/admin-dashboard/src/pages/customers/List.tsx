import { SortOrder } from '@deenruv/admin-types';
import {
  Button,
  apiClient,
  CustomerListSelector,
  deepMerge,
  DetailList,
  PaginationInput,
  Routes,
} from '@deenruv/react-ui-devkit';
import { ArrowRight, CircleCheck, CircleX } from 'lucide-react';
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

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProducts } = await apiClient('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const CustomersListPage = () => (
  <DetailList
    detailLinkColumn="id"
    filterFields={[{ key: 'id', operator: 'IDOperators' }]}
    searchFields={['firstName', 'lastName', 'emailAddress']}
    hideColumns={['customFields', 'user', 'title']}
    additionalColumns={[
      {
        id: 'verified',
        accessorKey: 'createdAt',
        header: () => 'verified',
        cell: ({ row }) => (row.original.user?.verified ? <CircleCheck color="green" /> : <CircleX color="red" />),
      },
      {
        id: 'full-name',
        accessorKey: 'fullName',
        header: () => 'Full Name',
        cell: ({ row }) => {
          const navigate = useNavigate();
          return (
            <Button variant="outline" size="default" onClick={() => navigate(Routes['customers'].to(row.original.id))}>
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
  />
);
