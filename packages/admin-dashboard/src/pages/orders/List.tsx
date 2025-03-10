import { OrderListSelector } from '@/graphql/orders';
import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  OrderStateBadge,
  priceFormatter,
  TableLabel,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const createDraftOrder = async () => {
  const response = await apiClient('mutation')({
    createDraftOrder: { id: true },
  });
  return response.createDraftOrder.id;
};

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(OrderListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
    ['orders']: [
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
  return response['orders'];
};

export const OrdersListPage = () => {
  const { t } = useTranslation('table');
  const navigate = useNavigate();
  return (
    <DetailList
      filterFields={[
        { key: 'code', operator: 'StringOperators' },
        { key: 'active', operator: 'BooleanOperators' },
        { key: 'customerLastName', operator: 'StringOperators' },
        { key: 'total', operator: 'NumberOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['code', 'customerLastName']}
      entityName="Order"
      type="orders"
      route={{
        create: () => {
          createDraftOrder()
            .then((id) => {
              if (!id) toast.error('Failed to create draft order');
              navigate(Routes.orders.to(id), { viewTransition: true });
            })
            .catch(() => toast.error('Failed to create draft order'));
        },
        edit: (id) => navigate(Routes.orders.to(id), { viewTransition: true }),
      }}
      tableId="orders-list-view"
      fetch={fetch}
      createPermission={Permission.CreateOrder}
      deletePermission={Permission.DeleteOrder}
      hideColumns={['active', 'totalQuantity', 'currencyCode', 'customFields_TEST']}
      additionalColumns={[
        {
          accessorKey: 'payments',
          header: () => <TableLabel>{t('columns.payments')}</TableLabel>,
          accessorFn: (order) => order.payments?.map((payment) => payment.method).join(', '),
        },
        {
          accessorKey: 'shippingAddress',
          header: () => <TableLabel>{t('columns.shippingAddress')}</TableLabel>,
          accessorFn: (order) => {
            if (!order.shippingAddress) return '';
            return order.shippingAddress.fullName;
          },
        },
        {
          accessorKey: 'customer',
          header: () => <TableLabel>{t('columns.customer')}</TableLabel>,
          accessorFn: (order) => order.customer?.emailAddress,
        },
        {
          accessorKey: 'state',
          header: () => <TableLabel>{t('columns.state')}</TableLabel>,
          accessorFn: (order) => order?.state,
          cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
        },
        {
          accessorKey: 'totalWithTax',
          header: () => <TableLabel>{t('columns.total')}</TableLabel>,
          accessorFn: (order) => priceFormatter(order.totalWithTax, order.currencyCode),
        },
        {
          accessorKey: 'code',
          header: () => <TableLabel>{t('columns.code')}</TableLabel>,
          accessorFn: (order) => order.code,
        },
      ]}
    />
  );
};
