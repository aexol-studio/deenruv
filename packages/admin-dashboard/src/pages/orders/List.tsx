import { Permission, SortOrder, typedGql, scalars } from '@deenruv/admin-types';
import {
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  OrderStateBadge,
  priceFormatter,
  TableLabel,
  useQuery,
  ListLocations,
} from '@deenruv/react-ui-devkit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const tableId = 'orders-list-view';
const { selector } = ListLocations[tableId];

const createDraftOrder = async () => {
  const response = await apiClient('mutation')({
    createDraftOrder: { id: true },
  });
  return response.createDraftOrder.id;
};

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
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
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response['orders'];
};

const PaymentMethodsQuery = typedGql('query', { scalars })({
  paymentMethods: [{}, { items: { code: true, name: true } }],
});

export const OrdersListPage = () => {
  const { data } = useQuery(PaymentMethodsQuery);
  const { t } = useTranslation('table');
  const navigate = useNavigate();

  const getMethodName = useCallback(
    (code: string | undefined) =>
      code
        ? (data?.paymentMethods.items.find((i) => i.code === code)?.name ??
          code?.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()))
        : '-',
    [data],
  );

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
      tableId={tableId}
      fetch={fetch}
      createPermissions={[Permission.CreateOrder]}
      deletePermissions={[Permission.DeleteOrder]}
      hideColumns={['active', 'totalQuantity', 'currencyCode', 'customFields_TEST']}
      additionalColumns={[
        {
          accessorKey: 'payments',
          header: () => <TableLabel>{t('columns.payments')}</TableLabel>,
          accessorFn: (order) => {
            const sorted = order.payments
              ?.sort((a, b) => {
                return a.createdAt > b.createdAt ? -1 : 1;
              })
              .filter((payment) => payment.state === 'Settled');
            return getMethodName(sorted?.at(0)?.method);
          },
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
          accessorKey: 'shipping',
          header: () => <TableLabel>{t('columns.shipping')}</TableLabel>,
          accessorFn: (order) => priceFormatter(order.shipping, order.currencyCode),
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
